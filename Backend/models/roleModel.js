import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role: { type: String, required: true },
});

const Role = mongoose.model("Role", roleSchema);
export default Role;