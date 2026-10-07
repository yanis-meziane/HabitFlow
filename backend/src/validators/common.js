import { invalidInput } from "../errors.js";

export const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

// ObjectId sérialisé : 24 caractères hexadécimaux
export const assertObjectId = (id) => {
    if (!/^[0-9a-f]{24}$/i.test(id)) throw invalidInput("Identifiant malformé");
};

// date civile réelle "YYYY-MM-DD" (refuse 2026-02-30)
export const isRealDate = (s) => {
    if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(`${s}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
};

export const assertBody = (body) => {
    if (!isPlainObject(body)) throw invalidInput("Corps JSON requis");
};

// le client ne choisit jamais id / ownerId
export const assertNoIdentity = (body) => {
    for (const k of ["id", "_id", "ownerId"]) {
        if (k in body) throw invalidInput(`Champ interdit : ${k}`);
    }
};
