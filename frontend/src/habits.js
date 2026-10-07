import { useEffect, useState } from "react";

export const COLORS = ["#7cb73b", "#3b82c4", "#e0752d", "#9b5de5", "#e63e6d", "#14a89a"];

export const api = async (path = "", method = "GET", body) => {
  const res = await fetch(`/api/habits${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
    body: body && JSON.stringify(body),
  });
  if (res.status === 401) { localStorage.removeItem("token"); location.href = "/"; }
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error?.message ?? "Erreur serveur"), { status: res.status });
  return data;
};

// libellés d'affichage des fréquences du contrat API (daily / weekly)
export const FREQUENCY_LABELS = { daily: "Quotidien", weekly: "Hebdomadaire" };

const pad = (n) => String(n).padStart(2, "0");
// date locale -> "YYYY-MM-DD" (même format que le back)
export const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// jours consécutifs validés jusqu'à aujourd'hui (aujourd'hui pas encore fait ne casse pas la série)
export function streak(habit) {
  const d = new Date();
  if (!habit.completions.includes(dateKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (habit.completions.includes(dateKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export function useHabits() {
  const [habits, setHabits] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // exécute une action API ; en cas d'échec, affiche le message au lieu de corrompre la liste
  const guard = (fn) => async (...args) => {
    setError("");
    try { await fn(...args); } catch (e) { setError(e.message); }
  };

  useEffect(() => {
    api().then((data) => setHabits(data.items)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const replace = (h) => setHabits((hs) => hs.map((x) => (x.id === h.id ? h : x)));

  return {
    habits,
    error,
    loading,
    toggle: guard(async (h, date) => replace(await api(`/${h.id}/toggle`, "POST", { date }))),
    create: guard(async (data) => {
      const h = await api("", "POST", { active: true, ...data });
      setHabits((hs) => [...hs, h]);
    }),
    update: guard(async (h, data) => replace(await api(`/${h.id}`, "PATCH", data))),
    remove: guard(async (h) => {
      await api(`/${h.id}`, "DELETE");
      setHabits((hs) => hs.filter((x) => x.id !== h.id));
    }),
  };
}
