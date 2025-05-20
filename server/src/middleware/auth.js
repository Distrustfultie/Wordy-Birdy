import jwt from "jsonwebtoken";
import User from "../Models/User.js";

/**
 * Verifies the JWT cookie and ensures the user is authenticated.
 * If the authentication is successful, the user is added to the request object and the next middleware is called.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 * @throws {Error} - If an error occurs during the execution of the middleware, an error is thrown with a descriptive message.
 */
export const protectRoute = async (req, res, next) => {
    
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized  - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};