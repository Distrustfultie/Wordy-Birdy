import { generateStreamToken } from "../lib/stream.js";

/**
 * Generates a Stream token for the authenticated user.
 * @param {Object} req - Express request object containing the authenticated user.
 * @param {Object} res - Express response object used to send back the appropriate response.
 * @returns {Promise<Object>} - A JSON response containing the generated token.
 * @throws {Error} - If an error occurs during the execution of the controller, an error is thrown with a descriptive message.
 */
export async function getStreamToken (req, res) {
    try {
        const token = generateStreamToken(req.user.id);

        res.status(200).json({ token});
    } catch (error) {
        console.error("Error in getStraemToken controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}