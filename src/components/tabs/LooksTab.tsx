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
    return <div className="flex justify-center items-center p-8">Chargement...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-end px-4">
        <Link
          to="/creer-look"
          className="bg-hive-pink text-black font-bold rounded-lg border-2 border-hive-black shadow-[4px_4px_0_0_#111111] px-4 py-2 hover:translate-y-[4px] hover:shadow-none transition-all duration-200"
        >
          Créer un look
        </Link>
      </div>
      <div className="grid gap-8">
        {looks.map((look) => (
          <Look key={look.id} look={look} />
        ))}
      </div>
    </div>
  );
};

export default LooksTab;