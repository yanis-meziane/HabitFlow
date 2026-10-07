import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { connectDb, disconnectDb } from "../src/config/db.js";
import { config } from "../src/config/env.js";

const habit = { title: "Marcher", frequency: "daily", active: true };

async function register(email) {
    const res = await request(app).post("/api/auth/register").send({ email, password: "MotDePasse123!" });
    return res.body.token;
}
const auth = (token) => ({ Authorization: `Bearer ${token}` });

beforeAll(async () => {
    await connectDb(config.mongoUri);
    await mongoose.connection.dropDatabase(); // fixtures déterministes (base *_test uniquement)
});
afterAll(disconnectDb);

test("CRUD nominal : créer, lister, lire, modifier, supprimer", async () => {
    const token = await register("crud@example.test");

    const created = await request(app).post("/api/habits").set(auth(token)).send(habit);
    expect(created.status).toBe(201);
    const { id } = created.body;
    expect(typeof id).toBe("string");

    const list = await request(app).get("/api/habits").set(auth(token));
    expect(list.status).toBe(200);
    expect(list.body.items.map((h) => h.id)).toEqual([id]);

    const one = await request(app).get(`/api/habits/${id}`).set(auth(token));
    expect(one.status).toBe(200);

    const patched = await request(app).patch(`/api/habits/${id}`).set(auth(token)).send({ active: false });
    expect(patched.status).toBe(200);
    expect(patched.body.active).toBe(false);

    const deleted = await request(app).delete(`/api/habits/${id}`).set(auth(token));
    expect(deleted.status).toBe(204);
    const gone = await request(app).get(`/api/habits/${id}`).set(auth(token));
    expect(gone.status).toBe(404);
});

test("donnée invalide : frequency hors énumération -> 400 INVALID_INPUT", async () => {
    const token = await register("invalid@example.test");
    const res = await request(app).post("/api/habits").set(auth(token)).send({ ...habit, frequency: "hourly" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_INPUT");
});

test("sans JWT -> 401 UNAUTHORIZED", async () => {
    const res = await request(app).get("/api/habits");
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
});

test("isolation : B ne peut ni lire ni modifier ni supprimer un objet de A", async () => {
    const tokenA = await register("a@example.test");
    const tokenB = await register("b@example.test");
    const { body } = await request(app).post("/api/habits").set(auth(tokenA)).send(habit);
    const url = `/api/habits/${body.id}`;

    const list = await request(app).get("/api/habits").set(auth(tokenB));
    expect(list.body.items).toEqual([]);
    expect((await request(app).get(url).set(auth(tokenB))).status).toBe(404);
    expect((await request(app).patch(url).set(auth(tokenB)).send({ title: "piraté" })).status).toBe(404);
    expect((await request(app).delete(url).set(auth(tokenB))).status).toBe(404);

    // l'objet de A est intact
    const still = await request(app).get(url).set(auth(tokenA));
    expect(still.body.title).toBe("Marcher");
});
