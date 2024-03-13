import mongoose, { Model, Schema, Types } from "mongoose";
import { scopes } from "../../types/customTypes";
import { truncate } from "fs";

export interface ICode extends Document {
  authorisationCode?: {
    identifier: string;
    expires: number;
  };
  pkceCodeChallenge: string;
  accessToken?: {
    identifier: string;
    revoked: boolean;
    expires: number;
  };
  refreshToken?: {
    identifier: string;
    revoked: boolean;
    expires: number;
  };
  idToken?: string;
  userId: Types.ObjectId;
  recipientClientId: string;
  redirectUri: string;
  requestedScope: string[];
}

export interface ICodeMethods {
  nullIfAccessToken(value: string): boolean;
  nullIfAuthorisationCode(value: string): boolean;
}

type CodeModel = Model<ICode, {}, ICodeMethods>;

const codeSchema: Schema = new Schema<ICode, CodeModel, ICodeMethods>({
  authorisationCode: {
    identifier: {
      type: String,
      unique: true,
      trim: true,
      validate: {
        validator: nullIfAccessToken,
        message: "authorization code cannot co-exist with accesstoken",
      },
    },
    expires: {
      type: Number,
      trim: true,
      required: function () {
        return !!this.authorisationCode?.identifier;
      },
    },
  },

  pkceCodeChallenge: { type: String, unique: true, trim: true },
  accessToken: {
    identifier: {
      type: String,
      trim: true,
      validate: {
        validator: nullIfAuthorisationCode,
        message: "access token cannot co-exist with authorization code",
      },
    },
    revoked: {
      type: Boolean,
      required: function () {
        return !!this.accessToken?.identifier;
      },
    },
    expires: {
      type: Number,
      trim: true,
      required: function () {
        return !!this.accessToken?.identifier;
      },
    }, //unix timestamp indicating when token will expire.
  },
  refreshToken: {
    identifier: {
      type: String,
      trim: true,
      unique: true,
      required: function () {
        return !!this.accessToken?.identifier;
      },
      validate: {
        validator: nullIfAuthorisationCode,
        message: "refresh token cannot co-exist with authorization code",
      },
    },
    revoked: {
      type: Boolean,
      required: function () {
        return !!this.accessToken?.identifier;
      },
    },
    expires: {
      type: Number,
      trim: true,
      required: function () {
        return !!this.accessToken?.identifier;
      },
    }, //unix timestamp indicating when token will expire.
  },
  idToken: { type: String, unique: true, trim: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  recipientClientId: {
    type: String,
    required: true,
    trim: true,
  },
  redirectUri: {
    type: String,
    required: true,
    trim: true,
  },
  requestedScope: [
    { type: String, required: true, unique: true, enum: scopes },
  ],
});

const Code = mongoose.model<ICode, CodeModel>("Code", codeSchema);

export default Code;

function nullIfAccessToken(this: ICode, authorisationCode: string) {
  return this.accessToken?.identifier ? !authorisationCode : true;
}

function nullIfAuthorisationCode(this: ICode, accessToken: string) {
  return this.authorisationCode?.identifier ? !accessToken : true;
}
