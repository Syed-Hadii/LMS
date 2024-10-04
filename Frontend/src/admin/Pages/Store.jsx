import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Store = () => {
  const url = "http://localhost:3002";
  const [stores, setStores] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStore, setNewStore] = useState("");
  const [editingStoreId, setEditingStoreId] = useState(null);
  const [editableStore, setEditableStore] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const fetchStores = async () => {
    try {
      const response = await axios.get(`${url}/store/get`);
      if (response.data.success) {
        setStores(response.data.data);
      } else {
        setStores([]);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      setStores([]);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/store/save`, {
        name: newStore,
      });
      if (response.data.success) {
        toast.success("Store Created Successfully!");
        fetchStores();
        setNewStore("");
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Error adding store:", error);
    }
  };

  const handleRemoveStore = async (storeId) => {
    try {
      const response = await axios.post(`${url}/store/delete`, {
        id: storeId,
      });
      if (response.data.success) {
        fetchStores();
      }
    } catch (error) {
      console.log("Error removing store:", error);
    }
  };

  const handleEditClick = (store) => {
    setEditingStoreId(store._id);
    setEditableStore(store.name);
  };

  const handleEditChange = (e) => {
    setEditableStore(e.target.value);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`${url}/store/update`, {
        id: editingStoreId,
        name: editableStore,
      });
      if (response.data.success) {
        fetchStores();
        setEditingStoreId(null);
        setEditableStore("");
      }
    } catch (error) {
      console.error("Error updating store:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingStoreId(null);
    setEditableStore("");
  };

  // Filter stores based on the search query
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Stores List</h1>
      <div className="flex justify-between ">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
            placeholder="Search Accounts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery
          />
          <button className="h-full px-4 text-lg text-gray-500">
            <FaSearch />
          </button>
        </div>
        <div>
          <button
            className="bg-[#067528] text-white font-semibold px-4 flex items-center gap-2 rounded-md py-2 mb-5"
            onClick={() => {
              setNewStore("");
              setShowAddForm(true);
            }}
          >
            <FaPlus className="text-sm" />
            Add Store
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 text-center rounded shadow-lg w-[420px] h-auto">
            <h1 className="text-lg font-semibold mb-5">Add Store</h1>
            <hr className="mb-6 border-gray-400" />
            <form onSubmit={handleAddStore} className="space-y-4">
              <input
                type="text"
                className="border w-full px-2 py-2 rounded-md"
                placeholder="Store Name"
                value={newStore}
                onChange={(e) => setNewStore(e.target.value)}
                required
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-red-500 text-white rounded px-4 py-1"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded px-4 py-1"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-5">
        <table className="table-auto w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
              <th className="py-3 px-6 text-left">Store Name</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm ">
            {filteredStores.map(
              (
                store // Use filteredStores instead of stores
              ) => (
                <tr key={store._id} className="border-b border-gray-200">
                  {editingStoreId === store._id ? (
                    <>
                      <td className="py-3 px-4 text-left">
                        <input
                          type="text"
                          className="border w-full px-2 py-2"
                          value={editableStore}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="bg-green-500 text-white rounded px-2 py-1"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white rounded px-2 py-1"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-6 text-left">{store.name}</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(store)}
                            className="text-green-600 rounded px-2 py-1"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleRemoveStore(store._id)}
                            className="text-red-500 rounded px-2 py-1"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Store;
