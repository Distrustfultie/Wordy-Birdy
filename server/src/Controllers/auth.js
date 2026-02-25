import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const exsistingUser = await User.findOne({ email });
    if (exsistingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use another email" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomPic = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomPic,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    // ✅ FIXED SECRET
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax", // ✅ important fix
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      user: newUser,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid email or password" });

    // ✅ FIXED SECRET
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      user,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const {
      fullName,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
    } = req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile onboarded successfully",
    });
  } catch (error) {
    console.log("Error in onboard controller", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}