import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Suppliers = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone: "",
    nic:"",
    amount: "",
  });
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const rowsPerPage = 6;
   const filteredSupplier = supplierList.filter((supplier) =>
     supplier.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
    const [sortConfig, setSortConfig] = useState({
      key: "name",
      direction: "asc",
    });

    const sortedSupplier = supplierList
      .filter((supplier) =>
        supplier.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
  

  const fetchSupplier = async () => {
    try {
      const response = await axios.get(`${url}/supplier/get`);
      setSupplierList(response.data.data);
    } catch (error) {
      console.log("Error fetching supplier records:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/supplier/add`, newSupplier);
             toast.success("Vendor Added Successfully!");
      setShowAddForm(false);
      setNewSupplier({ name: "", phone: "",nic:"", amount: "" });
      fetchSupplier();
    } catch (error) {
      console.log("Error adding Supplier:", error);
    }
  };

  const handleEditClick = (supplier) => {
    setEditingSupplierId(supplier._id);
    setEditableData(supplier);
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
      await axios.put(`${url}/supplier/update`, {
        id: editableData._id,
        ...editableData,
      });
      setEditingSupplierId(null);
      fetchSupplier();
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingSupplierId(null);
    setEditableData({});
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/supplier/delete`, { data: { id } });
      fetchSupplier();
    } catch (error) {
      console.log("Error deleting supplier:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier({ ...newSupplier, [name]: value });
  };
    const handleSort = (key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
   const startIndex = (currentPage - 1) * rowsPerPage;
   const paginatedSuppliers = filteredSupplier.slice(
     startIndex,
     startIndex + rowsPerPage
   );
   const totalPages = Math.ceil(filteredSupplier.length / rowsPerPage);

  useEffect(() => {
    fetchSupplier();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Vendors List</h1>
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
            Add Vendor
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 text-center rounded shadow-lg w-[550px] h-auto mt-10">
            <h1 className="text-lg font-semibold mb-5">Add Vendor</h1>
            <hr className="mb-6 border-gray-400" />
            <form className="space-y-6" onSubmit={handleAdd}>
              {/* Name Input */}
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
                  value={newSupplier.name}
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
                  value={newSupplier.phone}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="text-left">
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="name"
                >
                  NIC
                </label>
                <input
                  type="text"
                  id="nic"
                  name="nic"
                  value={newSupplier.nic}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter NIC"
                  required
                />
              </div>
              <div className="text-left">
                <label
                  className="block text-gray-700 font-semibold mb-1"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={newSupplier.amount}
                  onChange={handleChange}
                  className="border w-full px-2 outline-none py-2 rounded-md"
                  placeholder="Enter amount"
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

      <table className="min-w-full max-w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Vendor Name
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Phone
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              NIC
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Amount
            </th>
            <th className="py-3 px-4 text-left text-gray-600 font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedSuppliers.map((supplier) => (
            <tr
              key={supplier._id}
              className="border-b text-gray-700 text-sm hover:bg-gray-100"
            >
              <td className="py-3 px-4 max-w-xs">
                {editingSupplierId === supplier._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editableData.name}
                    onChange={handleEditChange}
                    className="border rounded px- w-full"
                  />
                ) : (
                  supplier.name
                )}
              </td>
              <td className="py-3 px-4 max-w-xs">
                {editingSupplierId === supplier._id ? (
                  <input
                    type="text"
                    name="phone"
                    value={editableData.phone}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  supplier.phone
                )}
              </td>
              <td className="py-3 px-4 max-w-xs">
                {editingSupplierId === supplier._id ? (
                  <input
                    type="text"
                    name="nic"
                    value={editableData.nic}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-full"
                  />
                ) : (
                  supplier.nic
                )}
              </td>
              <td className="py-3 px-9 max-w-xs">
                {editingSupplierId === supplier._id ? (
                  <input
                    type="number"
                    name="amount"
                    value={editableData.amount}
                    onChange={handleEditChange}
                    className="border rounded px-2 w-32"
                  />
                ) : (
                  supplier.amount
                )}
              </td>
              <td className="py-3 px-4 flex">
                {editingSupplierId === supplier._id ? (
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
                      onClick={() => handleEditClick(supplier)}
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      className=" text-red-500 py-1 px-2 rounded-md flex items-center gap-2"
                      onClick={() => handleDelete(supplier._id)}
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
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-2 mx-1 border rounded ${
              currentPage === i + 1
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Suppliers;
