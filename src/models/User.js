import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
        trim: true,
    },
    emailVerified: {
        type: Date,
        default: null,
    },
    provider: {
        type: String,
        enum: ["credentials", "google"],
        default: "credentials",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export default UserModel;
