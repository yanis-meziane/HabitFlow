import { useEffect, useState } from "react";

export const COLORS = ["#7cb73b", "#3b82c4", "#e0752d", "#9b5de5", "#e63e6d", "#14a89a"];

const api = async (path = "", method = "GET", body) => {
  const res = await fetch(`/api/habits${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
    body: body && JSON.stringify(body),
  });
  if (res.status === 401) { localStorage.removeItem("token"); location.href = "/"; }
  return res.status === 204 ? null : res.json();
};

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
  useEffect(() => { api().then((h) => Array.isArray(h) && setHabits(h)); }, []);

  const replace = (h) => setHabits((hs) => hs.map((x) => (x._id === h._id ? h : x)));

  return {
    habits,
    toggle: async (h, date) => replace(await api(`/${h._id}/toggle`, "POST", { date })),
    create: async (data) => {
      const h = await api("", "POST", data);
      setHabits((hs) => [...hs, h]);
    },
    update: async (h, data) => replace(await api(`/${h._id}`, "PUT", data)),
    remove: async (h) => {
      await api(`/${h._id}`, "DELETE");
      setHabits((hs) => hs.filter((x) => x._id !== h._id));
    },
  };
}
