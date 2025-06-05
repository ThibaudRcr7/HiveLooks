import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { Look as LookType, toggleLike, updateLook, deleteLook } from '../firebase/looks';
import { getUserProfile } from '../firebase/users';
import Tag from './common/Tag';
import Spinner from '../components/common/Spinner';



interface LookProps {
  look: LookType;
  onDelete?: (lookId: string) => void;
}

const Look = ({ look, onDelete }: LookProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedTitle, setEditedTitle] = useState(look.title);
  const [editedDescription, setEditedDescription] = useState(look.description);
  const [editedTags, setEditedTags] = useState(look.tags || []);

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
            <div className="flex items-center justify-between w-full">
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
              {currentUser && currentUser.uid === look.userId && (
                <Menu as="div" className="relative ml-auto">
                  <Menu.Button className="p-2 hover:bg-hive-pale rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-hive-black/20 z-10">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setIsEditing(true)}
                          className={`${active ? 'bg-hive-pale' : ''} w-full text-left px-4 py-2 text-sm text-hive-black/70`}
                        >
                          Modifier
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={async () => {
                            if (isDeleting) return;
                            
                            if (!look.id) {
                              toast.error('Identifiant du look invalide');
                              return;
                            }

                            if (window.confirm('Êtes-vous sûr de vouloir supprimer ce look ?')) {
                              console.time('deleteLook');
                              setIsDeleting(true);
                              
                              try {
                                await deleteLook(look.id);
                                onDelete?.(look.id);
                                toast.success('Look supprimé avec succès');
                                
                                // Utiliser requestIdleCallback pour la navigation
                                if ('requestIdleCallback' in window) {
                                  requestIdleCallback(() => navigate('/discover'));
                                } else {
                                  setTimeout(() => navigate('/discover'), 0);
                                }
                              } catch (error) {
                                console.error('Erreur lors de la suppression du look:', error);
                                toast.error('Une erreur est survenue lors de la suppression du look');
                                setIsDeleting(false);
                              } finally {
                                console.timeEnd('deleteLook');
                              }
                            }
                          }}
                          disabled={isDeleting}
                          className={`${active ? 'bg-hive-pale' : ''} w-full text-left px-4 py-2 text-sm text-hive-pink flex items-center justify-between ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Supprimer
                          {isDeleting && (
                            <div className="ml-2">
                              <Spinner size="small" />
                            </div>
                          )}
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="mb-6">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full mb-4 px-4 py-2 border border-hive-black/30 rounded-lg focus:ring-2 focus:ring-hive-purple focus:border-transparent font-piepie text-2xl"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full px-4 py-2 border border-hive-black/30 rounded-lg focus:ring-2 focus:ring-hive-purple focus:border-transparent mb-4"
                rows={4}
              />
              <input
                type="text"
                value={editedTags.join(' ')}
                onChange={(e) => setEditedTags(e.target.value.split(' ').filter(tag => tag.length > 0))}
                placeholder="Tags (séparés par des espaces)"
                className="w-full px-4 py-2 border border-hive-black/30 rounded-lg focus:ring-2 focus:ring-hive-purple focus:border-transparent mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    try {
                      await updateLook(look.id!, {
                        title: editedTitle,
                        description: editedDescription,
                        tags: editedTags
                      });
                      setIsEditing(false);
                      toast.success('Look modifié avec succès');
                    } catch (error) {
                      toast.error('Erreur lors de la modification du look');
                    }
                  }}
                  className="px-4 py-2 bg-hive-purple text-white rounded-lg hover:bg-hive-purple-dark"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => {
                    setEditedTitle(look.title);
                    setEditedDescription(look.description);
                    setEditedTags(look.tags || []);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-hive-pale text-hive-black rounded-lg hover:bg-hive-pale/80"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mb-6">
              <h2 className="font-satoshi text-2xl font-bold">
                {look.title}
              </h2>
            </div>
          )}

          <div className="flex-grow mb-6">
            <div className="flex items-center gap-2 text-hive-black/60 cursor-pointer" onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}>
              <span className="text-base">{isDetailsExpanded ? 'Afficher moins' : 'Afficher plus'}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 transform transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {isDetailsExpanded && (
              <div className="mt-4">
                <p className="text-hive-black/70 text-lg leading-relaxed whitespace-pre-wrap mb-4">{look.description}</p>
                {(look.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(look.tags || []).map((tag) => (
                      <Tag
                        key={tag}
                        tag={tag}
                        variant="look"
                        onClick={() => window.location.href = `/discover?tag=${encodeURIComponent(tag)}`}
                      />
                    ))}
                  </div>
                )}
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
                <img 
                  src={`/src/assets/images/icons/${liked ? 'purple' : 'empty'}-like.svg`}
                  alt={liked ? 'Unlike' : 'Like'}
                  className="w-6 h-6"
                />
              </button>
              <span className="text-hive-black/70 text-lg font-medium">{likeCount} Looks</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden p-4">
          <div className="w-full h-full relative rounded-2xl overflow-hidden border-2 border-hive-black">
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