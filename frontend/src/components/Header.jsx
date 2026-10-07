import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo">LOGO ?</div>
      <p>Aujourd’hui</p>
    </header>
  );
}
