import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { RotatingLines } from "react-loader-spinner";
import { NavLink } from "react-router-dom";

const BankAccounts = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBank, setNewBank] = useState({
    account_name: "",
    type: "",
    bank_name: "",
    number: "",
    address: "",
    amount: "",
  });
  const [loading, setLoading] = useState(true);
  const [editingBankId, setEditingBankId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [banksList, setBanksList] = useState([]);
  const [sortOrder, setSortOrder] = useState({ key: "", order: "asc" });
  const filteredBank = banksList
    .filter((bank) =>
      bank.account_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder.key) {
        if (sortOrder.order === "asc") {
          return a[sortOrder.key] > b[sortOrder.key] ? 1 : -1;
        } else {
          return a[sortOrder.key] < b[sortOrder.key] ? 1 : -1;
        }
      }
      return 0;
    });

  const fetchbank = async () => {
          setLoading(true);
    try {
      const response = await axios.get(
        `${url}/bank/get?page=${currentPage}&limit=${recordsPerPage}&search=${searchQuery}`
      );
      setBanksList(response.data.BankList);
      console.log(response.data.BankList);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      
    } catch (error) {
      console.log("Error fetching bank records:", error);
      toast.error("Error fetching bank records");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/bank/add`, newBank);
      toast.success("Account Created Successfully!");
      setShowAddForm(false);
      setNewBank({
        account_name: "",
        type: "",
        bank_name: "",
        number: "",
        address: "",
        amount: "",
      });
      fetchbank();
    } catch (error) {
      console.log("Error adding bank:", error);
    }
  };

  const handleEditClick = (bank) => {
    setEditingBankId(bank._id);
    setEditableData(bank);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`${url}/bank/update`, {
        id: editableData._id,
        ...editableData,
      });
      setEditingBankId(null);
      fetchbank();
    } catch (error) {
      console.error("Error updating bank:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingBankId(null);
    setEditableData({});
  };
  const handleDelete = async (id) => {
    const confirmDelete = () => {
      toast.dismiss();
      deleteVoucher(id);
    };

    toast.info(
      <div>
        Are you sure you want to delete this account?
        <div className="flex justify-end mt-2">
          <button
            onClick={confirmDelete}
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
  const deleteVoucher = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${url}/bank/delete`, { data: id });
      if (response.data.success) {
        await axios.delete(`${url}/bank/delete`, { data: { id } });
        toast.success("Account deleted successfully!");
        fetchbank();
      } else {
        toast.error("Error deleting account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Error deleting account");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBank({ ...newBank, [name]: value });
  };
  const handleSort = (key) => {
    setSortOrder((prevSortOrder) => ({
      key,
      order: prevSortOrder.order === "asc" ? "desc" : "asc",
    }));
  };
  

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      //  fetchHaari();
    }
  };
  useEffect(() => {
    fetchbank();
  }, [currentPage, searchQuery]);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-xl mb-5 font-semibold text-left">
          Bank Accounts List
        </h1>
        <NavLink to="/admin/bankpaydetails">
          <p className="flex items-center gap-2 text-lg">
            <AiOutlineArrowLeft /> Back
          </p>
        </NavLink>
      </div>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
            placeholder="Search Bank Account"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            Add Bank Account
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10">
            <h1 className="text-lg font-semibold mb-5">Add Bank Account</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAdd}>
              <div className="flex gap-4">
                <div className="w-1/2 text-left">
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
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Enter Account Name"
                    value={newBank.account_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-1/2 text-left">
                  <label
                    className="block text-gray-700 font-semibold mb-1"
                    htmlFor="type"
                  >
                    Account Type
                  </label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Enter Account Type"
                    value={newBank.type}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1/2 text-left">
                  <label
                    className="block text-gray-700 font-semibold mb-1"
                    htmlFor="number"
                  >
                    Bank Account Number
                  </label>
                  <input
                    type="number"
                    id="number"
                    name="number"
                    value={newBank.number}
                    onChange={handleChange}
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Enter Account Number"
                    required
                  />
                </div>
                <div className="w-1/2 text-left">
                  <label
                    className="block text-gray-700 font-semibold mb-1"
                    htmlFor="bank_name"
                  >
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bank_name"
                    name="bank_name"
                    value={newBank.bank_name}
                    onChange={handleChange}
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Enter Bank Name"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1/2 text-left">
                  <label
                    className="block text-gray-700 font-semibold mb-1"
                    htmlFor="address"
                  >
                    Bank Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={newBank.address}
                    onChange={handleChange}
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Enter Bank Address"
                    required
                  />
                </div>
                <div className="w-1/2 text-left">
                  <label
                    className="block text-gray-700 font-semibold mb-1"
                    htmlFor="amount"
                  >
                    Opening Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={newBank.amount}
                    onChange={handleChange}
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Enter Amount"
                    required
                  />
                </div>
              </div>
              <div className="pt-8 flex justify-end gap-7">
                <button
                  className="text-red-600 font-semibold px-3 py-1 rounded-md"
                  type="button"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-3 py-1 rounded-md"
                  type="submit"
                >
                  Submit
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
            <div className="grid grid-cols-6 bg-[#e0f2e9] text-xs md:text-base">
              <div
                className="py-3 text-center text-gray-800 font-semibold text-wrap  px-2 cursor-pointer"
                onClick={() => handleSort("account_name")}
              >
                 Account Name{" "}
                {sortOrder.key === "account_name" ? (
                  <span className="inline-block ml-2 -mt-1 align-middle text-xs">
                    {sortOrder.order === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div
                className="py-3 text-center text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("type")}
              >
                Bank Type{" "}
                {sortOrder.key === "type" ? (
                  <span className="inline-block align-middle text-xs">
                    {sortOrder.order === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div
                className="py-3 text-center text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("bank_name")}
              >
                Bank Name{" "}
                {sortOrder.key === "bank_name" ? (
                  <span className="inline-block align-middle text-xs">
                    {sortOrder.order === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div
                className="py-3 text-center text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("number")}
              >
               Account Number{" "}
                {sortOrder.key === "number" ? (
                  <span className="inline-block align-middle text-xs">
                    {sortOrder.order === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div
                className="py-3 text-center text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("total_balance")}
              >
                Bank Balance{" "}
                {sortOrder.key === "total_balance" ? (
                  <span className="inline-block align-middle text-xs">
                    {sortOrder.order === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="py-3 px-4 text-center text-gray-800 font-semibold">
                Actions
              </div>
            </div>

            {filteredBank.map((bank) => (
              <div
                key={bank._id}
                className="grid grid-cols-6 gap-2 border-b text-gray-700 text-[10px] md:text-sm hover:bg-gray-100"
              >
                <div className="py-3 text-center max-w-xs">
                  {editingBankId === bank._id ? (
                    <input
                      type="text"
                      name="account_name"
                      value={editableData.account_name}
                      onChange={handleEditChange}
                      className="border rounded px-2 w-full"
                    />
                  ) : (
                    bank.account_name
                  )}
                </div>
                <div className="py-3 text-center max-w-xs">
                  {editingBankId === bank._id ? (
                    <input
                      type="text"
                      name="type"
                      value={editableData.type}
                      onChange={handleEditChange}
                      className="border rounded px-2 w-full"
                    />
                  ) : (
                    bank.type
                  )}
                </div>
                <div className="py-3 text-center max-w-xs">
                  {editingBankId === bank._id ? (
                    <input
                      type="text"
                      name="bank_name"
                      value={editableData.bank_name}
                      onChange={handleEditChange}
                      className="border rounded px-2 w-full"
                    />
                  ) : (
                    bank.bank_name
                  )}
                </div>
                <div className="py-3 text-center max-w-xs">
                  {editingBankId === bank._id ? (
                    <input
                      type="text"
                      name="number"
                      value={editableData.number}
                      onChange={handleEditChange}
                      className="border rounded px-2 w-28"
                    />
                  ) : (
                    bank.number
                  )}
                </div>
                <div className="py-3 text-center max-w-xs">
                  {editingBankId === bank._id ? (
                    <input
                      type="text"
                      name="total_balance"
                      value={editableData.total_balance}
                      onChange={handleEditChange}
                      className="border rounded px-2 w-full"
                    />
                  ) : (
                    bank.total_balance
                  )}
                </div>
                <div className="py-3 md:px-4 text-center flex justify-center">
                  {editingBankId === bank._id ? (
                    <>
                      <button
                        className="text-green-500 py-1 md:px-2 rounded-md flex items-center gap-2 mr-2"
                        onClick={handleSaveClick}
                      >
                        <FaSave className="text-sm" />
                      </button>
                      <button
                        className="text-gray-700 py-1 md:px-2 rounded-md flex items-center gap-2"
                        onClick={handleCancelEdit}
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text-green-600 py-1 md:px-2 rounded-md flex items-center gap-2 mr-2"
                        onClick={() => handleEditClick(bank)}
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        className="text-red-600 py-1 md:px-2 rounded-md flex items-center"
                        onClick={() => handleDelete(bank._id)}
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
  );
};

export default BankAccounts;
