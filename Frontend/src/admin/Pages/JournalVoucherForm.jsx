import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import Modal from "react-modal";
import logo_light from "../assets/logo-light.png";
import { FaTimes } from "react-icons/fa";

const JournalForm = () => {
  const url = "http://localhost:3002";
  const [accountList, setAccountList] = useState([]);
  const [loading, setLoading] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [voucherDetails, setVoucherDetails] = useState(null);
   const [isPrinting, setIsPrinting] = useState(false);
  const [formData, setFormData] = useState({
    voucher_no: "",
    posted_date: new Date().toLocaleDateString("en-US"),
    date: "",
    debit: {
      account: "",
      sub_account: "",
      debit_amount: "",
    },
    credit: {
      account: "",
      sub_account: "",
      credit_amount: "",
    },
    memo: "",
  });

  const resetForm = () => {
    setFormData({
      voucher_no: "",
      posted_date: new Date().toLocaleDateString("en-US"),
      date: "",
      debit: {
        account: "",
        sub_account: "",
        debit_amount: "",
      },
      credit: {
        account: "",
        sub_account: "",
        credit_amount: "",
      },
      memo: "",
    });
  };

  const fetchAccount = async () => {
    try {
      const response = await axios.get(
        `${url}/chartaccount/get?all=true`
      );
      setAccountList(response.data.chartAccounts);
      console.log(response);
    } catch (error) {
      console.log("Error fetching chartaccount records:", error);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const debitAmount = parseFloat(formData.debit.debit_amount);
    const creditAmount = parseFloat(formData.credit.credit_amount);

    if (debitAmount !== creditAmount) {
      toast.error("Debit and Credit amounts must be the same.");
      setLoading(false);
      return;
    }

    if (
      !formData.debit.account ||
      !formData.debit.sub_account ||
      !formData.credit.account ||
      !formData.credit.sub_account
    ) {
      toast.error("All account and sub-account fields must be selected.");
      setLoading(false);
      return;
    }

    const submissionData = {
      voucher_no: formData.voucher_no,
      posted_date: formData.posted_date,
      date: formData.date,
      debit: {
        account: formData.debit.account,
        sub_account: formData.debit.sub_account,
        debit_amount: formData.debit.debit_amount,
      },
      credit: {
        account: formData.credit.account,
        sub_account: formData.credit.sub_account,
        credit_amount: formData.credit.credit_amount,
      },
      memo: formData.memo,
    };
    console.log(submissionData);

    try {
      const response = await axios.post(
        `${url}/journalvoucher/add`,
        submissionData
      );
      console.log(response);

      if (response.data.success) {
        toast.success("Journal Voucher Created Successfully!");
         setVoucherDetails(submissionData); // Set voucher details for modal
         setIsModalOpen(true);
        resetForm();
      } else {
        toast.error("Error creating journal voucher.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Try Again.");
    } finally {
      setLoading(false);
    }
  };
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
    if (name.includes("debit")) {
      setFormData({
        ...formData,
        debit: {
          ...formData.debit,
          [name.split(".")[1]]: value,
        },
      });
    } else if (name.includes("credit")) {
      setFormData({
        ...formData,
        credit: {
          ...formData.credit,
          [name.split(".")[1]]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-xl mb-5 font-semibold text-left">
          Payment Voucher
        </h1>
        <NavLink to="/admin/journalvoucher">
          <p className="flex items-center gap-2">
            <AiOutlineArrowLeft /> Back
          </p>
        </NavLink>
      </div>
      <hr className="border-gray-300 border-1.5 p-4" />
      <form className="space-y-4 text-gray-700" onSubmit={handleSubmit}>
        <div className="flex items-center">
          <label className="w-40 font-medium">Voucher No</label>
          <input
            type="text"
            name="voucher_no"
            value={formData.voucher_no}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded outline-none"
          />
        </div>
        <div className="flex items-center">
          <label className="w-40 font-medium">Posted Date</label>
          <input
            type="text"
            value={formData.posted_date}
            className="w-full px-4 py-2 border rounded outline-none bg-gray-100"
            readOnly
          />
        </div>
        <div className="flex items-center">
          <label className="w-40 font-medium">Date</label>
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
        <h2 className="font-bold text-lg">Debit Entry:</h2>
        <div className="flex items-center">
          <label className="w-40 font-medium">Account</label>
          <select
            name="debit.account"
            value={formData.debit.account}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
          >
            <option value="">Select Account</option>
            {accountList.map((account) => (
              <option key={account._id} value={account._id}>
                {account.acc_name} {/* Changed here to acc_name */}
              </option>
            ))}
          </select>
        </div>

        {/* Debit Sub-Account Dropdown */}
        {formData.debit.account && (
          <div className="flex items-center">
            <label className="w-40 font-medium">Sub-Account</label>
            <select
              name="debit.sub_account"
              value={formData.debit.sub_account}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded outline-none"
            >
              <option value="">Select Sub Account</option>
              {accountList
                .find((acc) => acc._id === formData.debit.account)
                ?.subCat.filter(
                  (subAccount) => subAccount.account_nature === "Debit"
                )
                .map((subAccount) => (
                  <option key={subAccount._id} value={subAccount._id}>
                    {subAccount.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="flex items-center">
          <label className="w-40 font-medium">Debit Amount</label>
          <input
            type="number"
            name="debit.debit_amount"
            value={formData.debit.debit_amount}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
            required
          />
        </div>
        <h2 className="font-bold text-lg">Credit Entry</h2>
        <div className="flex items-center">
          <label className="w-40 font-medium">Account</label>
          <select
            name="credit.account"
            value={formData.credit.account}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
          >
            <option value="">Select Account</option>
            {accountList.map((account) => (
              <option key={account._id} value={account._id}>
                {account.acc_name} {/* Changed here to acc_name */}
              </option>
            ))}
          </select>
        </div>

        {/* Credit Sub-Account Dropdown */}
        {formData.credit.account && (
          <div className="flex items-center">
            <label className="w-40 font-medium">Sub-Account</label>
            <select
              name="credit.sub_account"
              value={formData.credit.sub_account}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded outline-none"
            >
              <option value="">Select Sub Account</option>
              {accountList
                .find((acc) => acc._id === formData.credit.account)
                ?.subCat.filter(
                  (subAccount) => subAccount.account_nature === "Credit"
                )
                .map((subAccount) => (
                  <option key={subAccount._id} value={subAccount._id}>
                    {subAccount.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="flex items-center">
          <label className="w-40 font-medium">Credit Amount</label>
          <input
            type="number"
            name="credit.credit_amount"
            value={formData.credit.credit_amount}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
            required
          />
        </div>
        <div className="flex items-center">
          <label className="w-40 font-medium">Memo</label>
          <input
            type="text"
            name="memo"
            value={formData.memo}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className={`bg-green-600 hover:bg-green-700 text-white mt-4 w-full px-4 py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Journal Voucher"}
          </button>
        </div>
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
        {/* Main Journal Voucher Details */}
        {voucherDetails && (
          <div className="overflow-x-auto mt-4" id="printArea">
            <div className="flex justify-between border-b items-center mb-4">
              <h2 className="text-xl font-semibold pb-3 flex-grow">
                Journal Voucher
              </h2>
              <img src={logo_light} alt="Software Logo" className="h-8" />
            </div>
            <div className="flex items-center justify-between">
              <h1 className="font-bold py-2">Voucher Details:</h1>
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
                    <strong className="font-semibold">Memo:</strong>
                  </td>
                  <td className="border text-right border-gray-300 px-4 py-2">
                    {voucherDetails.memo}
                  </td>
                </tr>

                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong className="font-semibold">Posted Date:</strong>
                  </td>
                  <td className="border text-right border-gray-300 px-4 py-2">
                    {new Date(voucherDetails.posted_date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </td>
                </tr>

                {/* Debit Section */}

                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong className="font-semibold">Debit Account:</strong>
                  </td>
                  <td className="border text-right border-gray-300 px-4 py-2">
                    {voucherDetails.debit.sub_account}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong className="font-semibold">Debit Amount:</strong>
                  </td>
                  <td className="border text-right text-green-600 border-gray-300 px-4 py-2">
                    PKR {voucherDetails.debit.debit_amount}
                  </td>
                </tr>

                {/* Credit Section */}

                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong className="font-semibold">Credit Account:</strong>
                  </td>
                  <td className="border text-right border-gray-300 px-4 py-2">
                    {voucherDetails.credit.sub_account}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <strong className="font-semibold">Credit Amount:</strong>
                  </td>
                  <td className="border text-right text-green-600 border-gray-300 px-4 py-2">
                    PKR {voucherDetails.credit.credit_amount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Footer with Buttons */}
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

export default JournalForm;
