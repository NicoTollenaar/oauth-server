import {
  redirect_uri,
  tokenEndpoint,
  resourcesEndpoint,
} from "@/app/constants/urls";

export async function POST(req: Request) {
  const authorisationCode = await req.text();
  console.log(
    "in client backend post, logging authorisationCode:",
    authorisationCode
  );
  const retrievedResource = await getResource(authorisationCode);
  return Response.json({ retrievedResource, status: 200 });
}

async function getResource(authorisationCode: string) {
  try {
    const accessToken = await getAccessToken(authorisationCode);
    console.log("In getResource, logging accesstoken:", accessToken);
    if (!accessToken) {
      console.log("Unsuccessful accessToken request");
      return Response.json({
        error: "Unsuccessful accessToken request",
        status: 400,
      });
    }
    const retrievedResource = await retrieveResource(accessToken as string);
    return retrievedResource;
  } catch (error) {
    return Response.json({
      error: "error in catch block getResources",
      status: 400,
    });
  }
}

async function getAccessToken(authorisationCode: string) {
  const body = new URLSearchParams(`authorisationCode=${authorisationCode}`);
  console.log("in getAccesToken function, logging body:", body);
  console.log(
    "in getAccesToken function, logging tokenEndpoint:",
    tokenEndpoint
  );
  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    console.log(
      "in client backend post/get-resources, getAccessToken, logging response:",
      response
    );
    if (response.ok) {
      const responseJSON = await response.json();
      console.log("in getAccesToken function, logging responseJSON");
      const accessToken = responseJSON.accessToken;
      return accessToken;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error in catch block getAccessToken, error:", error);
    return Response.json({
      error: "Error in catch block getAccessToken",
      status: 400,
    });
  }
}

async function retrieveResource(accessToken: string) {
  try {
    const response = await fetch(resourcesEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(`accessToken=${accessToken}`),
    });
    if (response.ok) {
      const { retrievedResource } = await response.json();
      return retrievedResource;
    } else {
      console.log("Unsucessful resource request");
      return Response.json({
        error: "Resource request unsuccessful",
        status: 400,
      });
    }
  } catch (error) {
    console.log(
      "in catch block client api retrieveResource, logging error:",
      error
    );
  }
}
