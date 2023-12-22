import { NextFunction, Request, Response } from "express";
// import { Session } from "express-session";

// import type { Response } from "express";
export default async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        res.redirect(`http://localhost:3000/get-resources`);
    } else {
        next();
    }
}