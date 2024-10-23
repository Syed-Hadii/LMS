import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { NavLink } from "react-router-dom";

const RecieveVoucherList = () => {
  const url = "http://localhost:3002";
  const [loading, setLoading] = useState(true);
  const [editingVoucherId, setEditingVoucherId] = useState(null);
  const [editableVoucher, setEditableVoucher] = useState({});
  const [expandedVoucherId, setExpandedVoucherId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
    const [totalPages, setTotalPages] = useState(1);
  const [vouchers, setVouchers] = useState([]);
  
  const toggleExpand = (voucherId) => {
    setExpandedVoucherId((prevId) => (prevId === voucherId ? null : voucherId));
    console.log(voucherId)
  };


  const fetchVouchers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${url}/recievereciept/get?page=${currentPage}&limit=${recordsPerPage}&search=${searchTerm}`
      );
      if (response) {
        console.log(response);

        setVouchers(response.data.voucherList); 
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } else {
        console.error("Invalid response structure:", response.data);
        toast.error("Error fetching vouchers");
      }
      
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      toast.error("Error fetching vouchers");
    } finally {
      setLoading(false);
    }
  };

  

  const handleEditClick = (voucher) => {
    setEditingVoucherId(voucher._id);
    setEditableVoucher(voucher); // Set editable voucher details
  };

  const handleEditChange = (e) => {
    setEditableVoucher({
      ...editableVoucher,
      [e.target.name]: e.target.value, // Handle input changes dynamically
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${url}/recievereciept/update/${editingVoucherId}`,
        editableVoucher
      );
      if (response.data.success) {
        toast.success("Voucher updated successfully!");
        fetchVouchers();
        setEditingVoucherId(null); // Exit edit mode
      } else {
        toast.error("Error updating voucher");
      }
    } catch (error) {
      console.error("Error updating voucher:", error);
      toast.error("Error updating voucher");
    }
  };

  const handleCancelEdit = () => {
    setEditingVoucherId(null); // Exit edit mode without saving
  };
  const handleDelete = async (voucherId) => {
    toast.info(
      <div>
        Are you sure you want to delete this voucher?
        <div className="flex justify-end mt-2">
          <button
            onClick={() => deleteVoucher(voucherId)}
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

  const deleteVoucher = async (voucherId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${url}/recievereciept/delete`, {
        data: { voucherId },
      });
      if (response.data.success) {
         toast.dismiss();
        toast.success("Voucher deleted successfully!");
        fetchVouchers();
      } else {
        toast.error("Error deleting voucher");
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      toast.error("Error deleting voucher");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const filterVouchers = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = vouchers.filter((voucher) => {
      const accName = voucher.account ? voucher.account.acc_name : "";
      return (
        (typeof accName === "string" &&
          accName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (typeof voucher.voucher_no !== "undefined" &&
          String(voucher.voucher_no)
            .toLowerCase()
            .includes(lowerCaseSearchTerm)) ||
        (typeof voucher.reference === "string" &&
          voucher.reference.toLowerCase().includes(lowerCaseSearchTerm))
      );
    });
    setFilteredVouchers(filtered);
  };
  filterVouchers();
}, [searchTerm, vouchers]);
  
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  useEffect(() => {
    fetchVouchers();
  }, [currentPage, searchTerm]);


  return (
    <div className="p-6 mx-auto">
      <h1 className="text-xl mb-5 font-semibold text-left">Reciept Vouchers</h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className="border border-gray-400 rounded-md h-10 flex">
          <input
            type="text"
            className="outline-none w-72 rounded-md px-2 py-1.5"
            placeholder="Search Accounts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="h-full px-4 text-lg text-gray-500">
            <FaSearch />
          </button>
        </div>
        <div>
          <NavLink to="recieveform">
            <button className="bg-[#067528] text-white font-semibold px-4 flex items-center gap-2 rounded-md py-2 mb-5">
              <FaPlus className="text-sm" />
              Create Voucher
            </button>
          </NavLink>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <RotatingLines width="50" strokeColor="#067528" />
        </div>
      ) : filteredVouchers.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">No vouchers found.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            {/* Heading Section */}
            <div className="grid grid-cols-7 bg-[#e0f2e9] text-sm md:text-base">
              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Voucher No
              </div>
              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Account
              </div>
              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Sub Account
              </div>
              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Date
              </div>
              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Posted Date
              </div>
              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Reference
              </div>
              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Actions
              </div>
            </div>

            {/* Vouchers Section */}
            {filteredVouchers.map((voucher, i) => {
              const isExpanded = expandedVoucherId === voucher._id; // Track expanded voucher

              return (
                <div key={i}>
                  {/* Voucher Row */}
                  <div
                    className="grid grid-cols-7 gap-2 border-b text-gray-700 text-sm hover:bg-gray-100 cursor-pointer "
                    onClick={() => toggleExpand(voucher._id)} // Toggle expand on click
                  >
                    <div className="py-6 px-4 text-center">
                      {editingVoucherId === voucher._id ? (
                        <input
                          type="text"
                          name="voucher_no"
                          className="border rounded px-2 w-full"
                          value={editableVoucher.voucher_no || ""}
                          onChange={handleEditChange}
                        />
                      ) : (
                        voucher.voucher_no
                      )}
                    </div>
                    <div className="py-6 px-4 text-center">
                      {voucher.account && typeof voucher.account === "object"
                        ? voucher.account.acc_name
                        : voucher.account}
                    </div>

                    <div className="py-6 px-4 text-center">
                      {voucher.sub_account &&
                      typeof voucher.sub_account === "object"
                        ? voucher.sub_account.name
                        : voucher.sub_account}
                    </div>
                    <div className="py-6 px-4 text-center">
                      {new Date(voucher.posted_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}
                    </div>
                    <div className="py-6 px-4 text-center">
                      {new Date(voucher.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </div>
                    <div className="py-3 px-4 text-center">
                      {voucher.reference}
                    </div>

                    <div className="py-3 px-6 text-center w-full flex justify-center">
                      {editingVoucherId === voucher._id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className=" text-green-500 rounded px-2 py-1"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className=" text-gray-500 rounded px-2 py-1"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleEditClick(voucher)}
                            className="text-green-600 rounded px-2 ml-6 py-1"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(voucher._id)}
                            className="text-red-500 rounded px-2 py-1"
                          >
                            <FaTrash />
                          </button>
                          <div className="py-3 px-2 text-center">
                            <button className="text-gray-600 hover:text-gray-800">
                              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <div
                    className={`transition-all duration-300 ${
                      isExpanded
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {isExpanded && (
                      <div className="p-4 border-b">
                        {/* Payment Method Details */}
                        {voucher.recieve_method === "Bank Transfer" && (
                          <>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Payment Method:
                              </strong>{" "}
                              {voucher.recieve_method}
                            </p>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Bank Account:
                              </strong>{" "}
                              {voucher.bank_account?.account_name}
                            </p>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Transaction No:
                              </strong>{" "}
                              {voucher.transaction_number}
                            </p>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Recieve Amount:
                              </strong>{" "}
                              {voucher.paid_amount}
                            </p>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Description:
                              </strong>{" "}
                              {voucher.desc}
                            </p>
                          </>
                        )}
                        {voucher.recieve_method === "Cheque" && (
                          <>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Payment Method:
                              </strong>{" "}
                              {voucher.recieve_method}
                            </p>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Bank Account:
                              </strong>{" "}
                              {voucher.bank_account?.account_name}
                            </p>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Cheque No:
                              </strong>{" "}
                              {voucher.cheque_number}
                            </p>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Recieve Amount:
                              </strong>{" "}
                              {voucher.paid_amount}
                            </p>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Description:
                              </strong>{" "}
                              {voucher.desc}
                            </p>
                          </>
                        )}
                        {voucher.recieve_method === "Cash" && (
                          <>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Payment Method:
                              </strong>{" "}
                              {voucher.recieve_method}
                            </p>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Recieve Amount:
                              </strong>{" "}
                              {voucher.paid_amount}
                            </p>
                            <p className="text-sm">
                              <strong className="font-semibold">
                                Description:
                              </strong>{" "}
                              {voucher.desc}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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

export default RecieveVoucherList;
