import mongoose, { mongo } from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://Management:FFW6OxZXeA75sK3R@cluster0.mbsfy.mongodb.net/"
    )
    .then(() => console.log("Database Connected"));
};
