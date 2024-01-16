import mongoose, { Schema } from "mongoose";
import { scopes } from "../../types/customTypes";

export interface ICode {
  authorisationCode: { type: String };
  pkceCodeChallenge: { type: String };
  accessToken: {
    identifier: { type: String };
    revoked: boolean;
    expires: number;
  };
  refreshToken: { type: String };
  idToken: { type: String };
  userId: Schema.Types.ObjectId;
  recipientClientId: string;
  redirectUri: string;
  requestedScope: string[];
}

const codeSchema = new Schema<ICode>({
  authorisationCode: { type: String || null, unique: true },
  pkceCodeChallenge: { type: String || null, unique: true },
  accessToken: {
    identifier: { type: String, required: true },
    revoked: { type: Boolean, required: true },
    expires: { type: Number, required: true }, //unix timestamp indicating when token will expire.
  },
  refreshToken: { type: String || null, unique: true },
  idToken: { type: String || null, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  recipientClientId: { type: String, required: true},
  redirectUri: {type: String, required: true},
  requestedScope: [
    { type: String, required: true, unique: true, enum: scopes },
  ],
});

const Code = mongoose.model<ICode>("Code", codeSchema);

export default Code;
