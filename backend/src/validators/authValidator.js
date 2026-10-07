import { invalidInput } from "../errors.js";
import { assertBody } from "./common.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCredentials(body, { checkPasswordLength }) {
    assertBody(body);
    const { email, password } = body;
    if (typeof email !== "string" || !EMAIL.test(email.trim())) throw invalidInput("Email invalide");
    if (typeof password !== "string" || !password) throw invalidInput("Mot de passe requis");
    if (checkPasswordLength && password.length < 8) throw invalidInput("Mot de passe : 8 caractères minimum");
    return { email: email.trim().toLowerCase(), password };
}
