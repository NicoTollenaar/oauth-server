import crypto from "crypto";
import { userIdAndScopeEndpoint } from "../constants/urls";

export default class Utils {
  static async hashPassword(password: string) {
    const salt = crypto.randomBytes(16);
    const hashedPassword = crypto
      .scryptSync(password, salt, 64)
      .toString("hex");
    return hashedPassword;
  }

  static async getUserIdAndRequestedScope(accessToken: string) {
    try {
      const response = await fetch(userIdAndScopeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });
      if (response.ok) {
        const { userId, requestedScope } = await response.json();
        return { userId, requestedScope };
      } else {
        return null;
      }
    } catch (error) {
      console.log(
        "In catch block getUserIdAndRequestedScope, logging error:",
        error
      );
      return null;
    }
  }
}
