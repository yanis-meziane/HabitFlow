import { invalidInput } from "../errors.js";
import { assertBody, assertNoIdentity, isRealDate } from "./common.js";

export const FREQUENCIES = ["daily", "weekly"];
const PATCHABLE = ["title", "frequency", "active", "color"];

const rules = {
    title: (v) => typeof v === "string" && v.trim().length >= 1 && v.trim().length <= 120 && v.trim(),
    frequency: (v) => FREQUENCIES.includes(v) && v,
    active: (v) => typeof v === "boolean" && { value: v },
    color: (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) && v,
};

// retourne la valeur nettoyée, ou lève 400 (false/"" = invalide ; { value } sert pour le booléen false)
function clean(field, raw) {
    const out = rules[field](raw);
    if (out === false || out === "") throw invalidInput(`Champ invalide : ${field}`);
    return out?.value ?? out;
}

export function validateCreate(body) {
    assertBody(body);
    assertNoIdentity(body);
    for (const required of ["title", "frequency", "active"]) {
        if (!(required in body)) throw invalidInput(`Champ requis : ${required}`);
    }
    const data = {};
    for (const f of PATCHABLE) if (f in body) data[f] = clean(f, body[f]);
    return data;
}

export function validatePatch(body) {
    assertBody(body);
    assertNoIdentity(body);
    const keys = Object.keys(body);
    if (keys.length === 0) throw invalidInput("Corps vide");
    const unknown = keys.find((k) => !PATCHABLE.includes(k));
    if (unknown) throw invalidInput(`Champ inconnu : ${unknown}`);
    return Object.fromEntries(keys.map((k) => [k, clean(k, body[k])]));
}

export function validateToggle(body) {
    assertBody(body);
    if (!isRealDate(body.date)) throw invalidInput("Date invalide (YYYY-MM-DD)");
    return body.date;
}
