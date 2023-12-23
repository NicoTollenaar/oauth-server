import mongoose from "mongoose";

export interface IUser {
  firstName: { type: String; required: true };
  lastName: { type: String; required: true };
  email: { type: String; required: true };
  hashedPassword: { type: String; required: true; unique: true };
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  hashedPassword: { type: String, required: true, unique: true },
});

export const User = mongoose.model<IUser>("User", userSchema);