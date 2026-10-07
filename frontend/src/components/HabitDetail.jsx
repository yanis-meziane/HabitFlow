import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { FREQUENCY_LABELS, api, streak } from "../habits.js";

export default function HabitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    api(`/${id}`)
      .then(setHabit)
      .catch((e) => setError(e.status === 404 ? "Habitude introuvable." : e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleActive = async () => {
    setError("");
    try { setHabit(await api(`/${id}`, "PATCH", { active: !habit.active })); } catch (e) { setError(e.message); }
  };

  const remove = async () => {
    try {
      await api(`/${id}`, "DELETE");
      navigate("/habits");
    } catch (e) {
      setConfirming(false);
      setError(e.message);
    }
  };

  const recent = habit ? [...habit.completions].sort().reverse().slice(0, 10) : [];

  return (
    <Layout>
      <section className="habit-detail">
        <Link to="/habits" className="back-link">← Retour aux habitudes</Link>

        {loading && <p className="state">Chargement…</p>}
        {error && <p className="banner-error" role="alert">{error}</p>}

        {habit && (
          <article className="detail-card" style={{ "--habit": habit.color }}>
            <h1>{habit.title}</h1>
            <p className={`badge ${habit.active ? "on" : "off"}`}>{habit.active ? "Active" : "Inactive"}</p>

            <dl className="detail-stats">
              <div><dt>Fréquence</dt><dd>{FREQUENCY_LABELS[habit.frequency]}</dd></div>
              <div><dt>Série en cours</dt><dd>🔥 {streak(habit)} jour{streak(habit) > 1 && "s"}</dd></div>
              <div><dt>Jours validés</dt><dd>{habit.completions.length}</dd></div>
              <div><dt>Créée le</dt><dd>{new Date(habit.createdAt).toLocaleDateString("fr-FR")}</dd></div>
            </dl>

            <h2>Derniers jours validés</h2>
            {recent.length ? (
              <ul className="recent">
                {recent.map((d) => (
                  <li key={d}>{new Date(`${d}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</li>
                ))}
              </ul>
            ) : (
              <p className="state">Aucun jour validé pour l’instant.</p>
            )}

            <div className="detail-actions">
              <button type="button" className="habit-form-submit" onClick={toggleActive}>
                {habit.active ? "Désactiver" : "Réactiver"}
              </button>
              <button type="button" className="habit-form-delete" onClick={() => setConfirming(true)}>
                Supprimer l’habitude
              </button>
            </div>
          </article>
        )}

        {confirming && (
          <ConfirmDialog
            title="Supprimer cette habitude ?"
            message={`« ${habit.title} » et son historique seront supprimés définitivement.`}
            onConfirm={remove}
            onCancel={() => setConfirming(false)}
          />
        )}
      </section>
    </Layout>
  );
}
