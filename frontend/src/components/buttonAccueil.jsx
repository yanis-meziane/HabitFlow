import { useNavigate } from "react-router-dom"

export default function BtnAccueil(){
    const navigate = useNavigate()
    return(
        <div>
           <button onClick={() => navigate("/")} >Retour accueil</button>
        </div>
    )
}