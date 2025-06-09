import { FC, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase-config';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Look from '../Look';
import { Look as LookType, getUserLooks } from '../../firebase/looks';

interface LooksTabProps {
  userId: string;
  onLooksCountChange?: (count: number) => void;
}

const LooksTab: FC<LooksTabProps> = ({ userId, onLooksCountChange }) => {
  const [user] = useAuthState(auth);
  const [looks, setLooks] = useState<LookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isOwnProfile = user?.uid === userId;

  useEffect(() => {
    const fetchLooks = async () => {
      try {
        const userLooks = await getUserLooks(userId);
        setLooks(userLooks);
        onLooksCountChange?.(userLooks.length);
        setError('');
      } catch (error) {
        console.error('Erreur lors de la récupération des looks:', error);
        setError('Erreur lors du chargement des looks');
        toast.error('Erreur de chargement des looks');
      } finally {
        setLoading(false);
      }
    };

    fetchLooks();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hive-purple"></div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-[200px] text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl w-full mx-auto">
      {isOwnProfile && (
        <div className="flex justify-end mb-6">
          <Link
            to="/creer-look"
            className="bg-hive-pink text-black font-bold rounded-lg border-2 border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200 px-4 py-2"
          >
            Créer un look
          </Link>
        </div>
      )}
      <div className="grid gap-8">
        {looks.length > 0 ? (
          looks.map((look) => (
            <Look 
              key={look.id} 
              look={look} 
              onDelete={(lookId) => {
                const updatedLooks = looks.filter(l => l.id !== lookId);
                setLooks(updatedLooks);
                onLooksCountChange?.(updatedLooks.length);
              }}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-hive-black/50">
            {isOwnProfile
                ? "Vous n'avez pas encore publié de looks."
                : "Cet utilisateur n'a pas encore publié de looks."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LooksTab;