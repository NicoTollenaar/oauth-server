import { tokenEndpoint, resourcesEndpoint } from "@/app/constants/urls";
import {
  AccessTokenResponse,
  IAccessTokenIdentifier,
  OAuthError,
  TokenInfo,
} from "@/app/types/customTypes";
import { redirect_uri } from "@/app/constants/urls";
import PKCECode, { IPKCECode } from "../../../database/models/PKCECode";

export async function POST(req: Request): Promise<Response> {
  const queryString: string = await req.text();
  const searchParams: URLSearchParams = new URLSearchParams(queryString);
  const codeChallenge: string | null = searchParams.get("codeChallenge");
  const authorisationCode: string | null =
    searchParams.get("authorisationCode");
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
    const accessTokenResponse: AccessTokenResponse | OAuthError =
      await getAccessToken(authorisationCode, codeChallenge);
    if (!("access_token" in accessTokenResponse)) {
      console.log("Unsuccessful accessToken request");
      return accessTokenResponse as OAuthError;
    }
    const tokenInfo: TokenInfo = await retrieveResource(
      accessTokenResponse.access_token
    );
    if (!tokenInfo) throw new Error("calling retrieveResource failed");
    return tokenInfo;
  } catch (error) {
    console.log("In catch block getResource, logging error:", error);
    const oauthError: OAuthError = {
      error: "catch_error",
      error_description: `catch_error in getResource: ${error}`,
    };
    return oauthError;
  }
}

async function getAccessToken(
  authorisationCode: string,
  codeChallenge: string
): Promise<AccessTokenResponse | OAuthError> {
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
      code_verifier: dbPKCECode.codeVerifier,
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
    const tokenInfo: AccessTokenResponse | OAuthError = await response.json();
    if (response.ok) {
      return tokenInfo as AccessTokenResponse;
    } else {
      return tokenInfo as OAuthError;
    }
  } catch (error) {
    console.log("Error in catch block getAccessToken, error:", error);
    const oauthError: OAuthError = {
      error: "catch_error",
      error_description: `catch_error in getAccessToken: ${error}`,
    };
    return oauthError;
  }
}

async function retrieveResource(accessToken: string): Promise<TokenInfo> {
  try {
      const response = await fetch(resourcesEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_CLIENT_ID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`
            ).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(`token=${accessToken}`),
        });
        const tokenInfo: TokenInfo = await response.json();
        return tokenInfo;
      } catch (error) {
        console.log(
          "in catch block client api retrieveResource, logging error:",
          error
          );
          const oauthError: OAuthError = {
            error: "catch_error",
            error_description: "catch_error in retrieveResource",
          };
          return oauthError;
        }
      }
      