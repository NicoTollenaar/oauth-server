require("../src/database/connectMongoDb");
import ResourceServer from "../src/database/models/ResourceServer.Model";
import Utils from "../src/utils/utils";
import "dotenv/config";

async function createDbResourceServer() {
  const resoureServerId = process.env.RESOURCE_SERVER_ID;
  const resourceServerSecret = process.env.RESOURCE_SERVER_SECRET;
  const { hash, salt } = await Utils.hashString(resourceServerSecret as string);
  const dbResourceServer = await ResourceServer.create({
    resourceServerId: resoureServerId,
    hashedResourceServerSecret: {
      _id: false,
      hash,
      salt,
    },
  });
  console.log("in script createDbClient, logging dbClient:", dbResourceServer);
}

createDbResourceServer().then(() => process.exit(1));
