import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/env.js';

function httpError(status, message) {
    return Object.assign(new Error(message), { status });
}

export async function register({ email, password } = {}) {
    if (!email || !password) {
        throw httpError(400, 'Email et mot de passe requis');
    }
    if (await User.exists({ email })) {
        throw httpError(409, 'Email déjà utilisé');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    return { _id: user._id, email: user.email };
}

export async function login({ email, password } = {}) {
    if (!email || !password) {
        throw httpError(400, 'Email et mot de passe requis');
    }
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw httpError(401, 'Identifiants invalides');
    }
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '7d' });
    return { token };
}