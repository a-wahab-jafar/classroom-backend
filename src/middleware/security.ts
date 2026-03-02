import { Request ,Response, NextFunction } from "express";
import aj from "../config/arcjet";
import {slidingWindow} from "@arcjet/node";
const securityMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(process.env.NODE_ENV === "test") return next();


    try {
        const role: RateLimitRole = req.user?.role || "guest";

        let limit: number;
        let message: string;

        switch (role) {
            case "admin":
                limit = 20;
                message = "Admin rate limit exceeded(20 per minute)";
                break;
        case "teacher":
        case "student":
                limit = 10;
                message = "user request limit exceeded(10 per minute ).please wait";
                break;
            default:
                limit = 5;
                message = "Guest rate limit exceeded(5 per minute). Please sign up for higher limits.";
                break;
        }

        const client = aj.withRule(
            slidingWindow({
                mode: "LIVE",
                interval: '1m',
                max: limit,
            })
        )

        const arcjetRequest = {
            method: req.method,
            url: req.originalUrl ?? req.url,
            headers: req.headers,
            socket: { remoteAddress: req.socket.remoteAddress ?? req.ip ?? '0.0.0.0'},
        };
        const decision = await client.protect(arcjetRequest);
        if (decision.isDenied() && decision.reason.isBot()) {
            return res.status(429).json({ error: "forbidden", message: 'automated request are not allowed' });
        }
         if (decision.isDenied() && decision.reason.isShield()) {
            return res.status(429).json({ error: "forbidden", message: 'request blocked by security polocy' });
        }
         if (decision.isDenied() && decision.reason.isRateLimit()) {
            return res.status(429).json({ error: "rate limit exceeded", message });
        }
        next();
    } catch (e) {
        console.error("Security middleware error:", e);
        return res.status(500).json({ error: "Internal server error", message: "Something went wrong in the security middleware with security middleware" }); 
    }
}

export default securityMiddleware;