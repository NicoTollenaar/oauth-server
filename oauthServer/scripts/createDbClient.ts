require("../src/database/connectMongoDb");
import Client from "../src/database/models/Client.Model";
import Utils from "../src/utils/utils";
import "dotenv/config";

async function createDbClient() {
  console.log(
    "in script createDbClient, logging process.env.CLIENT_SECRET:",
    process.env.CLIENT_SECRET
  );
  console.log(
    "in script createDbClient, logging process.env.CLIENT_ID:",
    process.env.CLIENT_ID
  );

  const { hash, salt } = await Utils.hashString(
    process.env.CLIENT_SECRET as string
  );
  console.log("in script createDbClient, logging hash, salt:", hash, salt);
  const dbClient = await Client.create({
    clientId: process.env.CLIENT_ID,
    hashedClientSecret: {
      _id: false,
      hash,
      salt,
    },
  });
  console.log("in script createDbClient, logging dbClient:", dbClient);
}

createDbClient().then(() => process.exit(1));
