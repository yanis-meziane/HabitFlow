import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/env.js';
import { emailAlreadyUsed, unauthorized } from '../errors.js';
import { validateCredentials } from '../validators/authValidator.js';

function toAuthResponse(user) {
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '7d' });
    return { user: { id: String(user._id), email: user.email }, token };
}

export async function register(body) {
    const { email, password } = validateCredentials(body, { checkPasswordLength: true });
    if (await User.exists({ email })) throw emailAlreadyUsed();
    const passwordHash = await bcrypt.hash(password, 10);
    try {
        return toAuthResponse(await User.create({ email, passwordHash }));
    } catch (err) {
        if (err.code === 11000) throw emailAlreadyUsed(); // deux inscriptions simultanées
        throw err;
    }
}

export async function login(body) {
    const { email, password } = validateCredentials(body, { checkPasswordLength: false });
    const user = await User.findOne({ email }).select('+passwordHash');
    // même réponse pour email inconnu et mauvais mot de passe
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw unauthorized('Identifiants invalides');
    }
    return toAuthResponse(user);
}
