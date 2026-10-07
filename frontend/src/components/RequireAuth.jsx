import { Navigate, Outlet } from "react-router-dom";

const hasToken = () => Boolean(localStorage.getItem("token"));

// pages privées : sans jeton, retour au login
// (la vraie protection reste côté API : un jeton absent/invalide donne 401)
export default function RequireAuth() {
  return hasToken() ? <Outlet /> : <Navigate to="/" replace />;
}

// login / inscription : déjà connecté, on file vers les habitudes
export function RedirectIfAuth() {
  return hasToken() ? <Navigate to="/habits" replace /> : <Outlet />;
}
