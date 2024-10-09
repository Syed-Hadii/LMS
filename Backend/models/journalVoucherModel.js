import mongoose from "mongoose";
const JournalVocherSchema = new mongoose.Schema(
  {
    voucher_no: {
      type: Number,
      required: true,
    },
    posted_date: {
      type: Date,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
   
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chart_account",
    },
    sub_account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chart_account",
      required: true,
    },
    bank_account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank_account",
    },

    debit_amount: {
      type: Number,
    },
    credit_amount: {
      type: Number,
    },
    memo: {
      type: String,
    },
  },
  { timestamps: true }
);
const JournalVoucher = mongoose.model("Journal_voucher", JournalVocherSchema);
export default JournalVoucher;
