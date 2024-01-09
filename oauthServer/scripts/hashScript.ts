import crypto from "crypto";
import Utils from "../src/utils/utils";

const password = "some string to hash";
const salt = "<Buffer bd 81 cf d0 80 30 c7 c1 ca 9f ba 7d cf 0f 4b 1e>";

function hashPassword(password: string) {
  // const salt = crypto.randomBytes(16);
  console.log("salt:", salt);
  const hashedPassword = crypto.scryptSync(password, salt, 64).toString("hex");
  console.log("hashedPassword:", hashedPassword);
  return hashedPassword;
}

hashPassword(password);
