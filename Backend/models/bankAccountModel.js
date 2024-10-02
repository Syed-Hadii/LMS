import mongoose from "mongoose";

const bankSchema = new mongoose.Schema({
  account_name: {
    type: String,
    requird: true,
  },
  type: {
    type: String,
    required: true,
  },
  bank_name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});
const Bank = mongoose.model("Bank_account", bankSchema);
export default Bank;
