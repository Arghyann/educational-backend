import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {requested:1});
        if (decision.isDenied()) {
            if(decision.reason.isBot()) {
                // Handle bot detection
                console.log("Bot detected:", decision.bot);
                return res.status(403).send("Access denied for bots.");
            }
            if(decision.reason.isRateLimit()) {
                // Handle rate limiting
                console.log("Rate limit exceeded:", decision.rateLimit);
                return res.status(429).send("Too many requests. Please try again later.");
            }
            // Handle other types of denial
            return res.status(403).send("Access denied.");
        }
        next(); // Continue to the next middleware if the request is allowed
    } catch (error) {
        console.error("Arcjet middleware error:", error);
        return res.status(500).send("Internal Server Error");
        next(error); // Pass the error to the next middleware
    }
}
export default arcjetMiddleware;