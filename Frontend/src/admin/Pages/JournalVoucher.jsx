import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JournalVoucher = () => {
  // Changed component name
  const url = "http://localhost:3002";
  const [accountList, setAccountList] = useState([]);
  const [subAccounts, setSubAccounts] = useState([]);
  const [bankAccount, setBankAccount] = useState("");
  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    voucher_no: "",
    posted_date: new Date().toLocaleDateString("en-US"),
    date: "",
    account: "",
    sub_account: "",
    memo: "", // Changed from desc to memo
    debit: "", // Added debit field
    credit: "", // Added credit field
    bank_account: "", // Keep for bank account selection
  });

  const resetForm = () => {
    setFormData({
      voucher_no: "",
      posted_date: new Date().toLocaleDateString("en-US"),
      date: "",
      account: "",
      sub_account: "",
      memo: "",
      debit: "",
      credit: "",
      bank_account: "",
    });
  };

  const fetchBank = async () => {
    try {
      const response = await axios.get(`${url}/bank/get`);
      setBankList(response.data.data);
    } catch (error) {
      console.log("Error fetching bank records:", error);
    }
  };

  const fetchAccount = async () => {
    try {
      const response = await axios.get(`${url}/chartaccount/get`);
      setAccountList(response.data.data);
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

   // Check if at least one of the fields (account or bank_account) is filled
   if (!formData.account && !bankAccount) {
     toast.error("Please select at least one account or bank account.");
     setLoading(false);
     return;
   }

   const submissionData = {
     voucher_no: formData.voucher_no,
     posted_date: formData.posted_date,
     date: formData.date,
     account: formData.account,
     sub_account: formData.sub_account,
     memo: formData.memo,
     debit: formData.debit,
     credit: formData.credit,
     bank_account: bankAccount,
   };

   try {
     const response = await axios.post(
       `${url}/journalvoucher/add`, // Ensure this is the correct endpoint
       submissionData
     );
     if (response.data.success) {
       toast.success("Journal Voucher Created Successfully!");
       resetForm();
     } else {
       toast.error("Error creating journal voucher");
     }
   } catch (error) {
     console.error(error);
     toast.error("Try Again");
   } finally {
     setLoading(false); // Reset loading state
   }
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
      <h1 className="text-xl mb-5 font-semibold text-left">Journal Voucher</h1>
      <hr className="border-gray-300 border-1.5 p-4" />
      <form className="space-y-4 text-gray-700" onSubmit={handleSubmit}>
        {/* Voucher No */}
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

        {/* Posted Date */}
        <div className="flex items-center">
          <label className="w-40 font-medium">Posted Date</label>
          <input
            type="text"
            value={formData.posted_date}
            className="w-full px-4 py-2 border rounded outline-none bg-gray-100"
            readOnly
          />
        </div>

        {/* Date */}
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

        <div className="flex items-center">
          <label className="w-40 font-medium">Chart of Account</label>
          <select
            name="account"
            value={formData.account}
            onChange={(e) => {
              handleInputChange(e);
              const selectedAccountId = e.target.value;
              if (selectedAccountId) {
                const selectedAccount = accountList.find(
                  (account) => account._id === selectedAccountId
                );
                setSubAccounts(selectedAccount.subCat || []);
              } else {
                setSubAccounts([]);
              }
            }}
            className="w-full px-4 py-2 border rounded outline-none"
         
          >
            <option value="">Select Account</option>
            {accountList.map((account) => (
              <option key={account._id} value={account._id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        {/* Conditionally render Sub-Account Dropdown if an account is selected */}
        {formData.account && subAccounts.length > 0 && (
          <div className="flex items-center">
            <label className="w-40 font-medium">Sub-Account</label>
            <select
              name="sub_account"
              value={formData.sub_account}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded outline-none"
            >
              <option value="">Select Sub Account</option>
              {subAccounts.map((subAccount) => (
                <option key={subAccount._id} value={subAccount._id}>
                  {subAccount.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Bank Account Dropdown */}
        <div className="flex items-center">
          <label className="w-40 font-medium">Bank Account</label>
          <select
            name="bank_account"
            value={bankAccount}
            onChange={(e) => {
              setBankAccount(e.target.value);
              handleInputChange(e);
            }}
            className="w-full px-4 py-2 border rounded outline-none"
            
          >
            <option value="">Select Bank Account</option>
            {bankList.map((account) => (
              <option key={account._id} value={account._id}>
                {account.account_name}
              </option>
            ))}
          </select>
        </div>

        {/* Debit Amount */}
        <div className="flex items-center">
          <label className="w-40 font-medium">Debit Amount</label>
          <input
            type="number"
            name="debit"
            value={formData.debit}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
            required
          />
        </div>

        {/* Credit Amount */}
        <div className="flex items-center">
          <label className="w-40 font-medium">Credit Amount</label>
          <input
            type="number"
            name="credit"
            value={formData.credit}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
            required
          />
        </div>

        {/* Memo */}
        <div className="flex items-center">
          <label className="w-40 font-medium">Memo</label>
          <input
            type="text"
            name="memo"
            value={formData.memo}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
            placeholder="Enter Memo"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-green-500 hover:bg-green-600 text-white mt-4 w-full px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Journal Voucher"}
        </button>
      </form>
    </div>
  );
};

export default JournalVoucher; // Updated export
