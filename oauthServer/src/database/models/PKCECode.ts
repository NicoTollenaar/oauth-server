import mongoose, { Model, Schema, Types } from "mongoose";
import crypto from "crypto";

export interface IPKCECode extends Document {
  codeVerifier: string;
  codeChallenge: string;
}

const PKCECodeSchema: Schema = new Schema<IPKCECode>({
  codeVerifier: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 44,
    maxlength: 128,
  },
  codeChallenge: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: isProperlyHashedAndEncoded,
      message: "codeVerifier not properly hashed or encoded",
    },
  },
});

const PKCECode = mongoose.model<IPKCECode>("PKCECode", PKCECodeSchema);

function isProperlyHashedAndEncoded(
  this: IPKCECode,
  codeChallenge: string
): boolean {
  const correctCodeChallenge = crypto
    .createHash("sha256")
    .update(this.codeVerifier)
    .digest("base64url");
  return codeChallenge === correctCodeChallenge;
}

export default PKCECode;
