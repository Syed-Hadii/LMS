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
import { NavLink } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

const JournalVoucherList = () => {
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
  };

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/journalvoucher/get?page=${currentPage}&limit=${recordsPerPage}&search=${searchTerm}`
      );
      console.log("Response from API:", response.data.voucherList);

      if (response) {
        console.log(response);

        setVouchers(response.data.voucherList); // Assuming the vouchers are in response.data.vouchers
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
        `${url}/journalvoucher/update/${editingVoucherId}`,
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
      const response = await axios.delete(`${url}/journalvoucher/delete`, {
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
        const creditAcc = voucher.credit.account
          ? voucher.credit.account.acc_name
          : "";
        const debitAcc = voucher.debit.account
          ? voucher.debit.account.acc_name
          : "";
        return (
          (typeof creditAcc === "string" &&
            creditAcc.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (typeof voucher.voucher_no !== "undefined" &&
            String(voucher.voucher_no)
              .toLowerCase()
              .includes(lowerCaseSearchTerm)) ||
          (typeof debitAcc === "string" &&
            debitAcc.toLowerCase().includes(lowerCaseSearchTerm))
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
      <h1 className="text-xl mb-5 font-semibold text-left">Journal Vouchers</h1>
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
          <NavLink to="journalform">
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
      ) : vouchers.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">No vouchers found.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            {/* Heading Section */}
            <div className="grid grid-cols-6 bg-[#e0f2e9] text-sm md:text-base">
              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Voucher No
              </div>
              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Debit Account
              </div>
              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Credit Account
              </div>
              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Date
              </div>
              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Posted Date
              </div>

              <div className="py-3 text-center w-full text-gray-800 font-semibold">
                Actions
              </div>
            </div>

            {/* Vouchers Section */}
            {filteredVouchers.map((voucher, i) => {
              const isExpanded = expandedVoucherId === voucher._id;
              return (
                <div
                  key={i}
                  className="grid grid-cols-6 gap-2 border-b text-gray-700 text-sm hover:bg-gray-100"
                  onClick={() => toggleExpand(voucher._id)}
                >
                  {/* Voucher Fields */}
                  <div className="pt-4 px-4 text-center">
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
                  <div className="pt-4 px-4 text-center">
                    {typeof voucher.credit.account === "object"
                      ? voucher.credit.account.acc_name
                      : voucher.credit.account }
                  </div>
                  <div className="pt-4 px-4 text-center">
                    {typeof voucher.debit.account === "object"
                      ? voucher.debit.account.acc_name
                      : voucher.debit.account}
                  </div>
                  <div className="pt-4 px-4 text-center">
                    {new Date(voucher.posted_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </div>
                  <div className="pt-4 px-4 text-center">
                    {new Date(voucher.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </div>

                  {/* Actions */}
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
                      <div className="flex justify-center ml-12 gap-2">
                        <button
                          onClick={() => handleEditClick(voucher)}
                          className="text-green-600 rounded py-1"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(voucher._id)}
                          className="text-red-500 rounded px-1 py-1"
                        >
                          <FaTrash />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 ml-5">
                          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className={`transition-all duration-300 ${
                      isExpanded
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {isExpanded && (
                      <div className="p-4 border-t  text-nowrap w-[75vw]">
                        {/* Debit Details */}
                        <div className="text-sm">
                          <div className="flex flex-col">
                            <strong className="font-bold">
                              Debit Details:
                            </strong>
                            <span className="mb-2 ml-4">
                              <div className="text-sm">
                                <strong className="font-semibold">
                                  Debit Account:
                                </strong>{" "}
                                {voucher.debit.account}
                              </div>
                              <div className="text-sm">
                                <strong className="font-semibold">
                                  Sub Account:
                                </strong>{" "}
                                {voucher.debit.sub_account || "N/A"}
                              </div>
                              <div className="text-sm">
                                <strong className="font-semibold">
                                  Debit Amount:
                                </strong>{" "}
                                {voucher.debit.debit_amount || "0"}
                              </div>
                            </span>
                          </div>
                        </div>

                        {/* Credit Details */}
                        <div className="text-sm">
                          <div className="flex flex-col">
                            <strong className="font-bold">
                              Credit Details:
                            </strong>
                            <span className="mb-2 ml-4">
                              <div className="text-sm">
                                <strong className="font-semibold">
                                  Credit Account:
                                </strong>{" "}
                                {voucher.credit.account}
                              </div>
                              <div className="text-sm">
                                <strong className="font-semibold">
                                  Sub Account:
                                </strong>{" "}
                                {voucher.credit.sub_account || "N/A"}
                              </div>
                              <div className="text-sm">
                                <strong className="font-semibold">
                                  Credit Amount:
                                </strong>{" "}
                                {voucher.credit.credit_amount || "0"}
                              </div>
                            </span>
                          </div>
                        </div>

                        <p className="text-sm ">
                          <strong className="font-bold mr-1">Memo:</strong>{" "}
                          {voucher.memo}
                        </p>
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

export default JournalVoucherList;
