import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Land = () => {
  const url = "http://localhost:3002";
  const [landRecords, setLandRecords] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLandName, setNewLandName] = useState("");
  const [newLandArea, setNewLandArea] = useState("");
  const [editingLandId, setEditingLandId] = useState(null);
  const [editableData, setEditableData] = useState({});
   const [searchQuery, setSearchQuery] = useState("");
   const filteredLand = landRecords.filter((land) =>
     land.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
      const response = await axios.post(`${url}/land/add_land`, {
        name: newLandName,
        area: newLandArea,
      });
      if (response.data.success) {
        fetchLandRecords(); 
        setNewLandName("");
        setNewLandArea("");
        setShowAddForm(false);
      }
      toast.success("Land Added Successfully!");
    } catch (error) {
      console.error("Error adding land:", error);
    }
  };

  const removeLand = async (landId) => {
    try {
      const response = await axios.post(`${url}/land/delete`, {
        id: landId,
      });
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
        console.log("Land updated successfully");
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
    setEditableData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditingLandId(null);
    setEditableData({}); 
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl underline font-bold text-center">Land Records</h1>
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
            onClick={() => {
              setShowAddForm(true);
              setNewLand({
                haariId: "",
                land: [
                  {
                    land_id: "",
                    crop_name: "",
                    start_date: "",
                    end_date: "",
                    details: "",
                  },
                ],
              });
            }}
          >
            <FaPlus className="text-sm" /> Add Land
          </button>
        </div>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[550px] h-auto">
            <h1 className="text-lg font-semibold mb-5">Add Land</h1>
            <hr className="mb-6 border-gray-400" />
            <form onSubmit={handleAddLand} className="space-y-6">
              <input
                type="text"
                className="border w-full px-2 outline-none py-2 rounded-md"
                placeholder="Land Name"
                value={newLandName}
                onChange={(e) => setNewLandName(e.target.value)}
                required
              />
              <input
                type="text"
                className="border w-full px-2 outline-none py-2 rounded-md"
                placeholder="Land Area (sq. ft)"
                value={newLandArea}
                onChange={(e) => setNewLandArea(e.target.value)}
                required
              />
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

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-500  leading-normal">
              <th className="py-3 px-6 text-left">Land Name</th>
              <th className="py-3 px-6 text-left">Land Area</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm ">
            {filteredLand.map((land) => (
              <tr key={land._id} className="border-b border-gray-200">
                {editingLandId === land._id ? (
                  <>
                    <td className="py-3 px-3 text-left ">
                      <input
                        type="text"
                        name="name"
                        className="border w-full px-2 py-2"
                        value={editableData.name}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className="py-3 px-3 text-left">
                      <input
                        type="text"
                        name="area"
                        className="border w-full px-2 py-2"
                        value={editableData.area}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleSaveClick}
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
                    <td className="py-3 px-6 text-left">{land.name}</td>
                    <td className="py-3 px-6 text-left">{land.area}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(land)}
                          className=" text-green-600 rounded px-2 py-1"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => removeLand(land._id)}
                          className=" text-red-500 rounded px-2 py-1"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddLand} className="mt-5">
          <input
            type="text"
            placeholder="Land Name"
            value={newLandName}
            onChange={(e) => setNewLandName(e.target.value)}
            required
            className="border px-2 py-1 mr-2"
          />
          <input
            type="text"
            placeholder="Land Area"
            value={newLandArea}
            onChange={(e) => setNewLandArea(e.target.value)}
            required
            className="border px-2 py-1 mr-2"
          />
          <button
            type="submit"
            className="bg-green-500 text-white rounded px-4 py-1"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="bg-red-500 text-white rounded px-4 py-1"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Land;
