import { useNavigate } from "react-router-dom"; 
import { useState } from "react";
import BtnAccueil from "./buttonAccueil";

 export default function Login(){
    const [formData, setFormData] = useState({
        mail: '',
        mdp: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Stocker les informations utilisateur
                localStorage.setItem("type", data.type.trim());
                localStorage.setItem("userId", data.userId);

                setSuccess('Connexion réussie !');

                setTimeout(() => {
                    if (data.type === "admin") {
                        navigate('/admin');
                    }
                }, 500);

            } else {
                setError(data.message || 'Erreur lors de la connexion');
            }

        } catch (error) {
            console.error('Erreur:', error);
            setError('Erreur de connexion au serveur');
        }
    };
    return(
        <div>
            <h1>Je suis la page Login</h1>

            <form onSubmit={handleSubmit}>
                <h2>Connexion</h2> 
                    <span className="emailLogin">
                        <label htmlFor="mail">Mail</label>
                        <input 
                            type="mail" 
                            name="mail"
                            id="mail"
                            placeholder="Votre mail..."
                            minLength={1}
                            maxLength={25}
                            value={formData.mail}
                            onChange={handleChange}
                            required
                        />
                    </span>

                    <span className="pwdLogin">
                        <label htmlFor="mdp">Mot de passe</label>
                    <input
                        type="password"
                        name="mdp"
                        id="mdp"
                        placeholder="Votre mot de passe..."
                        value={formData.mdp}
                        onChange={handleChange}
                        required
                    />
                    </span>

                <input className="submit" type="submit" value="Valider" />
            </form>

            <button onClick={() => navigate("/register")} >S'inscrire</button>
            <BtnAccueil />
        </div>
    )
}