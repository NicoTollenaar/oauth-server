import mongoose, { Schema } from "mongoose";

interface IResourceServer {
  resourceServerId: { type: String };
  hashedResourceServerSecret: {
    hash: string;
    salt: Buffer;
  };
}

const resourceServerSchema = new Schema<IResourceServer>({
  resourceServerId: { type: String, required: true, unique: true },
  hashedResourceServerSecret: {
    hash: { type: String, required: true },
    salt: { type: Buffer, required: true },
  },
});

const ResourceServer = mongoose.model<IResourceServer>(
  "ResourceServer",
  resourceServerSchema
);

export default ResourceServer;
