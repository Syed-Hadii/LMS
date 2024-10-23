import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import logo_light from "../assets/logo-light.png";

const PaymentForm = () => {
  const url = "http://localhost:3002";
  const [accountList, setAccountList] = useState([]);
  const [subAccounts, setSubAccounts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [bankAccount, setBankAccount] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(false);
   const [printMode, setPrintMode] = useState(false); 
  const voucherRef = useRef(); 
   const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
   const [voucherDetails, setVoucherDetails] = useState(null); 
  const [formData, setFormData] = useState({
    voucher_no: "",
    posted_date: new Date().toLocaleDateString("en-US"),
    date: "",
    reference: "",
    account: "",
    sub_account: "",
    payment_method: "Cash",
    paid_amount: "",
    desc: "",
    bank_account: "",
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
      payment_method: "Cash",
      paid_amount: "",
      desc: "",
      bank_account: "",
      transaction_number: "",
      cheque_number: "",
    });
   
  };

  const fetchBank = async () => {
    try {
      const response = await axios.get(`${url}/bank/get?all=true`);
      console.log(response)
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
     ...formData,
     payment_method: paymentMethod,
     paid_amount: Number(formData.paid_amount),
     ...(paymentMethod === "Bank Transfer" && {
       bank_account: bankAccount,
       transaction_number: transactionNumber,
     }),
     ...(paymentMethod === "Cheque" && {
       bank_account: bankAccount,
       cheque_number: chequeNumber,
     }),
   };

   try {
     const response = await axios.post(
       `${url}/paymentreciept/add`,
       submissionData
     );
     if (response.data.success) {
       toast.success("Payment Voucher Created Successfully!");
       setVoucherDetails(submissionData); // Set voucher details for modal
       setIsModalOpen(true); // Open modal
       resetForm();
     } else {
       toast.error("Error creating payment voucher");
     }
   } catch (error) {
     console.error(error);
     toast.error("Try Again");
   } finally {
     setLoading(false);
   }
 };
const closeModal = () => setIsModalOpen(false);

const handlePrint = () => {
  const printContent = document.getElementById("printArea").innerHTML;
  const originalContent = document.body.innerHTML;

  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
  window.location.reload(); // Reload to restore original content
};




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between">
        <h1 className="text-xl mb-5 font-semibold text-left">
          Payment Voucher
        </h1>
        <NavLink to="/admin/paymentvoucher">
          <p className="flex items-center gap-2">
            <AiOutlineArrowLeft /> Back
          </p>
        </NavLink>
      </div>

      <hr className="border-gray-300 border-1.5 p-4" />
      <form className="space-y-4 text-gray-700" onSubmit={handleSubmit}>
        {/* Voucher No */}
        <div className="flex flex-col md:flex-row items-center">
          <label className="w-full md:w-40 font-medium">Voucher No</label>
          <input
            type="text"
            name="voucher_no"
            value={formData.voucher_no}
            onChange={handleInputChange}
            required
            className="w-full md:flex-1 px-4 py-2 border rounded outline-none"
          />
        </div>

        {/* Posted Date */}
        <div className="flex flex-col md:flex-row items-center">
          <label className="w-full md:w-40 font-medium">Posted Date</label>
          <input
            type="text"
            value={formData.posted_date}
            className="w-full md:flex-1 px-4 py-2 border rounded outline-none bg-gray-100"
            readOnly
          />
        </div>

        {/* Date */}
        <div className="flex flex-col md:flex-row items-center">
          <label className="w-full md:w-40 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full md:flex-1 px-4 py-2 border rounded outline-none"
            placeholder="Enter Date"
            required
          />
        </div>

        {/* Reference */}
        <div className="flex flex-col md:flex-row items-center">
          <label className="w-full md:w-40 font-medium">Reference</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            className="w-full md:flex-1 px-4 py-2 border rounded outline-none"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center">
          <label className="w-full md:w-40 font-medium">Chart of Account</label>
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
                {account.acc_name} {/* Changed from name to acc_name */}
              </option>
            ))}
          </select>
        </div>

        {/* Conditionally render Sub-Account Dropdown if an account is selected */}
        {formData.account && subAccounts.length > 0 && (
          <div className="flex flex-col md:flex-row items-center">
            <label className="w-full md:w-40 font-medium">Sub-Account</label>
            <select
              name="sub_account"
              value={formData.sub_account}
              onChange={handleInputChange}
              className="w-full md:flex-1 px-4 py-2 border rounded outline-none"
              required
            >
              <option value="">Select Sub Account</option>
              {subAccounts
                .filter((subAccount) => subAccount.account_nature === "Debit")
                .map((subAccount) => (
                  <option key={subAccount._id} value={subAccount._id}>
                    {subAccount.name}{" "}
                    {/* Assuming subAccount has a name field */}
                  </option>
                ))}
            </select>
          </div>
        )}
        {/* Payment Method Dropdown */}
        <div className="flex flex-col md:flex-row items-center">
          <label className="w-full md:w-40 font-medium">Payment Method</label>
          <select
            name="payment_method"
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              handleInputChange(e);
            }}
            className="w-full md:flex-1 px-4 py-2 outline-none border rounded"
            required
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        {/* Conditionally Rendered Fields */}
        {paymentMethod === "Bank Transfer" && (
          <>
            <div className="flex flex-col md:flex-row items-center">
              <label className="w-full md:w-40 font-medium">Bank Account</label>
              <select
                name="bank_account"
                value={bankAccount}
                onChange={(e) => {
                  setBankAccount(e.target.value);
                  handleInputChange(e);
                }}
                className="w-full md:flex-1 px-4 py-2 border rounded outline-none"
                required
              >
                <option value="">Select Bank Account</option>
                {bankList.map((account) => (
                  <option key={account._id} value={account._id}>
                    - {account.account_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:flex-row items-center">
              <label className="w-full md:w-40 font-medium">
                Transaction Number
              </label>
              <input
                type="text"
                name="transaction_number"
                value={transactionNumber}
                onChange={(e) => {
                  setTransactionNumber(e.target.value);
                  handleInputChange(e);
                }}
                className="w-full md:flex-1 px-4 py-2 border rounded outline-none"
                placeholder="Transaction Number"
                required
              />
            </div>
          </>
        )}

        {paymentMethod === "Cheque" && (
          <>
            <div className="flex flex-col md:flex-row items-center">
              <label className="w-full md:w-40 font-medium">Bank Account</label>
              <select
                name="bank_account"
                value={bankAccount}
                onChange={(e) => {
                  setBankAccount(e.target.value);
                  handleInputChange(e);
                }}
                className="w-full md:flex-1 px-4 py-2 border rounded outline-none"
                required
              >
                <option value="">Select Bank Account</option>
                {bankList.map((account) => (
                  <option key={account._id} value={account._id}>
                    - {account.account_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:flex-row items-center">
              <label className="w-full md:w-40 font-medium">
                Cheque Number
              </label>
              <input
                type="text"
                name="cheque_number"
                value={chequeNumber}
                onChange={(e) => {
                  setChequeNumber(e.target.value);
                  handleInputChange(e);
                }}
                className="w-full md:flex-1 px-4 py-2 border rounded outline-none"
                placeholder="Cheque Number"
                required
              />
            </div>
          </>
        )}

        <div className="flex flex-col md:flex-row items-center">
          <label className="w-full md:w-40 font-medium">Paid Amount</label>
          <input
            type="number"
            name="paid_amount"
            value={formData.paid_amount}
            onChange={handleInputChange}
            className="w-full md:flex-1 px-4 py-2 border rounded outline-none"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row items-center">
          <label className="w-full md:w-40 font-medium">Description</label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            className="w-full md:flex-1 px-4 py-2 border rounded outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : "Create payment Voucher"}
        </button>
      </form>

      {/* Modal for Voucher Details */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className="p-6 bg-white mt-20 border rounded shadow-lg w-1/3 mx-auto"
      >
        {/* Main voucher details */}
        {voucherDetails && (
          <div className="overflow-x-auto mt-4" id="printArea">
            <div className="flex justify-between border-b items-center mb-4">
              <h2 className="text-xl font-semibold pb-3 flex-grow">
                Payment Voucher
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
                    <strong className="font-semibold">Payment Method:</strong>
                  </td>
                  <td className="border text-right border-gray-300 px-4 py-2">
                    {voucherDetails.payment_method}
                  </td>
                </tr>
                {voucherDetails.payment_method === "Bank Transfer" && (
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
                {voucherDetails.payment_method === "Cheque" && (
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

export default PaymentForm;
