import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Register.css"

export default function Register() {
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
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.mail,
                    password: formData.mdp
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Inscription réussie ! Redirection...');
                setTimeout(() => navigate('/'), 1000);
            } else {
                setError(data.error?.message || "Erreur lors de l'inscription");
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError('Erreur de connexion au serveur');
        }
    };

    return (
        <div className="register-page">
            <form className="register-card" onSubmit={handleSubmit}>
                <h1 className="register-title">Bienvenue sur HabitLab</h1>

                <div className="register-field">
                    <label htmlFor="mail">E-mail</label>
                    <input
                        type="email"
                        name="mail"
                        id="mail"
                        maxLength={30}
                        value={formData.mail}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="register-field">
                    <label htmlFor="mdp">Mot de passe</label>
                    <input
                        type="password"
                        name="mdp"
                        id="mdp"
                        // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$"
                        title="Doit contenir au minimum 12 caractères avec 1 majuscule, une minuscule, un caractère spécial et un chiffre"
                        value={formData.mdp}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="register-message register-message--error">{error}</p>}
                {success && <p className="register-message register-message--success">{success}</p>}

                <input className="register-submit" type="submit" value="Valider" />

                <hr className="register-divider" />
                <p className="register-switch">
                    Vous avez déjà un compte ?{" "}
                    <button type="button" onClick={() => navigate("/")}>
                        Connexion
                    </button>
                </p>
            </form>
        </div>
    );
}