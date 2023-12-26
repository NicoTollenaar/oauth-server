import { NextResponse } from "next/server";

import { redirect_uri, authorisationEndpoint, tokenEndpoint } from "@/app/constants/urls";


export async function POST(request: Request) {
  const authorisationCode = await request.text();
  const retrievedResource = await getResource(authorisationCode);
  return Response.json({ retrievedResource, status: 200 });
}

async function getResource(authorisationCode: string) {
  const accessToken = await getAccessToken(authorisationCode);
  if (!accessToken) {
    console.log("Unsuccessful accessToken request");
    return Response.json({
      error: "Unsuccessful accessToken request",
      status: 500,
    });
  }
  const retrievedResource = await retrieveResource(accessToken as string);
  return retrievedResource;
}

async function getAccessToken(authorisationCode: string) {
  const body = `code=${authorisationCode}`;
  const response = await fetch("http://localhost:4000/oauth-server/oauth/token", {
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
    return Response.json({
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
