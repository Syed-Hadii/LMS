import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    requird: true,
  },
});
const StoreRoom = mongoose.model("Store", storeSchema);
export default StoreRoom;
