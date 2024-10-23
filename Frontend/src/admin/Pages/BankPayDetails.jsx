import { useState, useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaPlus,
  FaEye,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";
import { NavLink } from "react-router-dom";

const CashAccountLedger = () => {
  const url = "http://localhost:3002";
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [data, setData] = useState([]);

  const [isDateFilterVisible, setIsDateFilterVisible] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState(null); // For modal popup

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const receiptResponse = await axios.get(
        `${url}/recievereciept/get?all=true`
      );
      const paymentResponse = await axios.get(
        `${url}/paymentreciept/get?all=true`
      );
      const combinedData = [...receiptResponse.data, ...paymentResponse.data];
      const filteredData = combinedData.filter(
        (item) =>
          item.recieve_method !== "Cash" && item.payment_method !== "Cash"
      );

      const sortedByDate = filteredData.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setData(sortedByDate);
      setSortedData(sortedByDate);
      console.log(sortedByDate);
    } catch (error) {
      console.log("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...sortedData].sort((a, b) => {
      if (key === "date") {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    setSortedData(sorted);
    setSortConfig({ key, direction });
  };
  useEffect(() => {
    const filterData = () => {
      const filtered = sortedData.filter((item) => {
        if (searchTerm === "Payment Vouchers") {
          return item.payment_method?.toLowerCase(); // Adjust as needed
        } else if (searchTerm === "Receipt Vouchers") {
          return item.recieve_method?.toLowerCase(); // Adjust as needed
        }
        return true; // For "All Vouchers", return all items
      });

      setFilteredData(filtered);
    };

    filterData();
  }, [searchTerm, sortedData]);

 const handleDateChange = (e) => {
   const { name, value } = e.target;
   if (name === "fromDate") setFromDate(value);
   else if (name === "toDate") setToDate(value);
 };

 const normalizeDate = (dateString) => {
   const date = new Date(dateString);
   return new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Normalizing time to 00:00:00
 };

 const handleFilterByDate = () => {
   if (fromDate && toDate) {
     const start = normalizeDate(fromDate);
     const end = normalizeDate(toDate);

     const filtered = [...filteredData]
       .filter((item) => {
         const itemDate = normalizeDate(item.date); // Adjust based on your data format
         return itemDate >= start && itemDate <= end;
       })
       .sort((a, b) => {
         const dateA = new Date(a.date);
         const dateB = new Date(b.date);
         return isAscending ? dateA - dateB : dateB - dateA;
       });

     setFilteredData(filtered);
   }
 };

 const toggleDateFilter = () => {
   setIsDateFilterVisible(!isDateFilterVisible);
 };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditableData(item);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditableData({ ...editableData, [name]: value });
  };

  const handleSaveClick = () => {
    setEditingId(null);
    // Save logic here
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    // Delete logic here
  };

  const handleRowClick = (item) => {
    setSelectedVoucher(item); // Open modal with voucher details
  };

  const handleCloseModal = () => {
    setSelectedVoucher(null); // Close modal
  };

  const debitItems = sortedData.filter((item) => item.recieve_method);
  const creditItems = sortedData.filter((item) => item.payment_method);

  const totalDebit = debitItems.reduce(
    (sum, item) => sum + item.paid_amount,
    0
  );
  const totalCredit = creditItems.reduce(
    (sum, item) => sum + item.paid_amount,
    0
  );
  const balance = totalDebit - totalCredit;

  return (
    <div className="p-6">
      <h1 className="text-xl mb-5 font-semibold text-left">Bank Details</h1>
      <div className="flex justify-between flex-wrap gap-3">
        <div className=" w-96  border-gray-400 gap-2 rounded-md h-10 flex items-center">
          {/* Dropdown for voucher type */}
          <select
            className="outline-none w-96 rounded-md px-4 py-1.5 border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            <option value="All Vouchers">All Vouchers</option>
            <option value="Payment Vouchers">Payment Vouchers</option>
            <option value="Receipt Vouchers">Receipt Vouchers</option>
          </select>
          {/* Filter button */}
          <div className="flex items-center gap-5">
            <button
              className="w-40 py-1.5 bg-green-500 text-white font-semibold rounded-md"
              onClick={toggleDateFilter}
            >
              Filter by Date {isAscending ? "↑" : "↓"}
            </button>

            {isDateFilterVisible && (
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  name="fromDate"
                  value={fromDate}
                  onChange={handleDateChange}
                  className="border rounded-md px-2 py-1"
                  placeholder="From Date"
                />
                <input
                  type="date"
                  name="toDate"
                  value={toDate}
                  onChange={handleDateChange}
                  className="border rounded-md px-2 py-1"
                  placeholder="To Date"
                />
                <button
                  className="py-1 px-4 bg-blue-500 text-white font-semibold rounded-md"
                  onClick={handleFilterByDate}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          <NavLink to="/admin/bankaccount">
            <p className="flex items-center gap-2 bg-green-600 text-white px-2 py-2 rounded-md">
              {" "}
              <FaEye /> View Banks
            </p>
          </NavLink>
        </div>
      </div>
      <div className="flex gap-6 justify-end"></div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <RotatingLines width="50" strokeColor="#067528" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 bg-[#e0f2e9] text-center text-sm md:text-base">
              <div
                className="py-3 text-gray-800 font-semibold cursor-pointer"
                onClick={() => handleSort("voucher_no")}
              >
                Voucher No
                {sortConfig.key === "voucher_no" && (
                  <span className="inline-block ml-2 -mt-1 align-middle text-xs">
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </div>
              <div className="py-3 text-gray-800 font-semibold">Debit</div>
              <div className="py-3 text-gray-800 font-semibold">Credit</div>
              <div className="py-3 text-gray-800 font-semibold">Date</div>
            </div>

            {/* Data Rows */}
            {filteredData.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-4 gap-2 border-b text-gray-700 text-xs md:text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(item)}
              >
                <div className="py-3 text-center">
                  {editingId === item._id ? (
                    <input
                      type="text"
                      name="voucher_no"
                      value={editableData.voucher_no}
                      onChange={handleEditChange}
                      className="border rounded px-2 w-full"
                    />
                  ) : item.payment_method ? (
                    "Payment Voucher"
                  ) : item.recieve_method ? (
                    "Receipt Voucher"
                  ) : (
                    item.voucher_no
                  )}
                </div>
                <div className="py-3 text-center">
                  {item.recieve_method ? item.paid_amount : "-"}
                </div>
                <div className="py-3 text-center">
                  {item.payment_method ? item.paid_amount : "-"}
                </div>
                <div className="py-3 text-center">
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          {/* Total Section */}
          <div className="bg-white p-4 rounded-md shadow-md mt-4 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              Account Summary
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Total Debit:</span>
                <span className="text-gray-900 font-semibold">
                  PKR {totalDebit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Credit:</span>
                <span className="text-gray-900 font-semibold">
                  PKR {totalCredit}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-medium">Balance:</span>
                <span
                  className={`font-semibold ${
                    balance < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  PKR {balance}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedVoucher && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center 
    transition-opacity duration-300 ease-in-out opacity-0 animate-fade-in z-50"
        >
          <div
            className="bg-white px-8 py-6 rounded-xl shadow-2xl relative w-full max-w-md 
      transform scale-95 transition-transform duration-300 ease-in-out animate-scale-in"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 
        transition-colors duration-200"
              onClick={handleCloseModal}
            >
              <FaTimes size={20} />
            </button>

            {/* Modal Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Voucher Details
            </h2>

            {/* Divider */}
            <hr className="border-t-2 border-gray-100 mb-6" />

            {/* Voucher Information */}
            <div className="space-y-2 text-gray-700">
              <p>
                <strong className="font-medium">Voucher No:</strong>{" "}
                {selectedVoucher.voucher_no}
              </p>

              <p>
                <strong className="font-medium">Date:</strong>{" "}
                {new Date(selectedVoucher.date).toLocaleDateString()}
              </p>
              <p>
                <strong className="font-medium">Posted Date:</strong>{" "}
                {new Date(selectedVoucher.posted_date).toLocaleDateString()}
              </p>
              <p>
                <strong className="font-medium">Description:</strong>{" "}
                {selectedVoucher.desc}
              </p>
              <p>
                <strong className="font-medium">Account:</strong>{" "}
                {selectedVoucher.account}
              </p>
              <p>
                <strong className="font-medium">Sub Account:</strong>{" "}
                {selectedVoucher.sub_account}
              </p>
              <p>
                <strong className="font-medium">Reference:</strong>{" "}
                {selectedVoucher.reference}
              </p>
              <p>
                <strong className="font-medium">Paid Amount:</strong>
                <span className="text-green-600 font-semibold">
                  {" "}
                  PKR {selectedVoucher.paid_amount}
                </span>
              </p>

              {/* Method Conditional Rendering */}
              <p>
                <strong className="font-medium">Method:</strong>
                {selectedVoucher.recieve_method ? (
                  <span> {selectedVoucher.recieve_method}</span>
                ) : selectedVoucher.payment_method ? (
                  <span> {selectedVoucher.payment_method}</span>
                ) : (
                  <span> N/A</span>
                )}
              </p>

              {/* Additional Details for Cheque and Bank Transfer */}
              {selectedVoucher.payment_method === "Cheque" ||
              selectedVoucher.recieve_method === "Cheque" ? (
                <div className="space-y-2 mt-4">
                  <p>
                    <strong className="font-medium">Cheque No:</strong>{" "}
                    {selectedVoucher.cheque_number}
                  </p>
                  <p>
                    <strong className="font-medium">Bank Account Name:</strong>{" "}
                    {selectedVoucher.bank_account.account_name}
                  </p>
                </div>
              ) : (
                (selectedVoucher.payment_method === "Bank Transfer" ||
                  selectedVoucher.recieve_method === "Bank Transfer") && (
                  <div className="space-y-2 mt-4">
                    <p>
                      <strong className="font-medium">Transaction No:</strong>{" "}
                      {selectedVoucher.transaction_number}
                    </p>
                    <p>
                      <strong className="font-medium">
                        Bank Account Name:
                      </strong>{" "}
                      {selectedVoucher.bank_account.account_name}
                    </p>
                  </div>
                )
              )}

              {/* Timestamps */}
              <p className="text-sm text-gray-500 mt-4">
                <strong>Created At:</strong>{" "}
                {new Date(selectedVoucher.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Footer Divider */}
            <hr className="border-t-2 border-gray-100 my-6" />

            {/* Close Button */}
            <div className="text-center">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md 
          hover:bg-indigo-700 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashAccountLedger;
