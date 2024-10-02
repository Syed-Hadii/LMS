import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

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
    res.json({success:true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
const regUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {

        const exists = await User.findOne({ email })
        if (exists) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Invalid email"
            })
        }
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters long"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            name,
            email,
            password: hashedPassword
            })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true, token })
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
};
const getCurrentUser = async (req, res) => {
    try {

const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({success:false, message:"user not found"})
        }
        res.json({success:true, user})
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
        
    }
};
export { loginUser, regUser, getCurrentUser };
