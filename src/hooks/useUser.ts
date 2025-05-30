import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase-config';
import { getUserProfile } from '../firebase/users';

export interface User {
  uid: string;
  username?: string;
  photoURL?: string | null;
}

export interface UseUserHook {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export const useUser = (): UseUserHook => {
  const [firebaseUser] = useAuthState(auth);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userProfile = await getUserProfile(firebaseUser.uid);
        if (userProfile) {
          setUser({ ...userProfile, uid: firebaseUser.uid });
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du profil utilisateur:', err);
        setError(err instanceof Error ? err : new Error('Erreur lors de la récupération du profil utilisateur'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [firebaseUser]);

  return {
    user,
    loading,
    error
  };
};