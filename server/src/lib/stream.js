import {StreamChat} from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("Stream API Key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);


/**
 * Upserts a user in Stream.
 * @param {Object} userData - The user's data containing the id, name, and image.
 * @returns {Promise<Object>} - The upserted user if successful, null otherwise.
 */
export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers ([userData]);
        return userData
    } catch (error) {
        console.error("Error upserting Stream user:", error);
        
    }
};


/**
 * Generates a Stream token for the user identified by the given userId.
 * @param {String} userId - The user's ID as a string.
 * @returns {String} - The generated token if successful, null otherwise.
 */
export const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
};