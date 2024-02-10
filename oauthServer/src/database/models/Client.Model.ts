import mongoose, { Schema } from "mongoose";

interface IClient {
  clientId: { type: String };
  hashedClientSecret: {
    hash: string;
    salt: Buffer;
  };
  redirect_uri: string[];
}

const clientSchema = new Schema<IClient>({
  clientId: { type: String, required: true, unique: true },
  hashedClientSecret: {
    hash: { type: String, required: true },
    salt: { type: Buffer, required: true },
  },
  redirect_uri: { type: [String], required: true, trim: true },
});

const Client = mongoose.model<IClient>("Client", clientSchema);

export default Client;
