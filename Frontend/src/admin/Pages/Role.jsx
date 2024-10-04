import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaSave, FaTimes, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Role = () => {
  const url = "http://localhost:3002";
  const [roles, setRoles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editableRole, setEditableRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRole = roles.filter((role) =>
    role.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${url}/adduser/getrole`);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/adduser/role`, {
        role: newRole,
      });
      if (response.data.success) {
        fetchRoles(); 
        setNewRole("");
        setShowAddForm(false); 
      }
      toast.success("Role Created Successfully!");
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  const handleRemoveRole = async (roleId) => {
    try {
      const response = await axios.post(`${url}/adduser/deleterole`, {
        id: roleId,
      });
      if (response.data.success) {
        fetchRoles(); 
      }
    } catch (error) {
      console.log("Error removing role:", error);
    }
  };

  const handleEditClick = (role) => {
    setEditingRoleId(role._id);
    setEditableRole(role.role);
  };

  const handleEditChange = (e) => {
    setEditableRole(e.target.value);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`${url}/adduser/updaterole`, {
        id: editingRoleId,
        role: editableRole,
      });
      if (response.data.success) {
        fetchRoles(); 
        setEditingRoleId(null);
        setEditableRole("");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setEditableRole("");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Role List</h1>
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
            Add Roll
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 text-center rounded shadow-lg w-[420px] h-auto">
            <h1 className="text-lg font-semibold mb-5">Add Role</h1>
            <hr className="mb-6 border-gray-400" />
            <form onSubmit={handleAddRole} className="space-y-6">
              <input
                type="text"
                className="border w-full px-2 outline-none py-2 rounded-md"
                placeholder="Role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
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

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Role
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Permission
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredRole.map((role) => (
            <tr key={role._id} className="border-b hover:bg-gray-100">
              <td className="py-3 px-4">
                {editingRoleId === role._id ? (
                  <input
                    type="text"
                    value={editableRole}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-40"
                  />
                ) : (
                  role.role
                )}
              </td>
              <td className="py-3 px-4">Permission Details</td>
              <td className="py-3 px-4 flex">
                {editingRoleId === role._id ? (
                  <>
                    <button
                      className="bg-green-500 text-white py-1 px-2 rounded-md flex items-center gap-2 mr-2"
                      onClick={handleSaveEdit}
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
                      className="text-green-600 py-1 px-2 rounded-md flex items-center gap-2 mr-2"
                      onClick={() => handleEditClick(role)}
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      className="text-red-500 py-1 px-2 rounded-md flex items-center gap-2"
                      onClick={() => handleRemoveRole(role._id)}
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

export default Role;
