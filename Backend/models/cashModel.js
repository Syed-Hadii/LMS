import mongoose from "mongoose";

const CashSchema = new mongoose.Schema(
  {
    debit: {
      type: Number,
      default: undefined,
    },
    credit: {
      type: Number,
      default: undefined,
    },
    from: {
      acc_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chart_account",
        required: true,
      },
      sub_acc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chart_account",
      },
    },
  },
  { timestamps: true }
);
const Cash = mongoose.model("Cash", CashSchema);
export default Cash;
