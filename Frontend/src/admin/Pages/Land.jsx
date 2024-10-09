import React, { useState, useEffect } from "react";
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

const Land = () => {
  const url = "http://localhost:3002";
  const [landRecords, setLandRecords] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
const [newLandData, setNewLandData] = useState({
  name: "",
  area: "",
  size: "",
  location: "",
});
  const [editingLandId, setEditingLandId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
  const [sortOrder, setSortOrder] = useState({ key: "", order: "asc" });
    const [sortConfig, setSortConfig] = useState({
      key: "name",
      direction: "asc",
    });

  const filteredLand = landRecords
    .filter((land) =>
      land.name?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const totalPages = Math.ceil(filteredLand.length / recordsPerPage);
  const paginatedLand = filteredLand.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const fetchLandRecords = async () => {
    try {
      const response = await axios.get(`${url}/land/list_land`);
      if (response.data.success) {
        setLandRecords(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching land records:", error);
    }
  };

  useEffect(() => {
    fetchLandRecords();
  }, []);

  const handleAddLand = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/land/add_land`, 
        newLandData
      );
      if (response.data.success) {
        fetchLandRecords();
       setNewLandData({ name: "", area: "", size: "", location: "" });
        setShowAddForm(false);
      }
      toast.success("Land Added Successfully!");
    } catch (error) {
      console.error("Error adding land:", error);
    }
  };

  const removeLand = async (landId) => {
    try {
      const response = await axios.post(`${url}/land/delete`, { id: landId });
      if (response.data.success) {
        fetchLandRecords();
      } else {
        console.log("Error removing land");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`${url}/land/update`, {
        id: editableData._id,
        ...editableData,
      });
      if (response.data.success) {
        setEditingLandId(null);
        fetchLandRecords();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (land) => {
    setEditingLandId(land._id);
    setEditableData({ ...land });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLandData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditingLandId(null);
    setEditableData({});
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
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Role List</h1>
      <div className="flex justify-between flex-wrap gap-3 mb-4">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
            placeholder="Search Land"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="h-full px-4 text-lg text-gray-500">
            <FaSearch />
          </button>
        </div>
        <div>
          <button
            className="bg-[#067528] text-white font-semibold px-4 flex items-center gap-2 rounded-md py-2"
            onClick={() => setShowAddForm(true)}
          >
            <FaPlus className="text-sm" /> Add Land
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[550px]">
            <h1 className="text-lg font-semibold mb-5">Add Land</h1>
            <hr className="mb-6 border-gray-400" />
            <form onSubmit={handleAddLand} className="space-y-6">
              <input
                type="text"
                className="border w-full px-2 outline-none py-2 rounded-md"
                placeholder="Land Name"
                name="name"
                value={newLandData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                className="border w-full px-2 outline-none py-2 rounded-md"
                placeholder="Land Area (sq. ft)"
                name="area"
                value={newLandData.area}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                className="border w-full px-2 outline-none py-2 rounded-md"
                placeholder="Size"
                name="size"
                value={newLandData.size}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                className="border w-full px-2 outline-none py-2 rounded-md"
                placeholder="Location"
                name="location"
                value={newLandData.location}
                onChange={handleInputChange}
                required
              />
              <div className="pt-8 flex justify-end gap-7">
                <button
                  className="text-red-600 font-semibold px-3 py-1 rounded-md"
                  type="button"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-md"
                  type="submit"
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
          <div className="grid grid-cols-5 bg-[#e0f2e9] text-[10px] md:text-sm">
            <div
              className="py-3 text-center text-gray-800  font-semibold cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Land Name{" "}
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
              onClick={() => handleSort("area")}
            >
              Land Area{" "}
              {sortConfig.key === "area" ? (
                <span className="inline-block ml-2 -mt-1 align-middle text-xs">
                  {sortConfig.direction === "asc" ? "▲" : "▼"}
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="py-3 text-center text-gray-800 font-semibold">
              Size (sq. ft)
            </div>
            <div className="py-3 text-center text-gray-800 font-semibold">
              Location
            </div>
            <div className="py-3 px-4 text-center text-gray-800 font-semibold">
              Actions
            </div>
          </div>

          {paginatedLand.map((land) => (
            <div
              key={land._id}
              className="grid grid-cols-5 gap-2 border-b  text-gray-700 text-[9px] md:text-sm hover:bg-gray-100"
            >
              <div className="py-3 text-center max-w-xs">
                {editingLandId === land._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editableData.name}
                    onChange={handleInputChange}
                    className="border rounded px-2  w-full"
                  />
                ) : (
                  land.name
                )}
              </div>
              <div className="py-3 text-center max-w-xs">
                {editingLandId === land._id ? (
                  <input
                    type="text"
                    name="area"
                    value={editableData.area}
                    onChange={handleInputChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  land.area
                )}
              </div>
              <div className="py-3 text-center max-w-xs">
                {editingLandId === land._id ? (
                  <input
                    type="text"
                    name="size"
                    value={editableData.size}
                    onChange={handleInputChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  land.size
                )}
              </div>
              <div className="py-3 text-center max-w-xs">
                {editingLandId === land._id ? (
                  <input
                    type="text"
                    name="location"
                    value={editableData.location}
                    onChange={handleInputChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  land.location
                )}
              </div>
              <div className="py-3 px-2 md:px-[60px] text-center flex">
                {editingLandId === land._id ? (
                  <>
                    <button
                      className="text-green-500 py-1 px-2 rounded-md flex items-center gap-2 "
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
                      className="text-green-600 py-1 px-2 rounded-md flex items-center gap-2 "
                      onClick={() => handleEditClick(land)}
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      className="text-red-600 py-1 px-2 rounded-md flex items-center"
                      onClick={() => removeLand(land._id)}
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

export default Land;
