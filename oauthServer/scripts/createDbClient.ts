require("../src/database/connectMongoDb");
import Client from "../src/database/models/Client.Model";
import Utils from "../src/utils/utils";
import "dotenv/config";

async function createDbClient() {
  const { hash, salt } = await Utils.hashStringWithSalt(
    process.env.CLIENT_SECRET as string
  );
  const dbClient = await Client.create({
    clientId: process.env.CLIENT_ID,
    hashedClientSecret: {
      _id: false,
      hash,
      salt,
    },
  });
}

createDbClient().then(() => process.exit(1));
