import mongoose from "mongoose";

/**
 * Connects to the MongoDB database. If the connection fails, the process exits with a status code of 1.
 * @function connectDB
 * @returns {Promise<void>} - Resolves if the connection is successful, rejects if the connection fails.
 */
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
};
