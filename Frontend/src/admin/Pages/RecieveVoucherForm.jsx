import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Modal from "react-modal";
import logo_light from "../assets/logo-light.png";

const RecieveForm = () => {
  const url = "http://localhost:3002";
  const [accountList, setAccountList] = useState([]);
  const [subAccounts, setSubAccounts] = useState([]);
  const [recieveMethod, setrecieveMethod] = useState("Cash");
  const [selectedBank, setSelectedBank] = useState(null); // Updated to store the bank object
  const [transactionNumber, setTransactionNumber] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [formData, setFormData] = useState({
    voucher_no: "",
    posted_date: new Date().toLocaleDateString("en-US"),
    date: "",
    reference: "",
    account: "",
    sub_account: "",
    recieve_method: "Cash",
    paid_amount: "",
    desc: "",
    bank_account: "", // Keep this if needed for other data, else you can remove it
    transaction_number: "",
    cheque_number: "",
  });

  const resetForm = () => {
    setFormData({
      voucher_no: "",
      posted_date: new Date().toLocaleDateString("en-US"),
      date: "",
      reference: "",
      account: "",
      sub_account: "",
      recieve_method: "Cash",
      paid_amount: "",
      desc: "",
      bank_account: "",
      transaction_number: "",
      cheque_number: "",
    });
    setSelectedBank(null); // Reset selected bank
  };

  const fetchBank = async () => {
    try {
      const response = await axios.get(`${url}/bank/get?all=true`);
      console.log(response);
      setBankList(response.data.BankList);
    } catch (error) {
      console.log("Error fetching bank records:", error);
    }
  };

  const fetchAccount = async () => {
    try {
      const response = await axios.get(`${url}/chartaccount/get?all=true`);
      setAccountList(response.data.chartAccounts);
      console.log(response);
    } catch (error) {
      console.log("Error fetching chartaccount records:", error);
    }
  };

  useEffect(() => {
    fetchAccount();
    fetchBank();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = {
      voucher_no: formData.voucher_no,
      posted_date: formData.posted_date,
      date: formData.date,
      reference: formData.reference,
      account: formData.account,
      sub_account: formData.sub_account,
      recieve_method: recieveMethod,
      paid_amount: Number(formData.paid_amount), // Ensure this is a number
      desc: formData.desc,
      ...(recieveMethod === "Bank Transfer" && {
        bank_account: selectedBank?._id, // Use the selected bank's object ID
        transaction_number: transactionNumber,
      }),
      ...(recieveMethod === "Cheque" && {
        bank_account: selectedBank?._id, // Use the selected bank's object ID
        cheque_number: chequeNumber,
      }),
    };

    console.log("Submitting data:", submissionData);

    try {
      const response = await axios.post(
        `${url}/recievereciept/add`,
        submissionData
      );
      console.log("Response from server:", response);

      if (response.data.success) {
        toast.success("Payment Voucher Created Successfully!");

        // Set voucher details for modal (adjust as necessary)
        setVoucherDetails(submissionData); // Set voucher details for modal
        setIsModalOpen(true); // Open modal

        resetForm();
      } else {
        toast.error("Error creating payment voucher");
      }
    } catch (error) {
      console.error(
        "Submission error:",
        error.response ? error.response.data : error.message
      );
      toast.error("Try Again");
    } finally {
      setLoading(false);
    }
  };

  // Close modal function
  const closeModal = () => setIsModalOpen(false);

  // Print function
 const handlePrint = () => {
   setIsPrinting(true); // Show loader during printing

   const printContent = document.getElementById("printArea").innerHTML;
   const originalContent = document.body.innerHTML;

   document.body.innerHTML = printContent;
   window.print();

   // Restore content and close the modal smoothly after printing
   setTimeout(() => {
     document.body.innerHTML = originalContent;
     window.location.reload();
     setIsPrinting(false); // Hide loader
     closeModal(); // Close modal automatically
   }, 1000); // Delay to allow print completion
 };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-xl mb-5 font-semibold text-left">
          Reciept Voucher
        </h1>
        <NavLink to="/admin/recievevoucher">
          <p className="flex items-center gap-2">
            <AiOutlineArrowLeft /> Back
          </p>
        </NavLink>
      </div>
      <hr className="border-gray-300 border-1.5 p-4" />
      <form className="space-y-4 text-gray-700" onSubmit={handleSubmit}>
        {/* Voucher No */}
        <div className="flex flex-col md:flex-row md:items-center">
          <label className="w-full md:w-40 font-medium">Voucher No</label>
          <input
            type="text"
            name="voucher_no"
            value={formData.voucher_no}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded outline-none"
          />
        </div>

        {/* Posted Date */}
        <div className="flex flex-col md:flex-row md:items-center">
          <label className="w-full md:w-40 font-medium">Posted Date</label>
          <input
            type="text"
            value={formData.posted_date}
            className="w-full px-4 py-2 border rounded outline-none bg-gray-100"
            readOnly
          />
        </div>

        {/* Date */}
        <div className="flex flex-col md:flex-row md:items-center">
          <label className="w-full md:w-40 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
            placeholder="Enter Date"
            required
          />
        </div>

        {/* Reference */}
        <div className="flex flex-col md:flex-row md:items-center">
          <label className="w-full md:w-40 font-medium">Reference</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center">
          <label className="w-full md:w-[136px] font-medium">
            Chart of Account
          </label>
          <select
            name="account"
            value={formData.account}
            onChange={(e) => {
              handleInputChange(e);
              const selectedAccountId = e.target.value;
              const selectedAccount = accountList.find(
                (account) => account._id === selectedAccountId
              );
              setSubAccounts(selectedAccount ? selectedAccount.subCat : []);
              setFormData((prevData) => ({
                ...prevData,
                sub_account: "", // Reset sub_account when account changes
              }));
            }}
            className="w-full md:flex-1 px-4 py-2 border rounded outline-none"
            required
          >
            <option value="">Select Account</option>
            {accountList.map((account) => (
              <option key={account._id} value={account._id}>
                {account.acc_name}
              </option>
            ))}
          </select>
        </div>

        {/* Conditionally render Sub-Account Dropdown if an account is selected */}
        {formData.account && subAccounts.length > 0 && (
          <div className="flex flex-col md:flex-row items-center">
            <label className="w-full md:w-[136px] font-medium">
              Sub-Account
            </label>
            <select
              name="sub_account"
              value={formData.sub_account}
              onChange={handleInputChange}
              className="w-full md:flex-1 px-4 py-2 border rounded outline-none"
              required
            >
              <option value="">Select Sub Account</option>
              {subAccounts
                .filter((subAccount) => subAccount.account_nature === "Credit")
                .map((subAccount) => (
                  <option key={subAccount._id} value={subAccount._id}>
                    {subAccount.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Payment Method Dropdown */}
        <div className="flex flex-col md:flex-row md:items-center">
          <label className="w-full md:w-40 font-medium">Reciept Method</label>
          <select
            name="recieve_method"
            value={recieveMethod}
            onChange={(e) => {
              setrecieveMethod(e.target.value);
              handleInputChange(e);
            }}
            className="w-full px-4 py-2 border outline-none rounded"
            required
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        {/* Conditionally render bank account selection for Bank Transfer and Cheque */}
        {(recieveMethod === "Bank Transfer" || recieveMethod === "Cheque") && (
          <>
            <div className="flex flex-col md:flex-row md:items-center">
              <label className="w-full md:w-40 font-medium">Bank Account</label>
              <select
                onChange={(e) => {
                  const selectedBankId = e.target.value;
                  const selectedBank = bankList.find(
                    (bank) => bank._id === selectedBankId
                  );
                  setSelectedBank(selectedBank); // Set the selected bank object
                }}
                className="w-full px-4 py-2 border rounded outline-none"
                required
              >
                <option value="">Select Bank</option>
                {bankList.map((bank) => (
                  <option key={bank._id} value={bank._id}>
                    {bank.account_number} - {bank.bank_name}
                  </option>
                ))}
              </select>
            </div>

            {recieveMethod === "Bank Transfer" && (
              <div className="flex flex-col md:flex-row md:items-center">
                <label className="w-full md:w-40 font-medium">
                  Transaction Number
                </label>
                <input
                  type="text"
                  value={transactionNumber}
                  onChange={(e) => setTransactionNumber(e.target.value)}
                  className="w-full px-4 py-2 border rounded outline-none"
                  required
                />
              </div>
            )}

            {recieveMethod === "Cheque" && (
              <div className="flex flex-col md:flex-row md:items-center">
                <label className="w-full md:w-40 font-medium">
                  Cheque Number
                </label>
                <input
                  type="text"
                  value={chequeNumber}
                  onChange={(e) => setChequeNumber(e.target.value)}
                  className="w-full px-4 py-2 border rounded outline-none"
                  required
                />
              </div>
            )}
          </>
        )}
        {/* Paid Amount */}
        <div className="flex flex-col md:flex-row md:items-center">
          <label className="w-full md:w-40 font-medium">Reciept Amount</label>
          <input
            type="number"
            name="paid_amount"
            value={formData.paid_amount}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded outline-none"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col md:flex-row md:items-center">
          <label className="w-full md:w-40 font-medium">Description</label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border rounded outline-none"
          />
        </div>

        <button
          type="submit"
          className={`bg-green-600 hover:bg-green-700 text-white mt-4 w-full px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Reciept Voucher"}
        </button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className="p-6 bg-white mt-20 border rounded shadow-lg w-1/3 mx-auto"
      >
        {isPrinting && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
          </div>
        )}
        {/* Main voucher details */}
        {voucherDetails && (
          <div className="overflow-x-auto mt-4" id="printArea">
            <div className="flex justify-between border-b items-center mb-4">
              <h2 className="text-xl font-semibold pb-3 flex-grow">
                Receipt Voucher
              </h2>
              <img src={logo_light} alt="Software Logo" className="h-8" />
            </div>
            <div className="flex items-center justify-between">
              <h1 className="font-bold py-2">Voucher details:</h1>
              <p className="underline">
                <strong className="font-semibold">Date:</strong>{" "}
                {new Date(voucherDetails.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
            <table className="min-w-full border-collapse text-sm border-gray-200">
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong className="font-semibold">Voucher No:</strong>
                  </td>
                  <td className="border text-right border-gray-300 px-4 py-2">
                    {voucherDetails.voucher_no}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong className="font-semibold">Description:</strong>
                  </td>
                  <td className="border text-right border-gray-300 px-4 py-2">
                    {voucherDetails.desc}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong className="font-semibold"> Account:</strong>
                  </td>
                  <td className="border text-right border-gray-300 px-4 py-2">
                    {voucherDetails.sub_account}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong className="font-semibold">Receipt Method:</strong>
                  </td>
                  <td className="border text-right border-gray-300 px-4 py-2">
                    {voucherDetails.recieve_method}
                  </td>
                </tr>
                {voucherDetails.recieve_method === "Bank Transfer" && (
                  <>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        <strong className="font-semibold">Bank Account:</strong>
                      </td>
                      <td className="border text-right border-gray-300 px-4 py-2">
                        {voucherDetails.bank_account}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        <strong className="font-semibold">
                          Transaction Number:
                        </strong>
                      </td>
                      <td className="border text-right border-gray-300 px-4 py-2">
                        {voucherDetails.transaction_number}
                      </td>
                    </tr>
                  </>
                )}
                {voucherDetails.recieve_method === "Cheque" && (
                  <>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        <strong className="font-semibold">Bank Account:</strong>
                      </td>
                      <td className="border text-right border-gray-300 px-4 py-2">
                        {voucherDetails.bank_account}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        <strong className="font-semibold">
                          Cheque Number:
                        </strong>
                      </td>
                      <td className="border text-right border-gray-300 px-4 py-2">
                        {voucherDetails.cheque_number}
                      </td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong className="font-semibold"> Amount:</strong>
                  </td>
                  <td className="border text-right border-gray-300 text-green-600 px-4 py-2">
                    PKR {voucherDetails.paid_amount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between mt-12">
          <div className="flex w-full justify-end gap-5">
            <button
              onClick={closeModal}
              className="text-red-600 px-2 py-2 rounded text-sm flex items-center gap-2"
            >
              <FaTimes />
              Close
            </button>
            <button
              className="bg-green-600 text-white font-semibold text-sm px-4 py-2 rounded"
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecieveForm;
