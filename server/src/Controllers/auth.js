import bcrypt from "bcryptjs";
import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

/**
 * Creates a new user and assigns a random profile picture.
 * The user's info is then added to Stream.
 * @param {Object} req - Express request object containing the user's info.
 * @param {Object} res - Express response object used to send back the appropriate response.
 * @returns {Promise<Object>} - A JSON response containing the created user and a success message.
 */
export async function signup(req, res) {
    const { email, password, fullName } = req.body;

    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const exsistingUser = await User.findOne({ email });
        if (exsistingUser) {
            return res.status(400).json({ message: "Email already exists, please use another email" });
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomPic = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomPic,
        })

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log("Error creating Stream user:", error);
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(201).json({ success: true, user: newUser, message: "User created successfully" });
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

/**
 * Logs a user in and assigns a JWT token to their session.
 * The user's info is then returned in the response.
 * @param {Object} req - Express request object containing the user's email and password.
 * @param {Object} res - Express response object used to send back the appropriate response.
 * @returns {Promise<Object>} - A JSON response containing the user's info and a success message.
 */
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "Invalid email or password" });

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({ success: true, user, message: "User logged in successfully" });
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

/**
 * Clears the JWT cookie and returns a success message.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} - A JSON response indicating the result of the logout operation.
 */
export function logout(req, res) {
    res.clearCookie("jwt")
    res.status(200).json({ success: true, message: "User logged out successfully" });
}

/**
 * Onboards a user by updating their profile with the provided information.
 * @param {Object} req - Express request object containing the user's ID and the fields to update.
 * @param {Object} res - Express response object used to send back the appropriate response.
 * @returns {Promise<Object>} - A JSON response containing the updated user and a success message.
 * @throws {Error} - If an error occurs during the execution of the controller, an error is thrown with a descriptive message.
 */
export async function onboard(req, res) {
    try {
        const usedId = req.user._id;

        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean)
            });
        }

        const updatedUser = await User.findByIdAndUpdate(usedId, {
            ...req.body,
            isOnboarded: true
        }, { new: true });

        if (!updatedUser)
            return res.status(404).json({ message: "User not found" });

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            });

            console.log(`Stream user updated for ${updatedUser.fullName}`);
        } catch (streamError) {
            console.log("Error updating Stream user during onboarding:", streamError.message);
        }

        res.status(200).json({
            message: "Profile onboarded successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log("Error in onboard controller", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });

    }
}
