import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";

const Haari = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHaari, setNewHaari] = useState({
    name: "",
    address: "",
    phone: "",
    nic: "",
  });
  const [loading, setLoading] = useState(true);
  const [editingHaariId, setEditingHaariId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;
  const [totalPages, setTotalPages] = useState(1);
  const [haariList, setHaariList] = useState([]);
    const [sortConfig, setSortConfig] = useState({
      key: "name",
      direction: "asc",
    });

    const filteredHaari = haariList
      .filter((land) =>
        land.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortConfig.key) {
          if (sortConfig.order === "asc") {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
          } else {
            return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
          }
        }
        return 0;
      });

 
 const fetchHaari = async () => {
   setLoading(true); 
   try {
     const response = await axios.get(
       `${url}/haari/gethaari?page=${currentPage}&limit=${recordsPerPage}&search=${searchQuery}`
     );
     setHaariList(response.data.haari);
     setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
   } catch (error) {
     console.error("Error fetching Haari records:", error);
   } finally {
     setLoading(false); // Reset loading state
   }
 }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewHaari({ ...newHaari, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/haari/addhaari`, newHaari);
      toast.success("Haari Added Successfully!");
      setShowAddForm(false);
      setNewHaari({ name: "", address: "", phone: "", nic: "" });
      fetchHaari(); 
    } catch (error) {
      console.log("Error adding Haari:", error);
    }
  };

  const handleEditClick = (haari) => {
    setEditingHaariId(haari._id);
    setEditableData(haari);
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
      const response = await axios.put(`${url}/haari/updatehaari`, {
        id: editableData._id,
        ...editableData,
      });
      if (response.data.success) {
        console.log("Haari updated successfully");
        setEditingHaariId(null); 
        fetchHaari(); 
      } else {
        console.log("Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingHaariId(null); 
    setEditableData({}); 
  };
const removeHaari = async (haariId) => {
  const confirmDelete = () => {
    toast.dismiss();
    deleteVoucher(haariId);
  };

  toast.info(
    <div>
      Are you sure you want to delete this haari?
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

  const deleteVoucher = async (haariId) => {
  setLoading(true);
  try {
    const response = await axios.post(`${url}/haari/deletehaari`, {
      id: haariId,
    });
    if (response.data.success) {
      toast.success("Haari deleted successfully!");
      fetchHaari();
    } else {
      toast.error("Error deleting haari");
    }
  } catch (error) {
    console.error("Error deleting haari:", error);
    toast.error("Error deleting haari");
  } finally {
    setLoading(false);
  }
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
    //  fetchHaari();
   }
 };

    useEffect(() => {
      fetchHaari();
    }, [currentPage, searchQuery]);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Haari List</h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
            placeholder="Search Haari"
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
            Add Haari
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[550px] h-auto mt-10">
            <h1 className="text-lg font-semibold mb-5">Add Haari</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={newHaari.name}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter name"
                  required
                />
              </div>
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
                  value={newHaari.phone}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="text-left">
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newHaari.address}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter address"
                  required
                />
              </div>
              <div className="text-left">
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="nic"
                >
                  NIC
                </label>
                <input
                  type="text"
                  id="nic"
                  name="nic"
                  value={newHaari.nic}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter NIC"
                  required
                />
              </div>
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
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <RotatingLines width="50" strokeColor="#067528" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-4 bg-[#e0f2e9] text-xs md:text-base">
              <div
                className="py-3 text-center text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Haari Name{" "}
                {sortConfig.key === "name" ? (
                  <span className="inline-block ml-2 -mt-1 align-middle text-xs">
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div
                className="py-3 text-center text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("phone")}
              >
                Haari Phone#{" "}
                {sortConfig.key === "phone" ? (
                  <span className="inline-block align-middle text-xs">
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="py-3 text-center text-gray-800 font-semibold">
                Haari NIC
              </div>
              <div className="py-3 text-center text-gray-800 font-semibold">
                Actions
              </div>
            </div>

            {filteredHaari.map((haari) => (
              <div
                key={haari._id}
                className="grid grid-cols-4 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
              >
                <div className="py-3 text-center max-w-xs">
                  {editingHaariId === haari._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editableData.name}
                      onChange={handleEditChange}
                      className="border rounded px-2 w-full"
                    />
                  ) : (
                    haari.name
                  )}
                </div>
                <div className="py-3 text-center max-w-xs">
                  {editingHaariId === haari._id ? (
                    <input
                      type="text"
                      name="phone"
                      value={editableData.phone}
                      onChange={handleEditChange}
                      className="border rounded px-2 w-full"
                    />
                  ) : (
                    haari.phone
                  )}
                </div>
                <div className="py-3 text-center max-w-xs">
                  {editingHaariId === haari._id ? (
                    <input
                      type="text"
                      name="nic"
                      value={editableData.nic}
                      onChange={handleEditChange}
                      className="border rounded px-2 w-full"
                    />
                  ) : (
                    haari.nic
                  )}
                </div>
                <div className="py-3 text-center px-7 md:px-20 flex">
                  {editingHaariId === haari._id ? (
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
                        onClick={() => handleEditClick(haari)}
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        className="text-red-600 py-1 md:px-2 rounded-md flex items-center"
                        onClick={() => removeHaari(haari._id)}
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

export default Haari;
