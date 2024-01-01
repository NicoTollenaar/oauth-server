import "dotenv/config";
require("../database/connectMongoDb"); // establish connection with MongoDb
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoClientPromise from "../database/connectMongoDb";
import cors from "cors";
import oauthServerRoutes from "./routes/oauthServerRoutes";
import resourceServerRoutes from "./routes/resourceServerRoutes";

const app = express();
const port = 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    cookie: { maxAge: 600000 },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ clientPromise: mongoClientPromise }),
  })
);

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/oauth-backend", oauthServerRoutes);
app.use("/resource-server", resourceServerRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
