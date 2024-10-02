import mongoose from "mongoose";
const LandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
});
const Land = mongoose.model("Land", LandSchema);
export default Land;
