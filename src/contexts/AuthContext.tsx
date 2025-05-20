import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        toast.success('Connexion réussie !', {
          icon: '👋',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};