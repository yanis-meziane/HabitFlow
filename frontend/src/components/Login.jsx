import { useNavigate } from "react-router-dom"; 
 export default function Login(){
    const navigate = useNavigate()
    return(
        <div>
            <h1>Je suis la page Login</h1>
            <button onClick={() => navigate("/register")} >S'inscrire</button>
        </div>
    )
}