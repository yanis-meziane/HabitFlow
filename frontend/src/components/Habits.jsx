import { useState } from "react";
import Layout from "./Layout.jsx";
import { COLORS, dateKey, streak, useHabits } from "../habits.js";

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

// les 7 jours (lundi → dimanche) de la semaine en cours
function currentWeek() {
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function Habits() {
  const { habits, toggle, create, update, remove } = useHabits();
  const [form, setForm] = useState(null); // null = fermé, sinon { habit?, name, frequency, color }

  const now = new Date();
  const todayKey = dateKey(now);
  const week = currentWeek();
  const today = now.toLocaleDateString("fr-FR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
  const doneToday = habits.filter((h) => h.completions.includes(todayKey)).length;
  const percent = habits.length ? Math.round((doneToday / habits.length) * 100) : 0;

  const save = async (e) => {
    e.preventDefault();
    const { habit, ...data } = form;
    data.name = data.name.trim();
    if (data.name) await (habit ? update(habit, data) : create(data));
    setForm(null);
  };

  const del = async (h) => {
    await remove(h);
    setForm(null);
  };

  return (
    <Layout>
      <section className="habits">
        <h1>Bienvenue sur Habit<span>Lab</span></h1>
        <h2>Aujourd’hui - {today}</h2>

        {habits.length > 0 && (
          <div className="progress" aria-label={`${doneToday} habitudes sur ${habits.length} faites aujourd’hui`}>
            <div className="progress-text">
              <strong>{doneToday}/{habits.length}</strong> faites aujourd’hui
              {percent === 100 && " 🎉 Journée parfaite !"}
            </div>
            <div className="progress-bar"><div style={{ width: `${percent}%` }} /></div>
          </div>
        )}

        {habits.map((h) => {
          const n = streak(h);
          return (
            <article className="habit-card" key={h._id} style={{ "--habit": h.color }}>
              <div className="habit-info">
                <strong>{h.name}</strong>
                <span>{h.frequency}</span>
                {n > 0 && <span className="streak">🔥 {n} jour{n > 1 && "s"} d’affilée</span>}
                <div className="habit-actions">
                  <button
                    type="button"
                    onClick={() => setForm({ habit: h, name: h.name, frequency: h.frequency, color: h.color })}
                  >
                    Modifier
                  </button>
                  <button type="button" className="danger" onClick={() => del(h)}>
                    Supprimer
                  </button>
                </div>
              </div>
              <div className="habit-days">
                {week.map((d, i) => {
                  const key = dateKey(d);
                  const done = h.completions.includes(key);
                  return (
                    <button
                      type="button"
                      key={key}
                      className={`day ${done ? "done" : "missed"}${key === todayKey ? " today" : ""}`}
                      aria-pressed={done}
                      aria-label={d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                      disabled={key > todayKey}
                      onClick={() => toggle(h, key)}
                    >
                      {DAYS[i]}
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}

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

            <fieldset className="habit-form-field color-picker">
              <legend>Couleur</legend>
              <div>
                {COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={c === form.color ? "selected" : ""}
                    style={{ background: c }}
                    aria-label={`Couleur ${c}`}
                    aria-pressed={c === form.color}
                    onClick={() => setForm({ ...form, color: c })}
                  />
                ))}
              </div>
            </fieldset>

            <div className="habit-form-actions">
              <button className="habit-form-submit" type="submit">
                {form.habit ? "Enregistrer les changements" : "Ajouter l’habitude"}
              </button>
              <button className="habit-form-cancel" type="button" onClick={() => setForm(null)}>
                Annuler
              </button>
              {form.habit && (
                <button className="habit-form-delete" type="button" onClick={() => del(form.habit)}>
                  Supprimer l’habitude
                </button>
              )}
            </div>
          </form>
        ) : (
          <button
            type="button"
            className="habit-add"
            onClick={() => setForm({ name: "", frequency: "Quotidien", color: COLORS[0] })}
          >
            <span aria-hidden="true">+</span>
            Ajouter une habitude
          </button>
        )}
      </section>
    </Layout>
  );
}
