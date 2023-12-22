import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const body = await request.text();
  const retrievedResource = await getResource(body);
  return Response.json({ retrievedResource, status: 200 });
}

async function getResource(code: string) {
  const accessToken = await getAccessToken(code);
  if (!accessToken) {
    console.log("Unsuccessful accessToken request");
    return NextResponse.json({
      error: "Unsuccessful accessToken request",
      status: 500,
    });
  }
  const retrievedResource = await retrieveResource(accessToken as string);
  return retrievedResource;
}

async function getAccessToken(code: string) {
  const body = `code=${code}`;
  const response = await fetch("http://localhost:4000/oauth-server/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const accessToken = await response.text();
  if (accessToken) {
    return accessToken;
  } else {
    console.log("Unsucessful accessToken request");
    return NextResponse.json({
      error: "Unsucessful accessToken request",
      status: 500,
    });
  }
}

async function retrieveResource(accessToken: string) {
  try {
    const response = await fetch(
      "http://localhost:4000/resource-server/get-resources",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `accessToken=${accessToken}`,
      }
    );
    if (response.ok) {
      const retrievedResource = await response.text();
      if (retrievedResource) {
        return retrievedResource;
      } else {
        console.log("Unsucessful resource request");
        return Response.json({
          error: "Resource request unsuccessful",
          status: 500,
        });
      }
    } else {
      throw new Error("api request to resource server faild");
    }
  } catch (error) {
    console.log(
      "in catch block client api retrieveResource, logging error:",
      error
    );
  }
}
