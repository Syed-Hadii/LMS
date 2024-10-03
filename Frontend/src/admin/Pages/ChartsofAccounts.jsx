import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";

const ChartsofAccounts = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [banksList, setBanksList] = useState([]);
  const [newBank, setNewBank] = useState({
    main_account: "", 
    sub_account: "",
    account_name: "",
    initial_amount: "", // Keep this as string to accommodate input handling
    nature_of_account: [], // Array to store Debit/Credit selection
  });

  const [editingBankId, setEditingBankId] = useState(null);
  const [editableData, setEditableData] = useState({});

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
      setShowAddForm(false);
      setNewBank({
        main_account: "",
        sub_account: "",
        account_name: "",
        initial_amount: "",
        nature_of_account: [],
      });
      fetchbank();
    } catch (error) {
      console.log("Error adding bank:", error);
    }
  };

  const handleNatureChange = (e) => {
    const { value } = e.target;
    setNewBank((prevBank) => {
      // Toggle selection of Debit/Credit
      if (prevBank.nature_of_account.includes(value)) {
        return {
          ...prevBank,
          nature_of_account: prevBank.nature_of_account.filter(
            (item) => item !== value
          ),
        };
      } else {
        return {
          ...prevBank,
          nature_of_account: [...prevBank.nature_of_account, value],
        };
      }
    });
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
      <h1 className="text-3xl underline font-bold text-center">
        Accounts List
      </h1>
      <button
        className="bg-[#067528] text-white font-semibold px-4  flex items-center gap-2  rounded-md py-2 mb-5"
        onClick={() => {
          setShowAddForm(true);
        }}
      >
        <FaPlus className="text-sm " />
        Add Accountant
      </button>

      {/* Add Form */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10">
            <h1 className="text-lg font-semibold mb-5">Add Accountant</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAdd}>
              {/* Flex container for two fields per row */}
              <div className="flex gap-4">
                {/* Main Account Dropdown */}
                <div className="w-1/2 text-left">
                  <label
                    className="block text-gray-700 font-semibold mb-1"
                    htmlFor="main_account"
                  >
                    Main Account
                  </label>
                  <select
                    id="main_account"
                    name="main_account"
                    value={newBank.main_account}
                    onChange={handleChange}
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    required
                  >
                    <option value="" disabled>
                      Select Main Account
                    </option>
                    <option value="MainAccount1">Main Account 1</option>
                    <option value="MainAccount2">Main Account 2</option>
                    {/* Add more options as needed */}
                  </select>
                </div>

                {/* Sub Account Dropdown */}
                <div className="w-1/2 text-left">
                  <label
                    className="block text-gray-700 font-semibold mb-1"
                    htmlFor="sub_account"
                  >
                    Sub Account
                  </label>
                  <select
                    id="sub_account"
                    name="sub_account"
                    value={newBank.sub_account}
                    onChange={handleChange}
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    required
                  >
                    <option value="" disabled>
                      Select Sub Account
                    </option>
                    <option value="SubAccount1">Sub Account 1</option>
                    <option value="SubAccount2">Sub Account 2</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
              </div>

              {/* Account Name and Initial Amount */}
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
                    value={newBank.account_name}
                    onChange={handleChange}
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Enter Account Name"
                    required
                  />
                </div>
                <div className="w-1/2 text-left">
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
                    value={newBank.initial_amount}
                    onChange={handleChange}
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Enter Initial Amount"
                    required
                  />
                </div>
              </div>

              {/* Nature of Account with animated checkboxes */}
              <div className="text-left">
                <label className="block text-gray-700 font-semibold mb-1">
                  Nature of Account
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="nature_of_account"
                      value="Debit"
                      className="rounded-full h-5 w-5 transition-all "
                      onChange={handleNatureChange}
                    />
                    <span>Debit</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="nature_of_account"
                      value="Credit"
                      className="rounded-full h-5 w-5 transition-all "
                      onChange={handleNatureChange}
                    />
                    <span>Credit</span>
                  </label>
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
          {/* {banksList.map((bank) => (
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
                      className="bg-blue-500 text-white py-1 px-2 rounded-md flex items-center gap-2 mr-2"
                      onClick={() => handleEditClick(bank)}
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded-md flex items-center gap-2"
                      onClick={() => handleDelete(bank._id)}
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </div>
  );
};

export default ChartsofAccounts;
