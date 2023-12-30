import type { ObjectId } from "mongodb";

export type CurrentUser = {
  id: ObjectId;
};

// export interface QueryObject {
//   // [key: string]: string;
//   response_type: string;
//   scope: string;
//   client_id: string;
//   state: string;
//   redirect_uri: string;
//   code_challenge: string;
//   code_challenge_method: string;
// }
