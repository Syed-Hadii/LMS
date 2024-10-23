import mongoose from "mongoose";

const bankSchema = new mongoose.Schema({
  account_name: {
    type: String,
    required: true,
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

  total_balance: {
    type: Number,
    required: true,
  },
});

// Pre-save middleware to initialize total_balance with amount
bankSchema.pre("save", function (next) {
  if (this.isNew) {
    this.total_balance = this.amount; // Set total_balance = amount when a new document is created
  }
  next();
});

const Bank = mongoose.model("Bank_account", bankSchema);
export default Bank;
