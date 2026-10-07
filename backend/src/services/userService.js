import { User } from '../models/User.js';
import { notFound } from '../errors.js';

export async function getUser(userId) {
    const user = await User.findById(userId);
    if (!user) throw notFound('Utilisateur introuvable');
    return { id: String(user._id), email: user.email };
}