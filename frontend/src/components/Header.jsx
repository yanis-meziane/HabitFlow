import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../images/logo_HabitLab.png";

export default function Header() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="header">
      <img className="logo" src={logo} alt="Logo HabitLab" />
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
