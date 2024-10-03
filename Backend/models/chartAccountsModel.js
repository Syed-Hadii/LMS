import mongoose from "mongoose";

const ChartAccountSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subCat: {
    type: [
      {
        parent_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Chart_account",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    default: undefined,
  },
});
const ChartAccount = mongoose.model("Chart_account", ChartAccountSchema);
export default ChartAccount;
