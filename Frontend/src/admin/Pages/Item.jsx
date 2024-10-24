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
import { RotatingLines } from "react-loader-spinner";

const Item = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItems, setNewItems] = useState({
    name: "",
    unit: "",
    store_id: "",
    pkg_qty: "",
    pkg_amount: "",
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [totalPages, setTotalPages] = useState(1);
  const [itemList, setItemList] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const filteredItems = itemList
    .filter((supplier) =>
      supplier.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/store/get`);

        setStores(response.data.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/items/view?page=${currentPage}&limit=${recordsPerPage}&search=${searchQuery}`
      );
      if (response) {
        setItemList(response.data.ItemList);
        console.log(response);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } else {
        setItemList([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/items/save`, newItems);
      toast.success("Item Added Successfully!");
      setShowAddForm(false);
      setNewItems({
        name: "",
        unit: "",
        store_id: "",
        pkg_qty: "",
        pkg_amount: "",
      });
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };
  const handleEditClick = (item) => {
    setEditingItemId(item._id);
    setEditableData(item);
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
  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditableData({});
  };
  const handleDelete = async (id) => {
    toast.info(
      <div>
        Are you sure you want to delete this item?
        <div className="flex justify-end mt-2">
          <button
            onClick={() => deleteVoucher(id)}
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
      const response = await axios.delete(`${url}/items/delete`, {
        data: { id },
      });
      if (response.data.success) {
        toast.dismiss();
        toast.success("Item deleted successfully!");
        fetchItems();
      } else {
        toast.error("Error deleting item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting item");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItems({ ...newItems, [name]: value });
  };
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  useEffect(() => {
    fetchItems();
  }, [currentPage, searchQuery]);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Item List</h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
            placeholder="Search Item"
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
            Add Item
          </button>
        </div>
      </div>
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
            {/* Header Row */}
            <div className="grid grid-cols-4 bg-[#e0f2e9] text-center text-sm md:text-base">
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortConfig.key === "name" ? (
                  <span className="inline-block ml-2 -mt-1 align-middle text-xs">
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("unit")}
              >
                Unit{" "}
                {sortConfig.key === "unit" ? (
                  <span className="inline-block align-middle text-xs">
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("pkg_qty")}
              >
                Package Quantity{" "}
                {sortConfig.key === "pkg_qty" ? (
                  <span className="inline-block align-middle text-xs">
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="py-3 text-gray-800 font-semibold">Actions</div>
            </div>

            {/* Data Rows */}
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-4 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
              >
                {/* Name Column */}
                <div className="py-3 text-center">
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
                </div>

                {/* Unit Column */}
                <div className="py-3 text-center">
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
                </div>

                {/* Package Quantity Column */}
                <div className="py-3 text-center">
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
                </div>

                {/* Actions Column */}
                <div className="py-3 text-center flex justify-center">
                  {editingItemId === item._id ? (
                    <>
                      <button
                        className="text-green-500 py-1 px-2 rounded-md flex items-center gap-2 mr-2"
                        onClick={handleSaveClick}
                      >
                        <FaSave className="text-sm" />
                      </button>
                      <button
                        className="text-gray-700 py-1 px-2 rounded-md flex items-center gap-2"
                        onClick={handleCancelEdit}
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text-green-600 py-1 px-2 rounded-md flex items-center gap-2 mr-2"
                        onClick={() => handleEditClick(item)}
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        className="text-red-600 py-1 px-2 rounded-md flex items-center"
                        onClick={() => handleDelete(item._id)}
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

export default Item;
