import axios from "axios";
import React, { useEffect, useState } from "react";
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
import { RotatingLines } from "react-loader-spinner";

const Suppliers = () => {
  const url = "http://localhost:3002";
  const [showAddForm, setShowAddForm] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [totalPages, setTotalPages] = useState(1);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone: "",
    nic: "",
    amount: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const filteredSupplier = supplierList
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
     setLoading(true);
    try {
      const response = await axios.get(
        `${url}/supplier/get?page=${currentPage}&limit=${recordsPerPage}&search=${searchQuery}`
      );
      setSupplierList(response.data.supplier);
      console.log(response.data.supplier);
      
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage)
    } catch (error) {
      console.log("Error fetching supplier records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/supplier/add`, newSupplier);
      toast.success("Vendor Added Successfully!");
      setShowAddForm(false);
      setNewSupplier({ name: "", phone: "", nic: "", amount: "" });
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
  const confirmDelete = () => {
    toast.dismiss();
    deleteVoucher(id);
  };

  toast.info(
    <div>
      Are you sure you want to delete this vendor?
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

  const deleteVoucher = async (id) => {
   setLoading(true);
  try {
    const response = await axios.delete(`${url}/supplier/delete`, {
      data: { id },
    });
    if (response.data.success) {
      toast.success("Vendor deleted successfully!");
      fetchSupplier();
    } else {
      toast.error("Error deleting Vendor");
    }
  } catch (error) {
    console.error("Error deleting Vendor:", error);
    toast.error("Error deleting Vendor");
  } finally {
    setLoading(false);
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

 const handlePageChange = (page) => {
   if (page > 0 && page <= totalPages) {
     setCurrentPage(page);
     //  fetchHaari();
   }
 };

  useEffect(() => {
    fetchSupplier();
  }, [currentPage, searchQuery]);

  return (
    <div className="p-5">
      <h1 className="text-xl mb-5 font-semibold text-left">Vendors List</h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
            placeholder="Search Vendor"
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
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <RotatingLines width="50" strokeColor="#067528" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-5 bg-[#e0f2e9] text-sm md:text-base">
              <div
                className="py-3  text-center text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Vendor Name{" "}
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
                Phone{" "}
                {sortConfig.key === "phone" ? (
                  <span className="inline-block align-middle text-xs">
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="py-3  text-center text-gray-800 font-semibold">
                NIC
              </div>
              <div
                className="py-3 text-center text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                Amount{" "}
                {sortConfig.key === "amount" ? (
                  <span className="inline-block align-middle text-xs">
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="py-3 px-4 text-center text-gray-800 font-semibold">
                Actions
              </div>
            </div>

            {filteredSupplier.map((supplier) => (
              <div
                key={supplier._id}
                className="grid grid-cols-5 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100"
              >
                <div className="py-3 text-center max-w-xs">
                  {editingSupplierId === supplier._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editableData.name}
                      onChange={handleEditChange}
                      className="border rounded px-2 w-full"
                    />
                  ) : (
                    supplier.name
                  )}
                </div>
                <div className="py-3 text-center max-w-xs">
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
                </div>
                <div className="py-3 px-4 text-center max-w-xs">
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
                </div>
                <div className="py-3 px-4 text-center max-w-xs">
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
                </div>
                <div className="py-3 px-3 md:px-[75px] text-center flex">
                  {editingSupplierId === supplier._id ? (
                    <>
                      <button
                        className=" text-green-500 py-1 md:px-2 rounded-md flex items-center gap-2 mr-2"
                        onClick={handleSaveClick}
                      >
                        <FaSave className="text-sm" />
                      </button>
                      <button
                        className=" text-gray-700 py-1 md:px-2 rounded-md flex items-center gap-2"
                        onClick={handleCancelEdit}
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className=" text-green-600 py-1 md:px-2 rounded-md flex items-center gap-2 mr-2"
                        onClick={() => handleEditClick(supplier)}
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        className=" text-red-600 py-1 md:px-2 rounded-md flex items-center "
                        onClick={() => handleDelete(supplier._id)}
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

export default Suppliers;
