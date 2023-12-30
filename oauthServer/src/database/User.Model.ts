import mongoose from "mongoose";
import { Scope, IUser } from "../types/express/customTypes";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    oauthConsents: [
      {
        clientId: { type: String, required: true },
        scope: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
