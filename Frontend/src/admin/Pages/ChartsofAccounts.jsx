import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";

const ChartsofAccounts = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [accountList, setAccountList] = useState([]);
  const [expandedAccounts, setExpandedAccounts] = useState({}); // Track expanded state for each main account
  const [newAccount, setNewAccount] = useState({
    parent_id: "",
    account_name: "",
    initial_amount: "",
    account_nature: "",
  });

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
        // Adding a sub-account
        newChartAccount = {
          name: accountList.find(
            (account) => account._id === newAccount.parent_id
          )?.name, // Set main account name
          subCat: [
            {
              parent_id: newAccount.parent_id,
              name: newAccount.account_name, // Sub-account name
              amount: parseFloat(newAccount.initial_amount),
              account_nature: newAccount.account_nature,
            },
          ],
        };
      } else {
        // Adding a main account
        newChartAccount = {
          name: newAccount.account_name, // Main account name
          subCat: [],
        };
      }

      await axios.post(`${url}/chartaccount/add`, newChartAccount);
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

  useEffect(() => {
    fetchChartAccount();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Accounts List</h1>
      <div className="flex justify-between ">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
            placeholder="Search Accounts"
          />
          <button className="h-full px-4 text-lg text-gray-500">
            <FaSearch />
          </button>
        </div>
        <div>
          <button
            className="bg-[#067528] text-white font-semibold px-4 flex items-center gap-2 rounded-md py-2 mb-5"
            onClick={() => setShowAddForm(true)}
          >
            <FaPlus className="text-sm" />
            Add Accountant
          </button>
        </div>
      </div>

      {/* Display Accounts */}
      <div className="space-y-4">
        {accountList.map((account) => (
          <div
            key={account._id}
            className="border rounded-lg p-4 bg-white shadow-md"
          >
            <div className="flex justify-between items-center">
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

            {/* Show sub-accounts if the account is expanded */}
            {expandedAccounts[account._id] && account.subCat.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-md font-semibold">Sub-Accounts:</h3>
                <table className="min-w-full border">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Sub-Account Name</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {account.subCat.map((sub) => (
                      <tr key={sub._id} className="border-b">
                        <td className="px-4 py-2">{sub.name}</td>
                        <td className="px-4 py-2">{sub.amount}</td>
                        <td className="px-4 py-2">{sub.account_nature}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10">
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
                          className="rounded-full h-5 w-5"
                        />
                        <span>Debit</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="account_nature"
                          value="Credit"
                          onChange={handleNatureChange}
                          checked={newAccount.account_nature === "Credit"}
                          className="rounded-full h-5 w-5"
                        />
                        <span>Credit</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="text-center space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-red-500 font-semibold rounded-md px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#067528] text-white font-semibold rounded-md px-4 py-2"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartsofAccounts;
