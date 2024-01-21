import { tokenEndpoint, resourcesEndpoint } from "@/app/constants/urls";
import {
  ActiveTokenInfo,
  IAccessTokenIdentifier,
  OAuthError,
  TokenInfo,
} from "@/app/types/customTypes";
import { redirect_uri } from "@/app/constants/urls";
import TypePredicament from "@/app/utils/predicamentFunctions";

export async function POST(req: Request): Promise<Response> {
  const authorisationCode: string = await req.text();
  const resource: TokenInfo = await getResource(authorisationCode);
  const status: number = "error" in resource ? 401 : 200;
  return Response.json(resource, { status });
}

async function getResource(authorisationCode: string): Promise<TokenInfo> {
  try {
    const accessToken: string | OAuthError = await getAccessToken(
      authorisationCode
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
  authorisationCode: string
): Promise<string | OAuthError> {
  const body = new URLSearchParams({
    code: authorisationCode,
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID as string,
    redirect_uri,
    code_verifier: "", //still todo
  });
  try {
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
