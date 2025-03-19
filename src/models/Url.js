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
        required: false,
        default: function() {
            // Set expiration to 15 days from creation for guest users
            return this.userId ? null : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const UrlModel = (mongoose.models.Url) || mongoose.model('Url', UrlSchema); 
export default UrlModel;