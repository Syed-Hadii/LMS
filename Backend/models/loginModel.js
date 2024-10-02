import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, Requird: true },
  email: { type: String, Requird: true, unique: true },
  password: { type: String, Requird: true },
});

const User = mongoose.model("User", userSchema);

export default User;
