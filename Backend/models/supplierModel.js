import mongoose from "mongoose";
const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
});
const Supplier = mongoose.model("Supplier", SupplierSchema);
export default Supplier;
