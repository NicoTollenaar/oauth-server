import { tokenEndpoint, resourcesEndpoint } from "@/app/constants/urls";
import {
  ActiveTokenInfo,
  IInActiveTokenInfo,
  OAuthError,
  TokenInfo,
} from "@/app/types/customTypes";

export async function POST(req: Request): Promise<Response> {
  const authorisationCode: string = await req.text();
  const resource: TokenInfo = await getResource(authorisationCode);
  const status: number = "error" in resource ? 401 : 200;
  return Response.json(resource, { status });
}

async function getResource(authorisationCode: string): Promise<TokenInfo> {
  try {
    const accessToken: string | null = await getAccessToken(authorisationCode);
    if (!accessToken) {
      console.log("Unsuccessful accessToken request");
      const oauthError: OAuthError = {
        error: "access token error",
        error_description: "Unsuccessful accessToken request",
      };
      return oauthError;
    }
    const tokenInfo: TokenInfo = await retrieveResource(accessToken);
    if (!tokenInfo) throw new Error("calling retrieveResource failed");
    return tokenInfo;
  } catch (error) {
    console.log("In catch block getResource, logging error");
    const oauthError: OAuthError = {
      error: "catch error",
      error_description: `Catch error in getResource: ${error}`,
    };
    return oauthError;
  }
}

async function getAccessToken(
  authorisationCode: string
): Promise<string | null> {
  const body = new URLSearchParams(`authorisationCode=${authorisationCode}`);
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
    if (response.ok) {
      const { accessTokenIdentifier }: { accessTokenIdentifier: string } =
        await response.json();
      return accessTokenIdentifier;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error in catch block getAccessToken, error:", error);
    return null;
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
