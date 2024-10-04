import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const BankAccounts = () => {
   const url = "http://localhost:3002";
   const [showAddForm, setShowAddForm] = useState(false);
   const [banksList, setBanksList] = useState([]);
  const [newBank, setNewBank] = useState({
    account_name: "",
    type: "", 
    bank_name: "",
    number: "",
    address: "",
    amount: "", 
  });

   const [editingBankId, setEditingBankId] = useState(null);
  const [editableData, setEditableData] = useState({});
     const [searchQuery, setSearchQuery] = useState("");
     const filteredBank = banksList.filter((bank) =>
       bank.account_name?.toLowerCase().includes(searchQuery.toLowerCase())
     );

   const fetchbank = async () => {
     try {
       const response = await axios.get(`${url}/bank/get`);
       setBanksList(response.data.data);
     } catch (error) {
       console.log("Error fetching bank records:", error);
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
     try {
       await axios.delete(`${url}/bank/delete`, { data: { id } });
       fetchbank();
     } catch (error) {
       console.log("Error deleting bank:", error);
     }
   };

   const handleChange = (e) => {
     const { name, value } = e.target;
     setNewBank({ ...newBank, [name]: value });
   };

   useEffect(() => {
     fetchbank();
   }, []);
  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">
        Bank Accounts List
      </h1>
      <div className="flex justify-between ">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
            placeholder="Search Role"
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
                <input
                  type="text"
                  id="account_name"
                  name="account_name"
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter Bank Account Name"
                  value={newBank.account_name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  id="type"
                  name="type"
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter Bank Type"
                  value={newBank.type}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-4">
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
                    placeholder="Enter bank Number"
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

              {/* Buttons */}
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

      <table className="min-w-full max-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Bank Name
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Bank Type
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Bank Name
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Bank Account Number
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Bank Address
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredBank.map((bank) => (
            <tr
              key={bank._id}
              className="border-b text-gray-700 text-sm hover:bg-gray-100"
            >
              <td className="py-3 px-4 max-w-xs">
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
              </td>
              <td className="py-3 px-4 max-w-xs">
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
              </td>
              <td className="py-3 px-4 max-w-xs">
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
              </td>
              <td className="py-3 px-4 max-w-xs text-center">
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
              </td>
              <td className="py-3 px-4 max-w-xs">
                {editingBankId === bank._id ? (
                  <input
                    type="text"
                    name="address"
                    value={editableData.address}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  bank.address
                )}
              </td>
              <td className="py-3 px-4 flex">
                {editingBankId === bank._id ? (
                  <>
                    <button
                      className="bg-green-500 text-white py-1 px-2 rounded-md flex items-center gap-2 mr-2"
                      onClick={handleSaveClick}
                    >
                      <FaSave className="text-sm" />
                    </button>
                    <button
                      className="bg-gray-500 text-white py-1 px-2 rounded-md flex items-center gap-2"
                      onClick={handleCancelEdit}
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className=" text-green-600 py-1 px-2 rounded-md flex items-center gap-2 mr-2"
                      onClick={() => handleEditClick(bank)}
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      className=" text-red-500 py-1 px-2 rounded-md flex items-center gap-2"
                      onClick={() => handleDelete(bank._id)}
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankAccounts;
