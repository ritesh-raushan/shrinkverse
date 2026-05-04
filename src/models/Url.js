import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true,
    },
    alias: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // Made optional for guest users
    },
    expiresAt: {
        type: Date,
        required: false,
        default: null,
    },
    clicks: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// MongoDB auto-delete documents whose `expiresAt` has passed.
// `expireAfterSeconds: 0` means: remove as soon as `expiresAt < now`.
UrlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Fast lookup of a user's links sorted by recency (used by /links page).
UrlSchema.index({ userId: 1, createdAt: -1 });

const UrlModel = mongoose.models.Url || mongoose.model("Url", UrlSchema);
export default UrlModel;
