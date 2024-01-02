import mongoose, { Schema } from "mongoose";

export interface ICode {
  authorisationCode: { type: String };
  pkceCodeChallenge: { type: String };
  accessToken: { type: String };
  refreshToken: { type: String };
  idToken: { type: String };
  userId: { type: Schema.Types.ObjectId; ref: "User" };
}

const codeSchema = new Schema<ICode>({
  authorisationCode: { type: String || null, unique: true },
  pkceCodeChallenge: { type: String || null, unique: true },
  accessToken: { type: String || null, unique: true},
  refreshToken: { type: String || null, unique: true },
  idToken: { type: String || null, unique: true},
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Code = mongoose.model<ICode>("Code", codeSchema);

export default Code;
