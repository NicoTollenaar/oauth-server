import { JWK } from "../types/customTypes";

export const ACCESS_TOKEN_LIFETIME = 60; // 60 seconds

export const PRE_EXISTING_PUBLIC_KEYS_OAUTH_SERVER: JWK[] = [
  {
    kty: "EC",
    crv: "P-256",
    x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
    y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
    use: "enc",
    kid: "1",
  },
  {
    kty: "RSA",
    n: "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuh",
    e: "AQAB",
    alg: "RS256",
    kid: "2011-04-29",
  },
];

export const ID_PUBLIC_KEY_USED_FOR_SIGNING: string = crypto.randomUUID();
export const ID_PRIVATE_KEY_USED_FOR_SIGNING: string = crypto.randomUUID();
