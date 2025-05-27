import { FC, useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../firebase/firebase-config';
import { Menu } from '@headlessui/react';
import { getUserProfile } from '../../firebase/users';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface Look {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  likes: string[];
  style?: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  likes: string[];
}

const LooksTab: FC = () => {
  const [user] = useAuthState(auth);
  const [looks, setLooks] = useState<Look[]>([]);
  const [comments, setComments] = useState<{ [lookId: string]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [expandedLooks, setExpandedLooks] = useState<Set<string>>(new Set());
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [userPhotos, setUserPhotos] = useState<{ [key: string]: string | null }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserLooks();
    }
  }, [user]);

  const fetchUserLooks = async () => {
    if (!user) return;
    try {
      const looksRef = collection(firestore, 'looks');
      const q = query(looksRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const userLooks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Look[];
      setLooks(userLooks);
      
      userLooks.forEach(look => {
        fetchComments(look.id);
        fetchUsername(look.userId);
      });
      setError(''); // Réinitialiser l'erreur en cas de succès
    } catch (err) {
      console.error('Erreur lors du chargement des looks:', err);
      if (err instanceof Error) {
        if (err.name === 'FirestoreIndexError') {
          setError(
            'Configuration de la base de données requise. ' +
            'Veuillez contacter l\'administrateur pour créer l\'index nécessaire.'
          );
          toast.error('Index Firestore manquant. Un administrateur doit intervenir.');
        } else {
          setError('Une erreur est survenue lors du chargement des looks. Veuillez réessayer.');
          toast.error('Erreur de chargement des looks');
        }
      } else {
        setError('Une erreur inattendue est survenue. Veuillez réessayer.');
        toast.error('Erreur inattendue');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (lookId: string) => {
    try {
      const commentsRef = collection(firestore, 'looks', lookId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const lookComments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Comment[];
      setComments(prev => ({ ...prev, [lookId]: lookComments }));
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
    }
  };

  const fetchUsername = async (userId: string) => {
    try {
      const userProfile = await getUserProfile(userId);
      if (userProfile) {
        setUsernames(prev => ({ ...prev, [userId]: userProfile.username }));
        setUserPhotos(prev => ({ ...prev, [userId]: userProfile.photoURL || null }));
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du pseudo:', err);
    }
  };

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
      <div className="grid grid-cols-1 gap-6">
        {looks.map((look) => (
          <div key={look.id} className="bg-white rounded-lg border-2 border-black shadow-[8px_8px_0_0_#726CFF] overflow-hidden p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <h3 className="font-piepie font-bold text-xl">{look.title}</h3>
                <p className="text-gray-800">
                  {look.description.length > 200 && !expandedLooks.has(look.id)
                    ? `${look.description.slice(0, 200)}...`
                    : look.description}
                  {look.description.length > 200 && (
                    <button
                      onClick={() => setExpandedLooks(prev =>
                        prev.has(look.id) ? new Set([...prev].filter(id => id !== look.id)) : new Set([...prev, look.id])
                      )}
                      className="text-hive-pink hover:text-hive-pink/80 ml-2"
                    >
                      {expandedLooks.has(look.id) ? 'Afficher moins' : 'Afficher plus'}
                    </button>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-2 text-hive-black hover:text-hive-black/80"
                    onClick={() => {}}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                    <span>{look.likes?.length || 0} Looks</span>
                  </button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img
                  src={look.imageUrl}
                  alt={look.title}
                  className="w-full h-auto rounded-lg border-2 border-black"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LooksTab;