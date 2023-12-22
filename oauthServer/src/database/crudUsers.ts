import mongoose from "mongoose";
import User from "./User.Model";

export default async function crud() {
  const newUser = new User({
    email: "email@poppypop.com",
    password: "new users password",
  });
  try {
    // await mongoose.connect("mongodb://localhost:27017/newDb")
    const dbResult = await newUser.save();
    console.log("dbResult", dbResult);
  } catch (error) {
    console.log(error);
  }
}
