import { useState } from "react";
import Layout from "./Layout.jsx";
import { dateKey, useHabits } from "../habits.js";
import "../css/Calendar.css";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function Calendar() {
  const { habits, toggle } = useHabits();
  const todayKey = dateKey(new Date());
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState(todayKey);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const offset = (cursor.getDay() + 6) % 7; // lundi en premier
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))];

  const doneOn = (key) => habits.filter((h) => h.completions.includes(key));
  const prefix = dateKey(cursor).slice(0, 7);
  const monthTotal = habits.reduce((n, h) => n + h.completions.filter((c) => c.startsWith(prefix)).length, 0);

  const move = (delta) => setCursor(new Date(year, month + delta, 1));
  const selectedDone = doneOn(selected);
  const selectedLabel = new Date(`${selected}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <Layout>
      <section className="calendar-page">
        <h1>Mon <span>calendrier</span></h1>

        <div className="calendar-layout">
          <div className="calendar">
            <div className="calendar-head">
              <button type="button" onClick={() => move(-1)} aria-label="Mois précédent">‹</button>
              <h2>{cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</h2>
              <button type="button" onClick={() => move(1)} aria-label="Mois suivant">›</button>
            </div>
            <p className="calendar-total"><strong>{monthTotal}</strong> validation{monthTotal > 1 && "s"} ce mois-ci</p>

            <div className="calendar-grid">
              {WEEKDAYS.map((d) => <span className="calendar-weekday" key={d}>{d}</span>)}
              {cells.map((d, i) => {
                if (!d) return <span key={`blank-${i}`} />;
                const key = dateKey(d);
                const done = doneOn(key);
                const all = habits.length > 0 && done.length === habits.length;
                return (
                  <button
                    type="button"
                    key={key}
                    className={`calendar-day${key === selected ? " selected" : ""}${key === todayKey ? " today" : ""}${all ? " perfect" : ""}`}
                    onClick={() => setSelected(key)}
                    aria-pressed={key === selected}
                  >
                    <span>{d.getDate()}</span>
                    <span className="dots">
                      {done.slice(0, 6).map((h) => <i key={h.id} style={{ background: h.color }} />)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="day-detail">
            <h3>{selectedLabel}</h3>
            <p>{selectedDone.length}/{habits.length} habitude{habits.length > 1 && "s"} faite{selectedDone.length > 1 && "s"}</p>
            <ul>
              {habits.map((h) => {
                const done = h.completions.includes(selected);
                return (
                  <li key={h.id} style={{ "--habit": h.color }}>
                    <button
                      type="button"
                      className={done ? "done" : ""}
                      aria-pressed={done}
                      disabled={selected > todayKey}
                      onClick={() => toggle(h, selected)}
                    >
                      <span className="check" aria-hidden="true">{done ? "✓" : ""}</span>
                      {h.title}
                    </button>
                  </li>
                );
              })}
            </ul>
            {habits.length === 0 && <p>Aucune habitude pour l’instant.</p>}
            {selected > todayKey && <p className="hint">Ce jour n’est pas encore arrivé.</p>}
          </aside>
        </div>
      </section>
    </Layout>
  );
}
