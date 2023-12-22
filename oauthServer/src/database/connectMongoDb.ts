import "dotenv/config";
import mongoose from "mongoose";
const dbName = "OauthDb";
const passwordAtlasCluster = process.env.MONGO_ATLAS_CLUSTER_TESTOAUTH_PASSWORD;
const connectionStringLocalhost = `mongodb://localhost:27017/newDb`;
const connectionStringAtlas = `mongodb+srv://nicotollenaar:${passwordAtlasCluster}@cluster0.ucpql1z.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const usedConnectionString = connectionStringLocalhost;
// const usedConnectionString = connectionStringAtlas;

async function main() {
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });
  process.on("SIGINT", () => {
    mongoose.connection.close();
    process.exit(0);
  });
  try {
    // const options = { dbName: "OauthDb" };
    const db = await mongoose.connect(usedConnectionString /*, options*/);
    console.log("connected to MongoDB, database:", db.connections[0].name);
    const clientPromise: any = db.connection.getClient(); // type "any" bad improvised solution, revisit later
    return clientPromise;
  } catch (error) {
    console.log("in catch block of mongoDb connection, logging error:", error);
  }
}

const mongoClientPromise = main()
  .then((clientPromise) => clientPromise)
  .catch((err) => console.log(err));

export default mongoClientPromise;
