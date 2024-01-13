import {
  redirect_uri,
  tokenEndpoint,
  resourcesEndpoint,
} from "@/app/constants/urls";

export async function POST(req: Request) {
  const authorisationCode = await req.text();
  const response = await getResource(authorisationCode);
  return Response.json(response);
}

async function getResource(authorisationCode: string) {
  try {
    const accessToken = await getAccessToken(authorisationCode);
    if (!accessToken) {
      console.log("Unsuccessful accessToken request");
      return {
        error: "access token error",
        error_description: "Unsuccessful accessToken request",
      };
    }
    const response = await retrieveResource(accessToken as string);
    return response;
  } catch (error) {
    return {
      error: "catch error",
      error_description: "error in catch block getResources",
    };
  }
}

async function getAccessToken(authorisationCode: string) {
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
      const { accessTokenIdentifier } = await response.json();
      return accessTokenIdentifier;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error in catch block getAccessToken, error:", error);
    return null;
  }
}

async function retrieveResource(accessTokenIdentifier: string) {
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
    const responseObject = await response.json();
    return responseObject;
  } catch (error) {
    console.log(
      "in catch block client api retrieveResource, logging error:",
      error
    );
    return {
      responseOk: false,
      responseContent: { error: "Resource request unsuccessful", status: 400 },
    };
  }
}
