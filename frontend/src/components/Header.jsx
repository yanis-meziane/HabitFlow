import logo from "../../images/logo_HabitLab.png";

export default function Header() {
  return (
    <header className="header">
      <img className="logo" src={logo} alt="Logo HabitLab" />
      <p>Aujourd’hui</p>
    </header>
  );
}
