import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChartsofAccounts = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [accountList, setAccountList] = useState([]);
  const [expandedAccounts, setExpandedAccounts] = useState({});
  const [newAccount, setNewAccount] = useState({
    parent_id: "",
    account_name: "",
    initial_amount: "",
    account_nature: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchChartAccount = async () => {
    try {
      const response = await axios.get(`${url}/chartaccount/get`);
      setAccountList(response.data.data);
    } catch (error) {
      console.log("Error fetching chartaccount records:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      let newChartAccount;

      if (newAccount.parent_id) {
        newChartAccount = {
          name: accountList.find(
            (account) => account._id === newAccount.parent_id
          )?.name,
          subCat: [
            {
              parent_id: newAccount.parent_id,
              name: newAccount.account_name,
              amount: parseFloat(newAccount.initial_amount),
              account_nature: newAccount.account_nature,
            },
          ],
        };
      } else {
        newChartAccount = {
          name: newAccount.account_name,
          subCat: [],
        };
      }

      await axios.post(`${url}/chartaccount/add`, newChartAccount);
      toast.success("Account created Successfully!");
      setShowAddForm(false);
      setNewAccount({
        parent_id: "",
        account_name: "",
        initial_amount: "",
        account_nature: "",
      });
      fetchChartAccount();
    } catch (error) {
      console.log("Error adding chartaccount:", error);
    }
  };

  const toggleExpand = (accountId) => {
    setExpandedAccounts((prevExpanded) => ({
      ...prevExpanded,
      [accountId]: !prevExpanded[accountId],
    }));
  };

  const handleNatureChange = (e) => {
    const { value } = e.target;
    setNewAccount((prevchartaccount) => ({
      ...prevchartaccount,
      account_nature: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({ ...newAccount, [name]: value });
  };

  const filteredAccounts = accountList.filter((account) =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchChartAccount();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Accounts List</h1>
      <div className="flex flex-col md:flex-row justify-between mb-5">
        <div className="border border-gray-400 rounded-md flex h-10">
          <input
            type="text"
            className="outline-none w-full rounded-md px-2 py-1.5"
            placeholder="Search Accounts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="h-full px-4 text-lg text-gray-500">
            <FaSearch />
          </button>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            className="bg-[#067528] text-white font-semibold px-4 flex items-center gap-2 rounded-md py-2"
            onClick={() => setShowAddForm(true)}
          >
            <FaPlus className="text-sm" />
            Add Accountant
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-full max-w-md">
            <h1 className="text-lg font-semibold mb-5">Add Accountant</h1>
            <form className="space-y-6" onSubmit={handleAdd}>
              <div className="w-full text-left">
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="parent_id"
                >
                  Main Account
                </label>
                <select
                  id="parent_id"
                  name="parent_id"
                  value={newAccount.parent_id}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                >
                  <option value="">Select Main Account</option>
                  {accountList.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full text-left">
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="account_name"
                >
                  Account Name
                </label>
                <input
                  type="text"
                  id="account_name"
                  name="account_name"
                  value={newAccount.account_name}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter Account Name"
                  required
                />
              </div>

              {newAccount.parent_id && (
                <>
                  <div className="w-full text-left">
                    <label
                      className="block text-gray-700 font-semibold mb-1"
                      htmlFor="initial_amount"
                    >
                      Initial Amount
                    </label>
                    <input
                      type="number"
                      id="initial_amount"
                      name="initial_amount"
                      value={newAccount.initial_amount}
                      onChange={handleChange}
                      className="border w-full px-2 outline-none py-2 rounded-md"
                      placeholder="Enter Initial Amount"
                      required
                    />
                  </div>

                  <div className="w-full text-left">
                    <label className="block text-gray-700 font-semibold mb-1">
                      Nature of Account
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="account_nature"
                          value="Debit"
                          onChange={handleNatureChange}
                          checked={newAccount.account_nature === "Debit"}
                          className="cursor-pointer"
                        />
                        Debit
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="account_nature"
                          value="Credit"
                          onChange={handleNatureChange}
                          checked={newAccount.account_nature === "Credit"}
                          className="cursor-pointer"
                        />
                        Credit
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="text-right space-x-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-red-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-[#067528] text-white rounded-lg font-semibold"
                  type="submit"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredAccounts.map((account) => (
          <div
            key={account._id}
            className="border rounded-lg p-4 bg-white shadow-md"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(account._id)}
            >
              <h2 className="text-lg font-semibold">{account.name}</h2>
              <button
                className="text-gray-500"
                onClick={() => toggleExpand(account._id)}
              >
                {expandedAccounts[account._id] ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </button>
            </div>

            {expandedAccounts[account._id] && account.subCat.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-md font-semibold">Sub Accounts:</h3>
                {account.subCat.map((subAccount, index) => (
                  <div key={index} className="p-2 border-l-4 border-[#067528]">
                    <p>
                      <strong>Name:</strong> {subAccount.name}
                    </p>
                    <p>
                      <strong>Amount:</strong> {subAccount.amount}
                    </p>
                    <p>
                      <strong>Nature:</strong> {subAccount.account_nature}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartsofAccounts;
