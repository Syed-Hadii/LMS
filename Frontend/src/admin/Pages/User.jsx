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
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = listUser.filter((user) =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      setListUser(response.data.data);
      console.log(response.data.data); // Log the users list
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  
const handleRemove = async (userId) => {
  toast.info(
    <div>
      Are you sure you want to delete this user?
      <div className="flex justify-end mt-2">
        <button
          onClick={() => deleteVoucher(userId)}
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

const deleteVoucher = async (userId) => {
  //  setLoading(true);
  try {
    const response = await axios.post(`${url}/adduser/deleteuser`, {
      id: userId,
    });
    if (response.data.success) {
      toast.dismiss();
      toast.success("User deleted successfully!");
      fetchUserList();
    } else {
      toast.error("Error deleting user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("Error deleting user");
  } finally {
    //  setLoading(false);
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
      toast.success("User Created Successfully!");
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
      <div className="flex flex-col md:flex-row justify-between mb-5">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-full md:w-72 rounded-md px-2 py-1.5"
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
            className="bg-[#067528] text-white font-semibold px-4 flex items-center gap-2 rounded-md py-2 mt-3 md:mt-0"
            onClick={() => setShowAddForm(true)}
          >
            <FaPlus className="text-sm" />
            Add User
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[420px] h-[500px]">
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

      <div className="min-w-full bg-white border border-gray-300 rounded-lg">
        <div className="grid grid-cols-4 bg-[#e0f2e9]  text-gray-800 font-semibold cursor-pointer py-3">
          <div className="px-4 text-left">Name</div>
          <div className="px-4 text-left">Email</div>
          <div className="px-4 text-left">Role</div>
          <div className="px-4 text-left">Actions</div>
        </div>
        <div className="divide-y divide-gray-300">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-4 py-3 hover:bg-gray-100"
            >
              <div className="px-4">
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
              </div>
              <div className="px-4">
                {editingUserId === user._id ? (
                  <input
                    type="text"
                    name="email"
                    value={editableData.email}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-40"
                  />
                ) : (
                  user.email
                )}
              </div>
              <div className="px-4">
                {editingUserId === user._id ? (
                  <select
                    name="role"
                    value={editableData.role}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-40"
                  >
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>
                        {role.role}
                      </option>
                    ))}
                  </select>
                ) : (
                  user.role?.role
                )}
              </div>
              <div className="px-4">
                {editingUserId === user._id ? (
                  <div className="flex gap-2">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={handleSaveClick}
                    >
                      <FaSave />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={handleCancelEdit}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEditClick(user)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemove(user._id)}
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
    </div>
  );
};

export default User;
