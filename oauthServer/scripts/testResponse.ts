import "dotenv/config";

async function testResponse() {
  try {
    const response: any = await fetch(
      "http://localhost:4000/oauth-backend/test",
      {
        headers: {
          Authorization: "its me!",
        },
      }
    );
    console.log("In TRY, logging REPONSE:", response);
    console.log("In TRY, logging REPONSE.OK:", response.ok);
    const bodyObject = await response.json();
    console.log("In TRY, logging BODYOBJECT:", bodyObject);
  } catch (error) {
    console.log("In CATCH, logging ERROR:", error);
  }
}

testResponse().then(() => process.exit(1));
