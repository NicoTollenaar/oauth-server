const baseUrlClientFrontend = "http://localhost:3000/client-frontend";
export const baseUrlOauthBackend = "http://localhost:4000/oauth-backend";
const baseUrlOauthFrontend = "http://localhost:3000/oauth-frontend";
export const baseUrlResourceServer = "http://localhost:4000/resource-server";

export const redirect_uri = `${baseUrlClientFrontend}/get-resources`;

export const loggedInStatusEndpoint = `${baseUrlOauthBackend}/logged-in-status`;
export const loginEndpoint = `${baseUrlOauthBackend}/login`;
export const authorisationEndpointFrontend = `${baseUrlOauthFrontend}/authorize`;
export const authorisationEndpointBackend = `${baseUrlOauthBackend}/authorize`;
export const tokenEndpoint = `${baseUrlOauthBackend}/oauth/token`;
export const introspectionEndpoint = `${baseUrlOauthBackend}/token_info`;
export const revocationEndpoint = `${baseUrlOauthBackend}/revocation`;
export const registrationEndpoint = `${baseUrlOauthBackend}/registration`;
export const metaDataEndpoint = `${baseUrlOauthBackend}/.well-known/oauth-authorization-server`;
export const jwks_uri = `${baseUrlOauthBackend}/jwks`;

export const resourcesEndpoint = `${baseUrlResourceServer}/get-resources`;
