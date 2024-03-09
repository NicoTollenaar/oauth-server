import jwt, { Jwt, JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import crypto, { AsymmetricKeyDetails } from "crypto";
import fs from "fs";

console.log(jwt);

const curves = crypto.getCurves();

// console.log("curves:", curves);

const keyPair = crypto.generateKeyPairSync("ec", { namedCurve: "prime256v1" });

console.log("keyPair", keyPair);
console.log("privateKey", keyPair.privateKey);
console.log("publicKey", keyPair.publicKey);

const keyDetails: AsymmetricKeyDetails | undefined =
  keyPair.privateKey.asymmetricKeyDetails;
const keyType: string | undefined = keyPair.privateKey.asymmetricKeyType;
const exportedPrivateKey: string | Buffer = keyPair.privateKey.export({
  type: "sec1",
  format: "pem",
});

fs.writeFileSync(
  "../src/constants/oauthServerPrivateKey.pem",
  exportedPrivateKey,
  "utf-8"
);

const exportedPublicKey: string | Buffer = keyPair.publicKey.export({
  type: "spki",
  format: "pem",
});

fs.writeFileSync(
  "../src/constants/oauthServerPublicKey.pem",
  exportedPublicKey,
  "utf-8"
);

const type: string = keyPair.privateKey.type;

console.log("keyDetails", keyDetails);
console.log("keyType", keyType);
console.log("exportedPrivateKey", exportedPrivateKey);
console.log("exportedPublicKey", exportedPublicKey);
console.log("type", type);

const payload = {
  client_id: "clientId_to_be_inserted",
  scope: "openid email profile",
};

const options: SignOptions = {
  algorithm: "ES256",
  expiresIn: 60,
  header: { typ: "at+jwt", alg: "ES256" },
  audience: "http://localhost:3000/resource-server",
  issuer: "www.authserver.com",
  jwtid: crypto.randomUUID(),
  subject: "userId",
  keyid: "some Keyid",
};

const token: string = jwt.sign(payload, keyPair.privateKey, options);

const validationOptions: VerifyOptions = {
  complete: true,
  audience: "http://localhost:3000/resource-server",
  issuer: "www.authserver.com",
  subject: "userId",
};

const decoded: string | JwtPayload = jwt.verify(
  token,
  exportedPublicKey,
  validationOptions
);

console.log("token:", token);
console.log("decoded:", decoded);

const jwtArray = token.split(".");

console.log("jwtArray", jwtArray);

const decodedWithoutSig = Buffer.from(jwtArray[0], "base64url").toString();

console.log("decodedWithoutSig", decodedWithoutSig);

const parsedHeader = JSON.parse(decodedWithoutSig);

console.log("parsedHeader", parsedHeader);

const decodedWLibrary = jwt.decode(token, {complete: true});

console.log("decodedWLibrary", decodedWLibrary);
