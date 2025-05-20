import { FC, useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';
import { createUserProfile } from '../firebase/users';
import HeaderLogo from '../assets/images/logos/Header-logo.svg';

const SignUp: FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Tous les champs sont requis');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(userCredential.user.uid, username, email);
      navigate('/profile');
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FFFDE3]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl border-2 border-black shadow-[8px_8px_0_0_#9b5de5,_8px_8px_0_2px_#111111]">
        {/* Titre */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-wide">
            <span className="text-black">BIENVENUE SUR </span>
            <span className="text-hive-purple">HIVE</span>
            <span className="text-black">LOOKS !</span>
          </h2>
          <img src={HeaderLogo} alt="Hive Logo" className="w-8 h-8" />
        </div>

        {/* Formulaire */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="space-y-4">
            {/* Champ pseudo */}
            <div>
              <label htmlFor="username" className="block text-sm font-bold uppercase mb-2">Pseudo:</label>
              <input
                id="username"
                name="username"
                type="text"
                className="w-full px-3 py-2 rounded-lg border-2 border-black focus:outline-none focus:border-hive-purple"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Champ email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold uppercase mb-2">Email:</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 rounded-lg border-2 border-black focus:outline-none focus:border-hive-purple"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Champ mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold uppercase mb-2">Mot de passe:</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 rounded-lg border-2 border-black focus:outline-none focus:border-hive-purple"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Champ confirmation */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-bold uppercase mb-2">Confirmer le mot de passe:</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="w-full px-3 py-2 rounded-lg border-2 border-black focus:outline-none focus:border-hive-purple"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Bouton d'envoi */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 bg-hive-purple text-black font-bold rounded-lg border-2 border-black shadow-[0_4px_0_#000000] hover:translate-y-[2px] transition-transform duration-150 ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'Inscription en cours...' : 'Créer un compte'}
            </button>
          </div>

          {/* Lien vers la connexion */}
          <div className="text-sm text-center">
            <p className="text-black">Vous avez déjà un compte ?</p>
            <Link to="/connexion" className="font-medium text-hive-purple hover:underline">
              SE CONNECTER
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
