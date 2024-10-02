import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";

const Item = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [itemList, setItemList] = useState([]);
 const [stores, setStores] = useState([]);
 const [newItems, setNewItems] = useState({
   name: "",
   unit: "",
   store_id: "",
   pkg_qty: "",
   pkg_amount: "",
   stock: "",
 });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editableData, setEditableData] = useState({});

useEffect(() => {
  const fetchStores = async () => {
    try {
      const response = await axios.get(`${url}/store/get`);
      setStores(response.data.data); 
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  fetchStores();
}, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${url}/items/view`);
      setItemList(response.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Handle Add new item
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/items/save`, newItems);
      setShowAddForm(false);
      setNewItems({
        name: "",
        unit: "",
        store_id: "",
        pkg_qty: "",
        pkg_amount: "",
        stock: "",
      });
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Handle Edit Click
  const handleEditClick = (item) => {
    setEditingItemId(item._id);
    setEditableData(item);
  };

  // Handle Edit Change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Save Edited Item
  const handleSaveClick = async () => {
    try {
      await axios.put(`${url}/items/update`, {
        id: editableData._id,
        ...editableData,
      });
      setEditingItemId(null);
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditableData({});
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/items/delete`, { data: { id } });
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({ ...newItems, [name]: value });
  };

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl underline font-bold text-center">Item List</h1>
      <button
        className="bg-blue-500 text-white font-semibold px-4 flex items-center gap-2 rounded-md py-2 mb-5"
        onClick={() => {
          setShowAddForm(true);
        }}
      >
        <FaPlus className="text-sm" /> Add Item
      </button>

      {/* Add Form */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[650px] h-auto mt-10">
            <h1 className="text-lg font-semibold mb-5">Add New Item</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAdd}>
              <div className="flex gap-4">
                <div className="w-full">
                  <label
                    className="block text-left font-semibold mb-1"
                    htmlFor="name"
                  >
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Enter Item Name"
                    value={newItems.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full">
                  <label
                    className="block text-left font-semibold mb-1"
                    htmlFor="unit"
                  >
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Enter Unit"
                    value={newItems.unit}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-full">
                  <label
                    className="block text-left font-semibold mb-1"
                    htmlFor="store_id"
                  >
                    Store
                  </label>
                  <select
                    value={newItems.store_id}
                    className="border w-full px-2 outline-none py-2 rounded-md text-black bg-white"
                    onChange={(e) =>
                      setNewItems({ ...newItems, store_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Store</option>
                    {Array.isArray(stores) && stores.length > 0 ? (
                      stores.map((store) => (
                        <option key={store._id} value={store._id}>
                          {store.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No stores available</option>
                    )}
                  </select>
                </div>

                <div className="w-full">
                  <label
                    className="block text-left font-semibold mb-1"
                    htmlFor="pkg_qty"
                  >
                    Package Quantity
                  </label>
                  <input
                    type="number"
                    name="pkg_qty"
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Package Quantity"
                    value={newItems.pkg_qty}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-full">
                  <label
                    className="block text-left font-semibold mb-1"
                    htmlFor="pkg_amount"
                  >
                    Package Amount
                  </label>
                  <input
                    type="number"
                    name="pkg_amount"
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Package Amount"
                    value={newItems.pkg_amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    className="block text-left font-semibold mb-1"
                    htmlFor="stock"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    className="border w-full px-2 outline-none py-2 rounded-md"
                    placeholder="Stock"
                    value={newItems.stock}
                    onChange={handleChange}
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

      <table className="min-w-full max-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Name
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Unit
            </th>
           
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Package Quantity
            </th>
           
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {itemList.map((item) => (
            <tr
              key={item._id}
              className="border-b text-gray-700 text-sm hover:bg-gray-100"
            >
              <td className="py-3 px-4">
                {editingItemId === item._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editableData.name}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="py-3 px-4">
                {editingItemId === item._id ? (
                  <input
                    type="text"
                    name="unit"
                    value={editableData.unit}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  item.unit
                )}
              </td>
             
              <td className="py-3 px-4">
                {editingItemId === item._id ? (
                  <input
                    type="number"
                    name="pkg_qty"
                    value={editableData.pkg_qty}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  item.pkg_qty
                )}
              </td>
             
             
              <td className="py-3 px-4">
                {editingItemId === item._id ? (
                  <>
                    <button onClick={handleSaveClick} className="mr-2">
                      <FaSave className="text-blue-600" />
                    </button>
                    <button onClick={handleCancelEdit}>
                      <FaTimes className="text-red-600" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="mr-2"
                    >
                      <FaEdit className="text-green-600" />
                    </button>
                    <button onClick={() => handleDelete(item._id)}>
                      <FaTrash className="text-red-600" />
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

export default Item;
