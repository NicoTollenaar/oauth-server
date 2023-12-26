import mongoose, { Schema } from "mongoose";

interface IClient {
  clientId: { type: String };
  hashedClientSecret: { type: String };
}

const clientSchema = new Schema<IClient>({
  clientId: { type: String },
  hashedClientSecret: { type: String },
});

const Client = mongoose.model<IClient>("Client", clientSchema);

export default Client;
