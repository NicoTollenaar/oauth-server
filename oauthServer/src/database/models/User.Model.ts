import mongoose from "mongoose";
import { scopes, IUser } from "../../types/customTypes";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: {
      hash: { type: String, required: true },
      salt: {type: Buffer, required: true}
    },
    oauthConsents: [
      {
        _id: false, // no ObjectId on subdocuments, otherwise addToSet does not work
        clientId: { type: String, required: true },
        consentedScope: [
          { type: String, required: true, unique: true, enum: scopes },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
