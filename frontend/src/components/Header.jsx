import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <header className="header">
      <div className="logo">LOGO ?</div>
      <p>Aujourd’hui</p>
      <button className="btn-connexion" type="button" onClick={logout}>
        Déconnexion
      </button>
    </header>
  );
}
