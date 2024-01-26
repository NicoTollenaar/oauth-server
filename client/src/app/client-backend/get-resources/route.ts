import { tokenEndpoint, resourcesEndpoint } from "@/app/constants/urls";
import {
  IAccessTokenIdentifier,
  OAuthError,
  TokenInfo,
} from "@/app/types/customTypes";
import { redirect_uri } from "@/app/constants/urls";
import PKCECode, { IPKCECode } from "../../../database/models/PKCECode";

// need to connect to MongoDb
// see: https://jasonwatmore.com/next-js-13-app-router-mongodb-user-rego-and-login-tutorial-with-example

export async function POST(req: Request): Promise<Response> {
  console.log("In POST, logging req.body:", req.body);
  const queryString: string = await req.text();
  console.log("In POST, logging queryString:", queryString);
  const searchParams: URLSearchParams = new URLSearchParams(queryString);
  const codeChallenge: string | null = searchParams.get("codeChallenge");
  const authorisationCode: string | null =
    searchParams.get("authorisationCode");
  console.log("In POST, logging codeChallenge:", codeChallenge);
  console.log("In POST, logging authorisationCode:", authorisationCode);
  let resource: TokenInfo;
  if (codeChallenge && authorisationCode) {
    resource = await getResource(authorisationCode, codeChallenge);
  } else {
    resource = {
      error: "invalid queryParameters",
      error_description: "authorisationCode or codeChallenge null or undefined",
    };
  }
  const status: number = "error" in resource ? 401 : 200;
  return Response.json(resource, { status });
}

async function getResource(
  authorisationCode: string,
  codeChallenge: string
): Promise<TokenInfo> {
  try {
    const accessToken: string | OAuthError = await getAccessToken(
      authorisationCode,
      codeChallenge
    );
    if (typeof accessToken !== "string") {
      console.log("Unsuccessful accessToken request");
      const oauthError: OAuthError = accessToken;
      return oauthError;
    }
    const tokenInfo: TokenInfo = await retrieveResource(accessToken);
    if (!tokenInfo) throw new Error("calling retrieveResource failed");
    return tokenInfo;
  } catch (error) {
    console.log("In catch block getResource, logging error:", error);
    const oauthError: OAuthError = {
      error: "catch error",
      error_description: `Catch error in getResource: ${error}`,
    };
    return oauthError;
  }
}

async function getAccessToken(
  authorisationCode: string,
  codeChallenge: string
): Promise<string | OAuthError> {
  try {
    const dbPKCECode: IPKCECode | null = await PKCECode.findOne({
      codeChallenge,
    });
    if (!dbPKCECode) throw new Error("PKCECode not found");
    const body = new URLSearchParams({
      code: authorisationCode,
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      redirect_uri,
      code_verifier: dbPKCECode.codeVerifier, //still todo
    });
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    const { deletedCount } = await PKCECode.deleteOne({ codeChallenge });
    if (!deletedCount) throw new Error("deletion PKCECode failed");
    const tokenInfo: IAccessTokenIdentifier | OAuthError =
      await response.json();
    if (response.ok) {
      const { accessTokenIdentifier }: IAccessTokenIdentifier =
        tokenInfo as IAccessTokenIdentifier;
      return accessTokenIdentifier;
    } else {
      const oauthError: OAuthError = tokenInfo as OAuthError;
      return oauthError;
    }
  } catch (error) {
    console.log("Error in catch block getAccessToken, error:", error);
    const oauthError: OAuthError = {
      error: "Catch error",
      error_description: `Catch error in getAccessToken: ${error}`,
    };
    return oauthError;
  }
}

async function retrieveResource(
  accessTokenIdentifier: string
): Promise<TokenInfo> {
  try {
    const response = await fetch(resourcesEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(`token=${accessTokenIdentifier}`),
    });
    const tokenInfo: TokenInfo = await response.json();
    return tokenInfo;
  } catch (error) {
    console.log(
      "in catch block client api retrieveResource, logging error:",
      error
    );
    const oauthError: OAuthError = {
      error: "catch error",
      error_description: "Catch error in retrieveResource",
    };
    return oauthError;
  }
}
