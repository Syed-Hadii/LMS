import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    requird: true,
  },
  unit: {
    type: String,
    required: true,
  },
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  pkg_qty: {
    type: Number,
    required: true,
  },
  pkg_amount: {
    type: Number,
    required: true,
  }
});
const Item = mongoose.model("Item", ItemSchema);
export default Item;
