import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaSave, FaTimes, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";

const Role = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState("");
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editableRole, setEditableRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [roles, setRoles] = useState([]);
   const [sortConfig, setSortConfig] = useState({
     key: "name",
     direction: "asc",
   });
   const filteredRole = roles
     .filter((role) =>
       role.role?.toLowerCase().includes(searchQuery.toLowerCase())
     )
     .sort((a, b) => {
       if (a[sortConfig.key] < b[sortConfig.key]) {
         return sortConfig.direction === "asc" ? -1 : 1;
       }
       if (a[sortConfig.key] > b[sortConfig.key]) {
         return sortConfig.direction === "asc" ? 1 : -1;
       }
       return 0;
     });
   const handleSort = (key) => {
     let direction = "asc";
     if (sortConfig.key === key && sortConfig.direction === "asc") {
       direction = "desc";
     }
     setSortConfig({ key, direction });
   };


  const fetchRoles = async () => {
    setLoading(true); 
    try {
      const response = await axios.get(
        `${url}/adduser/getrole?page=${currentPage}&limit=${recordsPerPage}&search=${searchQuery}`
      );
      setRoles(response.data.roles); // Set roles from response
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage); // Set total pages
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [currentPage, searchQuery]);

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
   toast.info(
     <div>
       Are you sure you want to delete this role?
       <div className="flex justify-end mt-2">
         <button
           onClick={() => deleteVoucher(roleId)}
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

 const deleteVoucher = async (roleId) => {
    setLoading(true);
   try {
     const response = await axios.post(`${url}/adduser/deleterole`, {
       id: roleId,
     });
     if (response.data.success) {
       toast.dismiss();
       toast.success("Role deleted successfully!");
       fetchRoles();
     } else {
       toast.error("Error deleting role");
     }
   } catch (error) {
     console.error("Error deleting role:", error);
     toast.error("Error deleting role");
   } finally {
      setLoading(false);
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
  
    

 const handlePageChange = (page) => {
   if (page > 0 && page <= totalPages) {
     setCurrentPage(page);
   }
 };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setEditableRole("");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Role List</h1>
      <div className="flex justify-between flex-wrap gap-3">
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
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <RotatingLines width="50" strokeColor="#067528" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-[#e0f2e9]">
              <div
                className="py-3 text-center text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("role")}
              >
                Role{" "}
                {sortConfig.key === "role" ? (
                  <span className="inline-block ml-2 -mt-1 align-middle text-xs">
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="py-3 text-center text-gray-800 font-semibold">
                Permission
              </div>
              <div className="py-3 text-center text-gray-800 font-semibold">
                Actions
              </div>
            </div>
            {filteredRole.map((role) => (
              <div
                key={role._id}
                className="grid grid-cols-3 gap-2 border-b text-gray-700 text-sm hover:bg-gray-100"
              >
                <div className="py-3 text-center max-w-xs">
                  {editingRoleId === role._id ? (
                    <input
                      type="text"
                      value={editableRole}
                      onChange={handleEditChange}
                      className="border rounded px-2 w-full"
                    />
                  ) : (
                    role.role
                  )}
                </div>
                <div className="py-3 text-center max-w-xs">
                  Permission Details
                </div>
                <div className="py-3 text-center  flex justify-center">
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

export default Role;
