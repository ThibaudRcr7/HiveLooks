import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Look, getUserLooks } from '../firebase/looks';
import { getUserProfile } from '../firebase/users';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';

interface LooksTabProps {
  userId: string;
}

interface UserData {
  username: string;
  photoURL: string | null;
}

export default function LooksTab({ userId }: LooksTabProps) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
          const userProfile = await getUserProfile(userId);
          setUserData({
            username: userProfile?.username || '',
            photoURL: userProfile?.photoURL || null
          });
        } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
        setError('Erreur lors du chargement du profil utilisateur');
      }
    };

    const fetchLooks = async () => {
      try {
        const userLooks = await getUserLooks(userId);
        setLooks(userLooks);
      } catch (error) {
        console.error('Erreur lors de la récupération des looks:', error);
        setError('Erreur lors du chargement des looks');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchLooks();
  }, [userId]);

  const handleCreateLook = () => {
    navigate('/creer-look');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-hive-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {currentUser && currentUser.uid === userId && (
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreateLook}
            className="flex items-center gap-2 px-4 py-2 bg-hive-pink text-hive-black rounded-lg border-2 border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all"
          >
            <IoMdAdd className="text-xl" />
            Créer un look
          </button>
        </div>
      )}

      {looks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun look n'a été publié pour le moment.
        </div>
      ) : (
        <div className="grid gap-8">
          {looks.map((look) => (
            <div
              key={look.id}
              className="bg-white rounded-lg border-2 border-hive-black shadow-[4px_4px_0_0_#111111] overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <h2 className="font-satoshi text-xl font-bold mb-4">
                    {look.title}
                  </h2>
                  <p className="text-gray-700 mb-6">
                    {look.description}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaHeart className="text-hive-pink" />
                    <span>{look.likes?.length || 0}</span>
                    <span>Looks</span>
                  </div>
                </div>
                <div className="md:w-1/2 p-6">
                  <img
                    src={look.imageUrl}
                    alt={look.title}
                    className="w-full h-auto rounded-lg border-2 border-hive-black shadow-[4px_4px_0_0_#111111]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}