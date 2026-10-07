import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BtnAccueil from "./buttonAccueil";
import Habits from "./Habits";

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Le backend renvoie { token } : on le stocke pour les requêtes protégées
                localStorage.setItem('token', data.token);

                setSuccess('Connexion réussie ! Redirection...');
                setTimeout(() => navigate('/habit'), 1000);
            } else {
                setError(data.message || 'Erreur lors de la connexion');
            }

        } catch (err) {
            console.error('Erreur:', err);
            setError('Erreur de connexion au serveur');
        }
    };

    return (
        <div>
            <h1>Je suis la page Login</h1>

            <form onSubmit={handleSubmit}>
                <h2>Connexion</h2>

                <span className="emailLogin">
                    <label htmlFor="email">Mail</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Votre mail..."
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </span>

                <span className="pwdLogin">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Votre mot de passe..."
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </span>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <input className="submit" type="submit" value="Valider" />
            </form>

            <button onClick={() => navigate("/register")}>S'inscrire</button>
            <BtnAccueil />
        </div>
    )
}