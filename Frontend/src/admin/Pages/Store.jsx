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
  const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;
   const [sortOrder, setSortOrder] = useState({ key: "", order: "asc" });
   const [sortConfig, setSortConfig] = useState({
     key: "name",
     direction: "asc",
   });

   const filteredStores = stores
     .filter((store) =>
       store.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
const handleSort = (key) => {
  setSortOrder((prevSortOrder) => ({
    key,
    order: prevSortOrder.order === "asc" ? "desc" : "asc",
  }));
};
  
    const totalPages = Math.ceil(filteredStores.length / recordsPerPage);
    const paginatedStore = filteredStores.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );

    const handlePageChange = (page) => {
      if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
      }
    };


  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Stores List</h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
            placeholder="Search Accounts"
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

      <div className="mt-4 grid grid-cols-1 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-2 bg-[#e0f2e9] text-sm md:text-base">
            <div
              className="py-3 text-center w-full text-gray-800 font-semibold cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Store Name{" "}
              {sortConfig.key === "name" ? (
                <span className="inline-block ml-2 -mt-1 align-middle text-xs">
                  {sortConfig.direction === "asc" ? "▲" : "▼"}
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="py-3 md:px-4 text-center w-full text-gray-800 font-semibold">
              Actions
            </div>
          </div>

          {paginatedStore.map((store) => (
            <div
              key={store._id}
              className="grid grid-cols-2 gap-2 border-b text-gray-700 text-sm hover:bg-gray-100"
            >
              <div className="py-3 px-6 text-center max-w-xs mx-auto">
                {editingStoreId === store._id ? (
                  <input
                    type="text"
                    className="border rounded px-2 w-full"
                    value={editableStore}
                    onChange={handleEditChange}
                  />
                ) : (
                  store.name
                )}
              </div>
              <div className="py-3 px-6 text-center w-full flex justify-center">
                {editingStoreId === store._id ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-500 text-white rounded px-2 py-1 mr-2"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white rounded px-2 py-1"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
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
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2  mx-2 border rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          &laquo;
        </button>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 mx-2 border rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Store;
