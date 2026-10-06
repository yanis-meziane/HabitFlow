import { User } from '../models/User.js';

export async function getUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw Object.assign(new Error('Utilisateur introuvable'), { status: 404 });
    }
    return user;
}