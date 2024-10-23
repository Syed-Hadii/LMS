import mongoose from "mongoose";

const subAccountSchema = new mongoose.Schema({
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chart_account",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0, // Opening amount
    min: 0, // Prevent negative opening amount
  },
  balance: {
    type: Number,
    default: 0, // Ensure default balance is 0
  },
});

// Main Chart Account Schema
const ChartAccountSchema = new mongoose.Schema({
  acc_name: {
    type: String,
    required: true,
  },
  account_nature: {
    // Account nature for the head of account
    type: String,
    enum: ["Asset", "Liability", "Income", "Expense"], // Example account types
    required: true,
  },
  total_credit_amount: {
    type: Number,
    default: 0,
  },
  total_debit_amount: {
    type: Number,
    default: 0,
  },
  subCat: {
    type: [subAccountSchema],
    default: undefined,
  },
});

// Pre-save hook to calculate total credit and debit amounts
ChartAccountSchema.pre("save", function (next) {
  let totalCredit = 0;
  let totalDebit = 0;

  if (this.subCat && this.subCat.length > 0) {
    this.subCat.forEach((subAccount) => {
      const effectiveBalance = subAccount.balance;

      // Accumulate totals based on account nature
      if (
        this.account_nature === "Income" ||
        this.account_nature === "Liability"
      ) {
        totalCredit += effectiveBalance; // For Income and Liabilities, we credit
      } else {
        totalDebit += effectiveBalance; // For Expenses and Assets, we debit
      }
    });
  }

  this.total_credit_amount = totalCredit;
  this.total_debit_amount = totalDebit;
  next();
});

const ChartAccount = mongoose.model("Chart_account", ChartAccountSchema);
export default ChartAccount;
