import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
const token = req.header("Authorization")?.replace("Bearer", "");

  console.log("recieved token", token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.Id);
    if (!user) {
      return res.status(401).json({ message: "User Not Found." });
    }
    res.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Invalid token" });
  }
};
export default verifyToken;
