import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase-config';

interface PrivateRouteProps {
  children: ReactNode;
}

// Composant pour protéger les routes nécessitant une authentification
const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-hive-yellow"></div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rendre le contenu protégé si l'utilisateur est authentifié
  return <>{children}</>;
};

export default PrivateRoute;