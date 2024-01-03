import mongoose from "mongoose";
import { scopes, IUser } from "../../types/customTypes";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    oauthConsents: [
      {
        clientId: { type: String, required: true },
        consentedScope: [
          { type: String, required: true, unique: true, enum: scopes },
        ],
        date: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
