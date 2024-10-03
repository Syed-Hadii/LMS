import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaBan } from "react-icons/fa";

const Role = () => {
  const url = "http://localhost:3002";
  const [roles, setRoles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editableRole, setEditableRole] = useState("");

  // Fetch roles
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
        fetchRoles(); // Refresh roles list
        setNewRole("");
        setShowAddForm(false); // Close the form
      }
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
        fetchRoles(); // Refresh roles list
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
        fetchRoles(); // Refresh roles list
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
      <h1 className="text-3xl underline font-bold ml-[30vw]">Roles List</h1>
      <button
        className="bg-[#067528] text-white font-semibold px-4 flex items-center gap-2 rounded-md py-2 mb-5"
        onClick={() => {
          setNewRole(""); // Reset newRole
          setShowAddForm(true);
        }}
      >
        <FaPlus className="text-sm" />
        Add Role
      </button>

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
          {roles.map((role) => (
            <tr key={role._id} className="border-b hover:bg-gray-100">
              <td className="py-3 px-4">
                {editingRoleId === role._id ? (
                  <input
                    type="text"
                    value={editableRole}
                    onChange={handleEditChange}
                    className="border rounded px-2"
                  />
                ) : (
                  role.role
                )}
              </td>
              <td className="py-3 px-4">Permission Details</td>
              <td className="py-3 px-4 flex space-x-2">
                {editingRoleId === role._id ? (
                  <>
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                      onClick={handleSaveEdit}
                    >
                      <FaEdit className="inline-block mr-1" /> Save
                    </button>
                    <button
                      className="bg-transparent text-red-500 hover:bg-red-100 rounded py-1 px-3"
                      onClick={handleCancelEdit}
                    >
                      <FaBan className="inline-block mr-1" /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-transparent text-blue-500 hover:bg-blue-100 rounded py-1 px-3"
                      onClick={() => handleEditClick(role)}
                    >
                      <FaEdit className="inline-block mr-1" />
                    </button>
                    <button
                      className="bg-transparent text-red-500 hover:bg-red-100 rounded py-1 px-3"
                      onClick={() => handleRemoveRole(role._id)}
                    >
                      <FaTrash className="inline-block" />
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
