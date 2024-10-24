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
    default: 0, 
    min: 0, 
  },
  balance: {
    type: Number,
    default: 0, 
  },
});

// Main Chart Account Schema
const ChartAccountSchema = new mongoose.Schema({
  acc_name: {
    type: String,
    required: true,
  },
  account_nature: {

    type: String,
    enum: ["Debit", "Credit"], 
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

      if (this.account_nature === "Credit") {
        totalCredit += effectiveBalance; // Credit accounts increase totalCredit
      } else if (this.account_nature === "Debit") {
        totalDebit += effectiveBalance; // Debit accounts increase totalDebit
      }
    });
  }

  this.total_credit_amount = totalCredit;
  this.total_debit_amount = totalDebit;
  next();
});


const ChartAccount = mongoose.model("Chart_account", ChartAccountSchema);
export default ChartAccount;
