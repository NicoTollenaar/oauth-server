const baseUrlClient = "http://localhost:3000";
const baseUrlOauthServer = "http://localhost:4000/oauth-server-backend";
const baseUrlOauthFrontend= "http://localhost:3000/oauth-server-frontend";
const baseUrlResourceServer = "http://localhost:4000/resource-server";

export const redirect_uri=`${baseUrlClient}/get-resources`;

export const confirmOrLoginEndpoint = `${baseUrlOauthServer}/confirm-or-login`;
export const loginEndpoint = `${baseUrlOauthServer}/login`;
export const authorisationEndpointFrontend = `${baseUrlOauthFrontend}/authorize`;
export const authorisationEndpointBackend = `${baseUrlOauthServer}/authorize`;
export const tokenEndpoint = `${baseUrlOauthServer}/oauth/token`;
export const confirmEndpoint = `${baseUrlOauthServer}/confirm`;
export const loggedInStatusEndpoint = `${baseUrlOauthServer}/is-logged-in`;

export const resourcesEndpoint = `${baseUrlResourceServer}/get-resources`;

