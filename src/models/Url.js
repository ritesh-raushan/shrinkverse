import mongoose from 'mongoose';

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
        ref: 'User',
        required: false, // Made optional for guest users
    },
    expiresAt: {
        type: Date,
        required: false, // Only set for guest users
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const UrlModel = (mongoose.models.Url) || mongoose.model('Url', UrlSchema); 
export default UrlModel;