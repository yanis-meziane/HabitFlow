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

  const add = async () => {
    const name = prompt("Nom de la nouvelle habitude ?")?.trim();
    if (name) setHabits([...habits, await api("", "POST", { name })]);
  };

  const rename = async (h) => {
    const name = prompt("Nouveau nom ?", h.name)?.trim();
    if (name) replace(await api(`/${h._id}`, "PUT", { name }));
  };

  const remove = async (h) => {
    await api(`/${h._id}`, "DELETE");
    setHabits(habits.filter((x) => x._id !== h._id));
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
                <button type="button" onClick={() => rename(h)}>Modifier</button>
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

        <button type="button" className="habit-add" onClick={add}>+ Ajouter une habitude . . .</button>
      </section>
    </Layout>
  );
}
