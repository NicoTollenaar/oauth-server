const baseUrlClientFrontend = "http://localhost:3000/client-frontend";
const baseUrlClientBackend = "http://localhost:3000/client-backend";
const baseUrlOauthBackend = "http://localhost:4000/oauth-backend";
const baseUrlOauthFrontend = "http://localhost:3000/oauth-frontend";
const baseUrlResourceServer = "http://localhost:4000/resource-server";

export const redirect_uri = `${baseUrlClientFrontend}/get-resources`;

export const confirmOrLoginEndpoint = `${baseUrlOauthBackend}/confirm-or-login`;
export const loginEndpointOAuth = `${baseUrlOauthBackend}/login`;
export const loginEndpointClient = `${baseUrlClientBackend}/login`;
export const logoutOAuthEndpoint = `${baseUrlOauthBackend}/logout`;
export const logoutClientEndpoint = `${baseUrlClientBackend}/logout`;
export const authorisationEndpointFrontend = `${baseUrlOauthFrontend}/authorize`;
export const authorisationEndpointBackend = `${baseUrlOauthBackend}/authorize`;
export const tokenEndpoint = `${baseUrlOauthBackend}/oauth/token`;
export const loggedInStatusEndpointOAuth = `${baseUrlOauthBackend}/logged-in-status`;
export const loggedInStatusEndpointClient = `${baseUrlClientBackend}/logged-in-status`;

export const clientBackendGetResourcesEndpoint = `${baseUrlClientBackend}/get-resources`;
export const clientBackendPKCEEndpoint = `${baseUrlClientBackend}/pkce`;
export const resourcesEndpoint = `${baseUrlResourceServer}/get-resources`;
export const clientLoginUrl = `${baseUrlClientFrontend}/login-or-signin`;
