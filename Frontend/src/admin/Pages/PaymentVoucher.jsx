import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentForm = () => {
  const url = "http://localhost:3002";
  const [accountList, setAccountList] = useState([]);
  const [subAccounts, setSubAccounts] = useState([]);
  const [postedDateChecked, setPostedDateChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [bankAccount, setBankAccount] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(false);
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
   setLoading(true); // Set loading state

   const submissionData = {
     voucher_no: formData.voucher_no,
     date: formData.date,
     reference: formData.reference,
     account: formData.account,
     sub_account: formData.sub_account,
     payment_method: paymentMethod,
     paid_amount: formData.paid_amount,
     desc: formData.desc,
     ...(postedDateChecked && { posted_date: formData.posted_date }),
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
       resetForm();
     } else {
       toast.error("Error creating payment voucher");
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
      <h1 className="text-xl mb-5 font-semibold text-left">Payment Voucher</h1>
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

        {/* Reference */}
        <div className="flex items-center">
          <label className="w-40 font-medium">Reference</label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
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
                // Filter and set the subAccounts based on selected account
                const selectedAccount = accountList.find(
                  (account) => account._id === selectedAccountId
                );
                setSubAccounts(selectedAccount.subCat || []);
              } else {
                setSubAccounts([]); // Clear subAccounts when no account is selected
              }
            }}
            className="w-full px-4 py-2 border rounded outline-none"
            required
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

        {/* Payment Method Dropdown */}
        <div className="flex items-center">
          <label className="w-40 font-medium">Payment Method</label>
          <select
            name="payment_method"
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              handleInputChange(e);
            }}
            className="w-full px-4 py-2 border rounded"
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
                required
              >
                <option value="">Select Bank Account</option>
                {bankList.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.account_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="w-40 font-medium">Transaction Number</label>
              <input
                type="text"
                name="transaction_number"
                value={transactionNumber}
                onChange={(e) => {
                  setTransactionNumber(e.target.value);
                  handleInputChange(e);
                }}
                className="w-full px-4 py-2 border rounded outline-none"
                placeholder="Enter Transaction Number"
                required
              />
            </div>
          </>
        )}

        {paymentMethod === "Cheque" && (
          <>
            <div className="flex items-center">
              <label className="w-40 font-medium">Cheque Number</label>
              <input
                type="text"
                name="cheque_number"
                value={chequeNumber}
                onChange={(e) => {
                  setChequeNumber(e.target.value);
                  handleInputChange(e);
                }}
                className="w-full px-4 py-2 border rounded outline-none"
                placeholder="Enter Cheque Number"
                required
              />
            </div>

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
                required
              >
                <option value="">Select Bank Account</option>
                {bankList.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.account_name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Paid Amount */}
        <div className="flex items-center">
          <label className="w-40 font-medium">Paid Amount</label>
          <input
            type="number"
            name="paid_amount"
            value={formData.paid_amount}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
            required
          />
        </div>

        {/* desc */}
        <div className="flex items-center">
          <label className="w-40 font-medium">desc</label>
          <input
            type="text"
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none"
            placeholder="Enter desc"
          />
        </div>

        {/* Posted Date Checkbox */}
        <div className="flex items-center">
          <label className="w-40 font-medium">Posted Date</label>
          <input
            type="checkbox"
            checked={postedDateChecked}
            onChange={() => setPostedDateChecked(!postedDateChecked)}
            className="w-4 h-4"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
