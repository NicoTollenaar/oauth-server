import mongoose, { Schema } from "mongoose";

interface ICode {
  authorisationCode: { type: String };
  accessToken: { type: String };
  idToken: { type: String };
  userId: { type: Schema.Types.ObjectId; ref: "User" };
}

const codeSchema = new Schema<ICode>({
  authorisationCode: { type: String },
  accessToken: { type: String },
  idToken: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Code = mongoose.model<ICode>("Code", codeSchema);

export default Code;
