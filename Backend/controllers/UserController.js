import User from "../models/UserModel.js";
import Role from "../models/roleModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "2h" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
const save_user = async (req, resp) => {
  const { full_name, role, password, email, phone } = req.body;
  try {
    const check = await User.findOne({ email });
    if (check) {
      return resp.json({ success: false, message: "User already exists" });
    }
    if (!validator.isEmail(email)) {
      return resp.json({ success: false, message: "Plese check your email" });
    }
    if (password.length < 8) {
      return resp.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userAdd = new User({
      full_name,
      role,
      email,
      phone,
      password: hashedPassword,
    });

    const user = await userAdd.save();
    resp.json({ success: true, message: "User Inserted" });
  } catch (error) {
    console.log(error);
    resp.json({ success: false, message: "Error" });
  }
};
const listUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error: " + error);
    res.status(500).json({ success: false, message: "Some Thing Wents Wrong" });
  }
};
const save_role = async (req, resp) => {
  let role = new Role(req.body);
  let result = await role.save();
  resp.json({ success: true, message: "Role Inserted" });
}
const getRole = async (req, res) => {
  try {
    const role = await Role.find();
    res.json(role);
  } 
  catch (error) {
    console.log(error);

  }
  
}
const delete_role = async (req, res) => {
  const check_role = await User.findOne({ role: req.body.id });
  if (check_role) {
    return res.json({ success: false, message: "Role Is Already In User" });
  } else {
    const result = await Role.deleteOne({ id: req.body.role });
    return res.json({ success: true, message: "Role is delted" });
  }
};
const update_role = async (req, res) => {
  try {
    const roleId = req.body.id;
    const updatedData = req.body;

    const updatedRole = await Role.findByIdAndUpdate(roleId, updatedData, {
      new: true,
    });
    return res.json({ success: true, message: "Role is Updated" });
  } catch (error) {
    console.error("Error updating role:", error);
    res.json({ success: false, message: "Server error", error });
  }
};
const delete_user = async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.body.id });
    return res.json({ success: true, message: "User is deleted" });
  } catch (error) {
    console.error("Error Deleting User:", error);
    res.json({ success: false, message: "Server error", error });
  }
};
const update_user = async (req, res) => {
  try {
    const userId = req.body.id;
    const updatedData = req.body;

    const updatedRole = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    return res.json({ success: true, message: "User is Updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.json({ success: false, message: "Server error", error });
  }
};

export {loginUser, save_user, listUsers, delete_user, update_user ,save_role, getRole, delete_role, update_role };
