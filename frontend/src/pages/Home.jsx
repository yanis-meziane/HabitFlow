 import { useNavigate } from "react-router-dom"; 

 export default function Home() {
  const navigate = useNavigate();
  return (
    <section className="home">
      <h1>Full Stack JS - Projet étudiant</h1>
       <button onClick={() => navigate("/login")} className="tc-pill-btn" type="button">
          Se connecter</button>
    </section>
  );
}
