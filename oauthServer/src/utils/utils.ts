import crypto from "crypto";

export default class Utils {
  static async hashPassword(password: string) {
    const salt = crypto.randomBytes(16);
    const hashedPassword = crypto.scryptSync(password, salt, 64).toString("hex");
    return hashedPassword;
  }
}
