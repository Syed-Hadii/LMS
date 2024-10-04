import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Haari = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [haariList, setHaariList] = useState([]);
  const [newHaari, setNewHaari] = useState({
    name: "",
    address: "",
    phone: "",
    nic: "",
  });
  const [editingHaariId, setEditingHaariId] = useState(null);
  const [editableData, setEditableData] = useState({});
   const [searchQuery, setSearchQuery] = useState("");
   const filteredHaari = haariList.filter((haari) =>
     haari.name?.toLowerCase().includes(searchQuery.toLowerCase())
   );


  const fetchHaari = async () => {
    try {
      const response = await axios.get(`${url}/haari/gethaari`);
      setHaariList(response.data.data);
    } catch (error) {
      console.log("Error fetching Haari records:", error);
    }
  };

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
    try {
      const response = await axios.post(`${url}/haari/deletehaari`, {
        id: haariId,
      });
      if (response.data.success) {
        console.log("User Removed successfully");
        fetchHaari();
      } else {
        console.log("Error removing user");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHaari();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Haari List</h1>
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

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 text-left text-gray-600 font-semibold">
              Haari Name
            </th>
            <th className="py-3 px-6 text-left text-gray-600 font-semibold">
              Haari Phone#
            </th>
            <th className="py-3 px-6 text-left text-gray-600 font-semibold">
              Haari NIC
            </th>
            <th className="py-3 px-6 text-left text-gray-600 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredHaari.map((haari) => (
            <tr key={haari._id} className="border-b hover:bg-gray-100">
              <td className="py-3 px-4">
                {editingHaariId === haari._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editableData.name}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-40"
                  />
                ) : (
                  haari.name
                )}
              </td>
              <td className="py-3 px-4">
                {editingHaariId === haari._id ? (
                  <input
                    type="text"
                    name="phone"
                    value={editableData.phone}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-40"
                  />
                ) : (
                  haari.phone
                )}
              </td>
              <td className="py-3 px-4">
                {editingHaariId === haari._id ? (
                  <input
                    type="text"
                    name="nic"
                    value={editableData.nic}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-44"
                  />
                ) : (
                  haari.nic
                )}
              </td>
              <td className="py-3 px-4 flex">
                {editingHaariId === haari._id ? (
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
                      onClick={() => handleEditClick(haari)}
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      className=" text-red-500 py-1 px-2 rounded-md flex items-center gap-2"
                      onClick={() => removeHaari(haari._id)}
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

export default Haari;
