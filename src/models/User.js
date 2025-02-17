import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        enum: ['credentials', 'google'],
        default: 'credentials'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const UserModel = (mongoose.models.User) || mongoose.model('User', UserSchema); 
export default UserModel;