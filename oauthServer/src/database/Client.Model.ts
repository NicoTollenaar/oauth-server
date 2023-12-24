import mongoose, { Schema } from "mongoose";

interface IClient {
  clientId: { type: String };
  hashedClientSecret: { type: String };
}

const clientSchema = new Schema<IClient>({
  clientId: { type: String },
  hashedClientSecret: { type: String },
});

const Code = mongoose.model<IClient>("Client", clientSchema);

export default Code;
