const baseUrlClient = "http://localhost:3000";
const baseUrlOauthServer = "http://localhost:4000/oauth-server-backend";
const baseUrlResourceServer = "http://localhost:4000/resource-server";


export const redirect_uri=`${baseUrlClient}/get-resources`;
export const authorisationEndpoint = `${baseUrlOauthServer}/authorize`;
export const tokenEndpoint = `${baseUrlOauthServer}/oauth/token`;
export const resourcesEndpoint= `${baseUrlResourceServer}/get-resources`;