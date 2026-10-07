import { useNavigate } from "react-router-dom";
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
      <p>Aujourd’hui</p>
      <button className="btn-connexion" type="button" onClick={logout}>
        Déconnexion
      </button>
    </header>
  );
}
