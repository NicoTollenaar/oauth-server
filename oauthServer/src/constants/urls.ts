const baseUrlClient = "http://localhost:3000";
const baseUrlOauthServer = "http://localhost:4000/oauth-server";

export const redirect_uri=`${baseUrlClient}/get-resources`;
export const authorisationEndpoint = `${baseUrlOauthServer}/authorize`;
export const tokenEndpoint = `${baseUrlOauthServer}/oauth/token`;