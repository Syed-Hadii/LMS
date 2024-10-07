import mongoose from "mongoose";
import validator from "validator";
const recieveVocherSchema = new mongoose.Schema(
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
    reference: {
      type: String,
      required: true,
    },
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
    recieve_method: {
      type: String,
      required: true,
    },
    cash_amount: {
      type: Number,
      validate: {
        validator: function (v) {
          return this.recieve_method === "Cash" ? v && v.length > 0 : true;
        },
        message: (props) => `Cash Amount`,
      },
    },
    cheque_number: {
      type: String,
      required: function () {
        return this.recieve_method === "Cheque";
      },
    },
    bank_account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      validate: {
        validator: function (v) {
          return this.account_method === "Cheque" ||
            this.account_method === "Bank Transfer"
            ? v && v.length > 0
            : true;
        },
        message: (props) => `Bank Number`,
      },
    },
    transaction_number: {
      type: String,
      validate: {
        validator: function (v) {
          return this.recieve_method === "Bank Transfer"
            ? v && v.length > 0
            : true;
        },
        message: () =>
          `Transaction Number is required for Bank Transfer payment method.`,
      },
    },
    paid_amount: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
    },
  },
  { timestamps: true }
);
const recieveVoucher = mongoose.model("Recieve_voucher", recieveVocherSchema);
export default recieveVoucher;
