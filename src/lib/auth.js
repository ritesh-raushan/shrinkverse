import jwt from 'jsonwebtoken';

export async function verifyAuth(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        return decoded.userId;
    } catch (error) {
        throw new Error('Invalid token');
    }
}