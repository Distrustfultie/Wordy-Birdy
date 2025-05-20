import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    bio: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        required: true,
        default: "",
    }, 
    nativeLanguage: {
        type: String,
        default: "",
    },
    learningLanguage: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    friends: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        }
    ]   
}, { timestamps: true });

UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch (error) {
        next(error);
    }
});

/**
 * Compares the given password to the user's stored password.
 * @param {String} enteredPassword - The password to compare.
 * @returns {Promise<Boolean>} - True if the passwords match, false otherwise.
 */
UserSchema.methods.matchPassword = async function(enteredPassword) {
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect;
}

const User = mongoose.model("User", UserSchema);

export default User;    