import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

const Suppliers = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone: "",
    nic:"",
    amount: "",
  });
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [editableData, setEditableData] = useState({});

  const fetchSupplier = async () => {
    try {
      const response = await axios.get(`${url}/supplier/get`);
      setSupplierList(response.data.data);
    } catch (error) {
      console.log("Error fetching supplier records:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/supplier/add`, newSupplier);
      setShowAddForm(false);
      setNewSupplier({ name: "", phone: "",nic:"", amount: "" });
      fetchSupplier();
    } catch (error) {
      console.log("Error adding Supplier:", error);
    }
  };

  const handleEditClick = (supplier) => {
    setEditingSupplierId(supplier._id);
    setEditableData(supplier);
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
      await axios.put(`${url}/supplier/update`, {
        id: editableData._id,
        ...editableData,
      });
      setEditingSupplierId(null);
      fetchSupplier();
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingSupplierId(null);
    setEditableData({});
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/supplier/delete`, { data: { id } });
      fetchSupplier();
    } catch (error) {
      console.log("Error deleting supplier:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier({ ...newSupplier, [name]: value });
  };

  useEffect(() => {
    fetchSupplier();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl underline font-bold ml-[30vw]">
        Vendors List
      </h1>
      <button
        className="bg-blue-500 text-white font-semibold px-4 flex items-center gap-2 rounded-md py-2 mb-5"
        onClick={() => setShowAddForm(true)}
      >
        <FaPlus className="text-sm" />
        Add vendor
      </button>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[550px] h-auto mt-10">
            <h1 className="text-lg font-semibold mb-5">Add Vendor</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAdd}>
              {/* Name Input */}
              <div className="text-left">
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newSupplier.name}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter name"
                  required
                />
              </div>

              {/* Phone Input */}
              <div className="text-left">
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={newSupplier.phone}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              {/* Name Input */}
              <div className="text-left">
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="name"
                >
                  NIC
                </label>
                <input
                  type="text"
                  id="nic"
                  name="nic"
                  value={newSupplier.nic}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter NIC"
                  required
                />
              </div>

              {/* Amount Input */}
              <div className="text-left">
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={newSupplier.amount}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter amount"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="pt-8 flex float-right gap-7">
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
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full max-w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Vendor Name
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Phone
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              NIC
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Amount
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {supplierList.map((supplier) => (
            <tr key={supplier._id} className="border-b text-gray-700 text-sm hover:bg-gray-100">
              <td className="py-3 px-4 max-w-xs">
                {editingSupplierId === supplier._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editableData.name}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  supplier.name
                )}
              </td>
              <td className="py-3 px-4 max-w-xs">
                {editingSupplierId === supplier._id ? (
                  <input
                    type="text"
                    name="phone"
                    value={editableData.phone}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  supplier.phone
                )}
              </td>
              <td className="py-3 px-4 max-w-xs">
                {editingSupplierId === supplier._id ? (
                  <input
                    type="text"
                    name="nic"
                    value={editableData.nic}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  supplier.nic
                )}
              </td>
              <td className="py-3 px-9 max-w-xs">
                {editingSupplierId === supplier._id ? (
                  <input
                    type="number"
                    name="amount"
                    value={editableData.amount}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  supplier.amount
                )}
              </td>
              <td className="py-3 px-4 flex">
                {editingSupplierId === supplier._id ? (
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
                      onClick={() => handleEditClick(supplier)}
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded-md flex items-center gap-2"
                      onClick={() => handleDelete(supplier._id)}
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

export default Suppliers;
