import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch } from "react-icons/fa";


const User = () => {
  const url = "http://localhost:3002";
  const [roles, setRoles] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editableData, setEditableData] = useState({});

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${url}/adduser/getrole`);
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const fetchUserList = async () => {
    try {
      const response = await axios.get(`${url}/adduser/listuser`);
      setListUser(response.data.data); // Updated this line
      console.log(response.data.data); // Log the users list
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleRemove = async (userId) => {
    try {
      const response = await axios.post(`${url}/adduser/deleteuser`, {
        id: userId,
      });
      if (response.data.success) {
        console.log("User Removed successfully");
        fetchUserList();
      } else {
        console.log("Error removing user");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditableData(user);
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
      const response = await axios.put(`${url}/adduser/updateuser`, {
        id: editableData._id,
        ...editableData,
      });
      if (response.data.success) {
        console.log("User updated successfully");
        setEditingUserId(null); // Exit editing mode
        fetchUserList(); // Refresh the list to get updated data from backend
      } else {
        console.log("Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/adduser/add`, newUser);
      console.log(response.data);
      fetchUserList();
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
   const handleCancelEdit = () => {
     setEditingUserId(null);
     setEditableData({});
   };

  const resetForm = () => {
    setNewUser({
      full_name: "",
      email: "",
      password: "",
      role: "",
      phone: "",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Users List</h1>
      <div className="flex justify-between ">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
            placeholder="Search Accounts"
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
            Add User
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[420px] h-[500px] mt-">
            <h1 className="text-lg font-semibold mb-5">Add User</h1>
            <hr className="mb-6 border-gray-400" />
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                className="border w-full px-2 outline-none py-2 rounded-md"
                placeholder="Full Name"
                value={newUser.full_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, full_name: e.target.value })
                }
                required
              />
              <select
                value={newUser.role}
                className="border w-full px-2 outline-none py-2 rounded-md text-black bg-white"
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option
                    className="text-black bg-white"
                    key={role._id}
                    value={role._id}
                  >
                    {role.role}
                  </option>
                ))}
              </select>

              <input
                type="email"
                className="border w-full px-2 outline-none py-2 rounded-md"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Phone"
                className="border w-full px-2 outline-none py-2 rounded-md"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                required
              />
              <input
                type="password"
                className="border w-full px-2 outline-none py-2 rounded-md"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead className=" text-slate-600">
          <tr className="bg-gray-200">
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listUser.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-100">
              <td className="py-3 px-4">
                {editingUserId === user._id ? (
                  <input
                    type="text"
                    name="full_name"
                    value={editableData.full_name}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-40"
                  />
                ) : (
                  user.full_name
                )}
              </td>
              <td className="py-3 px-4">
                {editingUserId === user._id ? (
                  <input
                    type="email"
                    name="email"
                    value={editableData.email}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-40"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="py-3 px-4">
                {editingUserId === user._id ? (
                  <select
                    name="role"
                    value={editableData.role}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-44"
                  >
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.role}
                      </option>
                    ))}
                  </select>
                ) : (
                  roles.find((role) => role._id === user.role)?.role
                )}
              </td>
              <td className="py-3 px-4 flex">
                {editingUserId === user._id ? (
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
                      className="text-green-600 py-1 px-2 rounded-md flex items-center gap-2 mr-2"
                      onClick={() => handleEditClick(user)}
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      className="text-red-500 py-1 px-2 rounded-md flex items-center gap-2"
                      onClick={() => handleRemove(user._id)}
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

export default User;
