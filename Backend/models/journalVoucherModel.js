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

    debit: {
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chart_account",
        required: true,
      },
      sub_account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chart_account",
        required: true,
      },

      debit_amount: {
        type: Number,
      },
    },
    credit: {
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chart_account",
        required: true,
      },
      sub_account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chart_account",
        required: true,
      },

      credit_amount: {
        type: Number,
      },
    },

    memo: {
      type: String,
    },
  },
  { timestamps: true }
);
const JournalVoucher = mongoose.model("Journal_voucher", JournalVocherSchema);
export default JournalVoucher;
