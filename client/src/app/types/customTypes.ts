export interface LoginFormData {
  email: string;
  password: string;
}
export interface QueryObject {
  response_type: string;
  scope: string;
  client_id: string;
  state: string;
  redirect_uri: string;
  code_challenge: string;
  code_challenge_method: string;
}

export interface ActiveTokenInfo {
  active: boolean;
  scope: string[];
  clientId: string;
  username: string;
}
export interface IInActiveTokenInfo {
  active: false;
}

export interface OAuthError {
  error: string;
  error_description: string;
}

export type TokenInfo = ActiveTokenInfo | IInActiveTokenInfo | OAuthError;

