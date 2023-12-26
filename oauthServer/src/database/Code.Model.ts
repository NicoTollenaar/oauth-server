import mongoose, { Schema } from "mongoose";

interface ICode {
  authorisationCode: { type: String };
  pkceCodeChallenge: { type: String };
  accessToken: { type: String };
  refreshToken: { type: String };
  idToken: { type: String };
  userId: { type: Schema.Types.ObjectId; ref: "User" };
}

const codeSchema = new Schema<ICode>({
  authorisationCode: { type: String || null },
  pkceCodeChallenge: { type: String || null },
  accessToken: { type: String || null },
  refreshToken: { type: String || null },
  idToken: { type: String || null },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Code = mongoose.model<ICode>("Code", codeSchema);

export default Code;
