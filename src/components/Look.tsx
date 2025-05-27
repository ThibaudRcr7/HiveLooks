import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Look as LookType, toggleLike } from '../firebase/looks';
import { getUserProfile } from '../firebase/users';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface LookProps {
  look: LookType;
}

const Look = ({ look }: LookProps) => {
  const { currentUser } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getUserProfile(look.userId);
        if (userProfile) {
          setUsername(userProfile.username || '');
          setUserPhotoURL(userProfile.photoURL || null);
        } else {
          console.error('Profil utilisateur non trouvé');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
      }
    };

    fetchUserData();
  }, [look.userId]);

  const toggleDetails = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
  };

  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    if (currentUser && look.likes) {
      setLiked(look.likes.includes(currentUser.uid));
      setLikeCount(look.likes.length);
    }
  }, [currentUser, look.likes]);

  const handleLikeClick = async () => {
    if (!currentUser) {
      toast.error('Vous devez être connecté pour liker un look');
      return;
    }
    if (!look.id) {
      toast.error('Identifiant du look invalide');
      return;
    }

    try {
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
      await toggleLike(look.id, currentUser.uid);
    } catch (error) {
      setLiked(liked);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
      console.error('Erreur lors du like:', error);
      toast.error('Une erreur est survenue lors du like');
    }
  };

  return (
    <div className="bg-white rounded-[32px] border-[2px] border-hive-black shadow-[8px_8px_0_0_#906CFE,_8px_8px_0_2px_#111111] overflow-hidden mb-6 h-[700px]">
      <div className="flex flex-col md:flex-row h-full overflow-x-hidden">
        <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-x-hidden scrollbar-thin scrollbar-track-transparent">
          <div className="flex items-center gap-4 mb-6">
            <Link to={`/profile/${look.userId}`} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-hive-black overflow-hidden">
                {userPhotoURL ? (
                  <img
                    src={userPhotoURL}
                    alt={username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-hive-pink" />
                )}
              </div>
              <span className="text-lg font-piepie">{username}</span>
            </Link>
          </div>

          <h2 className="font-piepie text-2xl font-bold mb-6">
            {look.title}
          </h2>

          <div className="flex-grow mb-6">
            {look.description.length > 150 ? (
              <>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {isDetailsExpanded
                    ? look.description
                    : `${look.description.slice(0, 150)}...`}
                </p>
                <button
                  onClick={toggleDetails}
                  className="text-hive-pink hover:underline mt-4 text-lg font-medium"
                >
                  {isDetailsExpanded ? 'Afficher moins' : 'Afficher plus'}
                </button>
              </>
            ) : (
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{look.description}</p>
            )}
            {look.style && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-hive-purple text-lg font-medium">#{look.style}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 mt-auto">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleLikeClick}
                className="focus:outline-none transform hover:scale-110 transition-transform duration-200"
                disabled={!currentUser}
              >
                <FaHeart 
                  className={`text-2xl transition-colors duration-200 ${liked ? 'text-hive-pink' : 'text-gray-400'}`}
                />
              </button>
              <span className="text-gray-700 text-lg font-medium">{likeCount} Looks</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden p-4">
          <div className="w-full h-full relative rounded-2xl overflow-hidden">
            <img
              src={look.imageUrl}
              alt={look.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Look;