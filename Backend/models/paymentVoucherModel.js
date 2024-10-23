import mongoose from "mongoose";

const PaymentVoucherSchema = new mongoose.Schema(
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
    payment_method: {
      type: String,
      required: true,
    },
    cash_amount: {
      type: Number,
      validate: {
        validator: function (v) {
          return this.payment_method === "Cash" ? !!v : true; // Fix this logic
        },
        message: () => `Cash Amount is required for Cash payment method.`,
      },
    },
    cheque_number: {
      type: String,
      required: function () {
        return this.payment_method === "Cheque";
      },
      
    },
    bank_account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank_account",
      validate: {
        validator: function (v) {
          return this.payment_method === "Cheque" ||
            this.payment_method === "Bank Transfer"
            ? !!v
            : true; // Fix the logic here too
        },
        message: () => `Bank account is required for Cheque or Bank Transfer.`,
      },
    },
    transaction_number: {
      type: String,
      validate: {
        validator: function (v) {
          return this.payment_method === "Bank Transfer" ? !!v : true;
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

const PaymentVoucher = mongoose.model("Payment_voucher", PaymentVoucherSchema);
export default PaymentVoucher;
