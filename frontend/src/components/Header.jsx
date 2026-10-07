import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <header className="header">
      <div className="logo">LOGO ?</div>
      <nav className="navbar" aria-label="Navigation principale">
        <NavLink to="/habits">Aujourd’hui</NavLink>
        <NavLink to="/calendar">Calendrier</NavLink>
      </nav>
      <button className="btn-connexion btn-logout" type="button" onClick={logout}>
        Déconnexion
      </button>
    </header>
  );
}
