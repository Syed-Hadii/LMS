import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaSave,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";

const ChartsofAccounts = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedAccounts, setExpandedAccounts] = useState({});
  const [editAccountId, setEditAccountId] = useState(null);
  const [newAccount, setNewAccount] = useState({
    parent_id: "",
    account_name: "",
    initial_amount: "",
    account_nature: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [accountList, setAccountList] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  const fetchAllAccount = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/chartaccount/get?all=true`);
      if (response) {
        setAllAccounts(response.data.chartAccounts);
        console.log("All Accounts:", response);
        const total = response.data.chartAccounts.reduce((acc, account) => {
          return acc + Number(account.total_balance || 0);
        }, 0);

        setTotalBalance(total);
      }
    } catch (error) {
      console.log("Error fetching all accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartAccount = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/chartaccount/get?page=${currentPage}&limit=${recordsPerPage}&search=${searchTerm}`
      );
      if (response) {
        setAccountList(response.data.chartAccounts);
        console.log(response);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } else {
        setAccountList([]);
      }
    } catch (error) {
      console.log("Error fetching chart account records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      let newChartAccount;

      if (newAccount.parent_id) {
        // Creating a sub-account
        newChartAccount = {
          subCat: [
            {
              parent_id: newAccount.parent_id,
              name: newAccount.account_name,
              amount: parseFloat(newAccount.initial_amount), // Only amount is needed
            },
          ],
        };
      } else {
        // Creating a main account
        newChartAccount = {
          acc_name: newAccount.account_name,
          account_nature: newAccount.account_nature, // Only relevant for main account
          subCat: [],
        };
      }

      await axios.post(`${url}/chartaccount/add`, newChartAccount);
      toast.success("Account created successfully!");
      setShowAddForm(false);
      resetNewAccount();
      fetchChartAccount();
      fetchAllAccount();
    } catch (error) {
      console.log("Error adding chart account:", error);
    }
  };

  const handleEdit = async (
    accountId,
    isSubAccount = false,
    subAccount = null
  ) => {
    try {
      const editedAccount = isSubAccount
        ? {
            accountId,
            subAccountId: subAccount._id, // Provide the sub-account ID
            subCat: {
              name: newAccount.account_name,
              amount: parseFloat(newAccount.initial_amount),
              account_nature: newAccount.account_nature,
            },
          }
        : {
            accountId,
            acc_name: newAccount.account_name,
          };

      await axios.put(`${url}/chartaccount/update`, editedAccount);
      toast.success("Account updated successfully!");
      setEditAccountId(null);
      resetNewAccount();
      fetchChartAccount();
    } catch (error) {
      console.log("Error updating account:", error);
    }
  };

  const cancelEdit = () => {
    setEditAccountId(null);
    resetNewAccount();
  };
const handleDelete = async (accountId, subAccountId = null) => {
  const isSubAccount = Boolean(subAccountId); // Determine if it's a sub-account

  console.log("Handle Delete Called:");
  console.log("Account ID:", accountId); // Log Account ID
  console.log("Sub-Account ID:", subAccountId); // Log Sub-Account ID

  toast.info(
    <div>
      Are you sure you want to delete this{" "}
      {isSubAccount ? "Sub-Account" : "Account"}?
      <div className="flex justify-end mt-2">
        <button
          onClick={() => deleteVoucher(accountId, subAccountId)}
          className="mr-2 px-2 py-1 bg-red-500 text-white rounded"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss()}
          className="px-2 py-1 bg-gray-400 text-white rounded"
        >
          No
        </button>
      </div>
    </div>,
    { autoClose: false }
  );
};

const deleteVoucher = async (accountId, subAccountId) => {
  setLoading(true);
  console.log("Delete Voucher Called:");
  console.log("Account ID:", accountId);
  console.log("Sub-Account ID:", subAccountId); // Log Sub-Account ID

  try {
    const endpoint = `${url}/chartaccount/delete`; // Single endpoint for deleting both accounts and sub-accounts

    // Prepare request body
    const requestBody = { accountId };
    if (subAccountId) {
      requestBody.subAccountId = subAccountId; // Include subAccountId if provided
    }

    console.log("Request Body:", requestBody); // Log the request body

    const response = await axios.delete(endpoint, { data: requestBody });

    if (response.status === 200) {
      toast.dismiss();
      toast.success(
        `${subAccountId ? "Sub-Account" : "Account"} deleted successfully!`
      );
      fetchChartAccount(); // Re-fetch data after deletion
    } else {
      toast.error(`Error deleting ${subAccountId ? "Sub-Account" : "Account"}`);
    }
  } catch (error) {
    console.error(
      `Error deleting ${subAccountId ? "Sub-Account" : "Account"}:`,
      error
    );
    toast.error(`Error deleting ${subAccountId ? "Sub-Account" : "Account"}`);
  } finally {
    setLoading(false);
  }
};



  const resetNewAccount = () => {
    setNewAccount({
      parent_id: "",
      account_name: "",
      initial_amount: "",
      account_nature: "", // Reset for main account form
    });
  };

  const toggleExpand = (id) => {
    setExpandedAccounts((prevId) => (prevId === id ? null : id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAccount({ ...newAccount, [name]: value });
  };

  const filteredAccounts = accountList.filter((account) =>
    account.acc_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    fetchChartAccount();
    fetchAllAccount();
  }, [currentPage, searchTerm]);

  // total balnce for summary
  const calculateTotalBalance = () => {
    // Initialize totals
    let totalBalance = 0;
    let totalDebitAmount = 0;
    let totalCreditAmount = 0;

    // Calculate totals
    allAccounts.forEach((account) => {
      const debitAmount = Number(account.total_debit_amount) || 0; // Ensure numeric value
      const creditAmount = Number(account.total_credit_amount) || 0; // Ensure numeric value

      totalDebitAmount += debitAmount;
      totalCreditAmount += creditAmount;
      totalBalance += debitAmount - creditAmount; // Update total balance
    });

    // Set state values
    console.log("Total Balance Calculated:", totalBalance);
    console.log("Total Debit Amount:", totalDebitAmount);
    console.log("Total Credit Amount:", totalCreditAmount);

    setTotalBalance(totalBalance);
    setTotalDebit(totalDebitAmount); // Ensure you have a state to store total debit
    setTotalCredit(totalCreditAmount); // Ensure you have a state to store total credit
  };

  useEffect(() => {
    if (allAccounts && allAccounts.length > 0) {
      calculateTotalBalance();
    }
  }, [allAccounts]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl mb-5 font-semibold text-left">Accounts List</h1>
      <div className="flex flex-col md:flex-row justify-between mb-5">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
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
            className="bg-green-600 text-white font-semibold px-4 flex items-center gap-2 rounded-md py-2"
            onClick={() => setShowAddForm(true)}
          >
            <FaPlus className="text-sm" />
            Add Account
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-full max-w-md">
            <h1 className="text-lg font-semibold mb-5">Add Account</h1>
            <form className="space-y-6" onSubmit={handleAdd}>
              {/* Main Account Dropdown */}
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
                  {allAccounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.acc_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Name Input */}
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

              {/* Show Account Nature for Main Account Only */}
              {!newAccount.parent_id && (
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
                        onChange={handleChange}
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
                        onChange={handleChange}
                        checked={newAccount.account_nature === "Credit"}
                        className="cursor-pointer"
                      />
                      Credit
                    </label>
                  </div>
                </div>
              )}

              {/* Initial Amount for Sub-Accounts */}
              {newAccount.parent_id && (
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
              )}

              {/* Form Buttons */}
              <div className="text-right space-x-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-red-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold"
                  type="submit"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <RotatingLines width="50" strokeColor="#067528" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-4 bg-[#e0f2e9] text-center text-sm md:text-base">
              <div className="py-3 text-gray-800 font-semibold">
                Account Name
              </div>
              <div className="py-3 text-gray-800 font-semibold">
                Debit Balance
              </div>
              <div className="py-3 text-gray-800 font-semibold">
                Credit Balance
              </div>
              <div className="py-3 text-gray-800 font-semibold -ml-5">
                Actions
              </div>
            </div>
            {filteredAccounts.map((account) => (
              <div
                key={account._id}
                className="border border-gray-300 rounded-md mb-4"
              >
                {/* Account Header */}
                <div
                  className="grid grid-cols-4 text-center cursor-pointer"
                  onClick={() => toggleExpand(account._id)}
                >
                  <div className="py-2">{account.acc_name}</div>
                  <div className="py-2">{account.total_debit_amount}</div>
                  <div className="py-2">{account.total_credit_amount}</div>
                  <div className="py-2 flex justify-between items-center">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditAccountId(account._id);
                          setNewAccount({ account_name: account.acc_name });
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(account._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <button
                      onClick={() => toggleExpand(account._id)}
                      className="text-gray-600 hover:text-gray-800 mr-2"
                    >
                      {expandedAccounts === account._id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Section */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expandedAccounts === account._id
                      ? "max-h-screen"
                      : "max-h-0"
                  }`}
                >
                  <div className="mt-2 border border-gray-300 rounded-md shadow-md">
                    {account.subCat.map((subAccount) => (
                      <div
                        key={subAccount._id}
                        className="border-b last:border-none p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">
                              {subAccount.name}
                            </h3>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setEditAccountId(subAccount._id);
                                setNewAccount({
                                  account_name: subAccount.name,
                                  initial_amount: subAccount.amount,
                                });
                              }}
                              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(account, subAccount._id)
                              }
                              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-600">
                              Opening Amount
                            </span>
                            <span className="font-medium text-gray-800">
                              {subAccount.amount}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-600">
                              Account Balance
                            </span>
                            <span className="font-medium text-gray-800">
                              {subAccount.balance}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit Section */}
                  {editAccountId && (
                    <div className="bg-white p-4 shadow-md mt-2 rounded-md">
                      <h2 className="font-semibold mb-2">Edit Account</h2>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleEdit(editAccountId);
                        }}
                      >
                        <input
                          type="text"
                          name="account_name"
                          value={newAccount.account_name}
                          onChange={handleChange}
                          className="border w-full px-2 py-1 rounded-md"
                          placeholder="Account Name"
                        />
                        <input
                          type="number"
                          name="initial_amount"
                          value={newAccount.initial_amount}
                          onChange={handleChange}
                          className="border w-full px-2 py-1 rounded-md mt-2"
                          placeholder="Initial Amount"
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            className="px-2 py-1 rounded-md text-gray-500 hover:bg-gray-200"
                            type="button"
                            onClick={cancelEdit}
                          >
                            <FaTimes />
                          </button>
                          <button
                            className="text-green-600 px-4 py-1 rounded-md hover:bg-green-200"
                            type="submit"
                          >
                            <FaSave />
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-end justify-between ">
        <div className="bg-white p-4 rounded-md shadow-md mt-4 w-full max-w-sm">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            Account Summary
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between pt-2 mt-2">
              <span className="font-medium">Total Debit:</span>
              <span className={`font-semibold`}>PKR {totalDebit}</span>
            </div>
            <div className="flex justify-between pt-2 mt-2">
              <span className="font-medium">Total Credit:</span>
              <span
                className={`font-semibold
                  `}
              >
                PKR {totalCredit}
              </span>
            </div>
            <div className="flex justify-between pt-2 mt-2">
              <span className="font-medium">Balance:</span>
              <span
                className={`font-semibold ${
                  totalBalance < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                PKR {totalBalance}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-2 border rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            &laquo; Previous
          </button>
          <span className="mx-4">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 mx-2 border rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartsofAccounts;
