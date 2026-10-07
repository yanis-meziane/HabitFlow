// Erreur applicative sérialisée par le gestionnaire d'erreurs : {"error":{"code","message"}}
export class ApiError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

export const invalidInput = (message) => new ApiError(400, "INVALID_INPUT", message);
export const unauthorized = (message = "Authentification requise") => new ApiError(401, "UNAUTHORIZED", message);
export const notFound = (message = "Ressource introuvable") => new ApiError(404, "NOT_FOUND", message);
export const emailAlreadyUsed = () => new ApiError(409, "EMAIL_ALREADY_USED", "Email déjà utilisé");
