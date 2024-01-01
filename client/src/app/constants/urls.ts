const baseUrlClient = "http://localhost:3000/client-frontend";
const baseUrlOauthBackend = "http://localhost:4000/oauth-backend";
const baseUrlOauthFrontend = "http://localhost:3000/oauth-frontend";
const baseUrlResourceServer = "http://localhost:4000/resource-server";

export const redirect_uri = `${baseUrlClient}/get-resources`;

export const confirmOrLoginEndpoint = `${baseUrlOauthBackend}/confirm-or-login`;
export const loginEndpoint = `${baseUrlOauthBackend}/login`;
export const authorisationEndpointFrontend = `${baseUrlOauthFrontend}/authorize`;
export const authorisationEndpointBackend = `${baseUrlOauthBackend}/authorize`;
export const tokenEndpoint = `${baseUrlOauthBackend}/oauth/token`;
export const loggedInStatusEndpoint = `${baseUrlOauthBackend}/logged-in-status`;

export const resourcesEndpoint = `${baseUrlResourceServer}/get-resources`;
