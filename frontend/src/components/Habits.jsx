import { useEffect, useState } from "react";
import Layout from "./Layout.jsx";

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

const api = async (path = "", method = "GET", body) => {
  const res = await fetch(`/api/habits${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
    body: body && JSON.stringify(body),
  });
  if (res.status === 401) { localStorage.removeItem("token"); location.href = "/login"; }
  return res.status === 204 ? null : res.json();
};

export default function Habits() {
  const [habits, setHabits] = useState([]);
  useEffect(() => { api().then((h) => Array.isArray(h) && setHabits(h)); }, []);
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  const replace = (h) => setHabits((hs) => hs.map((x) => (x._id === h._id ? h : x)));

  const toggle = async (h, i) =>
    replace(await api(`/${h._id}`, "PUT", { done: h.done.map((d, j) => (j === i ? !d : d)) }));

  const [form, setForm] = useState(null); // null = fermé, sinon { habit?, name }

  const save = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (name) {
      if (form.habit) {
        replace(await api(`/${form.habit._id}`, "PUT", { name, frequency: form.frequency }));
      } else {
        const created = await api("", "POST", { name, frequency: form.frequency });
        setHabits((current) => [...current, created]);
      }
    }
    setForm(null);
  };

  const remove = async (h) => {
    await api(`/${h._id}`, "DELETE");
    setHabits((current) => current.filter((x) => x._id !== h._id));
    setForm(null);
  };

  return (
    <Layout>
      <section className="habits">
        <h1>Bienvenue sur Habit<span>Lab</span></h1>
        <h2>Aujourd’hui - {today}</h2>

        {habits.map((h) => (
          <article className="habit-card" key={h._id}>
            <div className="habit-info">
              <strong>{h.name}</strong>
              <span>{h.frequency}</span>
              <div className="habit-actions">
                <button
                  type="button"
                  onClick={() => setForm({
                    habit: h,
                    name: h.name,
                    frequency: h.frequency ?? "Quotidien",
                  })}
                >
                  Modifier
                </button>
                <button type="button" className="danger" onClick={() => remove(h)}>
                  Supprimer
                </button>
              </div>
            </div>
            <div className="habit-days">
              {DAYS.map((d, i) => (
                <button
                  type="button"
                  key={i}
                  className={`day ${h.done[i] ? "done" : "missed"}`}
                  aria-pressed={h.done[i]}
                  onClick={() => toggle(h, i)}
                >
                  {d}
                </button>
              ))}
            </div>
          </article>
        ))}

        {form ? (
          <form className="habit-form" onSubmit={save}>
            <div className="habit-form-heading">
              <h3>{form.habit ? "Modifier l’habitude" : "Créer une habitude"}</h3>
              <p>Choisis une habitude simple que tu veux intégrer à ta routine.</p>
            </div>

            <label className="habit-form-field">
              <span>Nom de l’habitude</span>
              <input
                autoFocus
                required
                maxLength={120}
                placeholder="Ex. Lire 10 minutes"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>

            <label className="habit-form-field">
              <span>Fréquence</span>
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              >
                <option value="Quotidien">Tous les jours</option>
                <option value="Hebdomadaire">Chaque semaine</option>
              </select>
            </label>

            <div className="habit-form-actions">
              <button className="habit-form-submit" type="submit">
                {form.habit ? "Enregistrer les changements" : "Ajouter l’habitude"}
              </button>
              <button className="habit-form-cancel" type="button" onClick={() => setForm(null)}>
                Annuler
              </button>
              {form.habit && (
                <button className="habit-form-delete" type="button" onClick={() => remove(form.habit)}>
                  Supprimer l’habitude
                </button>
              )}
            </div>
          </form>
        ) : (
          <button
            type="button"
            className="habit-add"
            onClick={() => setForm({ name: "", frequency: "Quotidien" })}
          >
            <span aria-hidden="true">+</span>
            Ajouter une habitude
          </button>
        )}
      </section>
    </Layout>
  );
}
