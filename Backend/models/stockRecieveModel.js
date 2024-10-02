import mongoose from "mongoose";
import validator from "validator";
const StockrecieveSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    stock: [
      {
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        stock_recieved: {
          type: Number,
          required: true,
        },
        stock_amount: {
          type: Number,
          required: true,
        },
        payment_method: {
          type: String,
          required: true,
        },
        bank_name: {
          type: String,
          validate: {
            validator: function (v) {
              return this.payment_method === "bank" ? v && v.length > 0 : true;
            },
            message: (props) =>
              `Bank number is required when payment method is bank!`,
          },
        },
      },
    ],
  },
  { timestamps: true }
);
const Stockrecieve = mongoose.model("Stock_recieve", StockrecieveSchema);
export default Stockrecieve;
