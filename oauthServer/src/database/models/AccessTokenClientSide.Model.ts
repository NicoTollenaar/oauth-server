import mongoose, { Model, Schema, Types } from "mongoose";
import { scopes } from "../../types/customTypes";
import { truncate } from "fs";

export interface IAccessToken extends Document {
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
  scope: string[];
}

const accessTokenSchema: Schema = new Schema<IAccessToken>({
  accessToken: {
    identifier: {
      type: String,
      trim: true,
      unique: true,
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
    scope: [
      { type: String, required: true, unique: true, enum: scopes },
    ],
  },
  refreshToken: {
    identifier: {
      type: String,
      trim: true,
      unique: true,
    },
    revoked: {
      type: Boolean,
      required: function () {
        return !!this.refreshToken?.identifier;
      },
    },
    expires: {
      type: Number,
      trim: true,
      required: function () {
        return !!this.refreshToken?.identifier;
      },
    }, //unix timestamp indicating when token will expire.
  },
});

const AccessToken = mongoose.model<IAccessToken>(
  "AccessToken",
  accessTokenSchema
);

export default AccessToken;
