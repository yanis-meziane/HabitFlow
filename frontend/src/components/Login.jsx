import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Login.css";

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
                headers: { 'Content-Type': 'application/json' },
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
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1 className="login-title">Bienvenue sur HabitLab</h1>

                <div className="login-field">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="login-field">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="login-message login-message--error">{error}</p>}
                {success && <p className="login-message login-message--success">{success}</p>}

                <input className="login-submit" type="submit" value="Valider" />

                <hr className="login-divider" />
                <p className="login-switch">
                    Pas encore de compte ?{" "}
                    <button type="button" onClick={() => navigate("/register")}>
                        S'inscrire
                    </button>
                </p>
            </form>
        </div>
    );
}