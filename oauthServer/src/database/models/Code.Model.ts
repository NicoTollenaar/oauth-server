import mongoose, { Schema } from "mongoose";
import { scopes } from "../../types/customTypes";

export interface ICode {
  authorisationCode: { type: String };
  pkceCodeChallenge: { type: String };
  accessToken: { type: String };
  refreshToken: { type: String };
  idToken: { type: String };
  userId: { type: Schema.Types.ObjectId; ref: "User" };
  requestedScope: [{ type: String }];
}

const codeSchema = new Schema<ICode>({
  authorisationCode: { type: String || null, unique: true },
  pkceCodeChallenge: { type: String || null, unique: true },
  accessToken: { type: String || null, unique: true },
  refreshToken: { type: String || null, unique: true },
  idToken: { type: String || null, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  requestedScope: [
    { type: String, required: true, unique: true, enum: scopes },
  ],
});

const Code = mongoose.model<ICode>("Code", codeSchema);

export default Code;
