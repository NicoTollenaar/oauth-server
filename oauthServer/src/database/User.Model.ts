import mongoose from "mongoose";

interface IUser {
    email: string;
    password: string;
    authorizationCode?: string;
    accessToken?: string;
    idToken?: string;
}

const userSchema = new mongoose.Schema<IUser>({
    email: {type: String, required: true},
    password: {type: String, required: true},
    authorizationCode: String,
    accessToken: String,
    idToken: String,
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
