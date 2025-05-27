import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Post as PostType, Comment, addComment, toggleCommentLike, updatePost, deletePost } from '../firebase/posts';
import { toast } from 'react-hot-toast';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase-config';
import { Menu } from '@headlessui/react';
import { getUserProfile } from '../firebase/users';

interface PostProps {
  post: PostType;
}

const Post = ({ post }: PostProps) => {
  const { currentUser } = useAuth();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(post.question);
  const [editedDetails, setEditedDetails] = useState(post.details);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [commentUsernames, setCommentUsernames] = useState<{[key: string]: string}>({});
  const [commentUserPhotos, setCommentUserPhotos] = useState<{[key: string]: string | null}>({});

  useEffect(() => {
    if (!post.id) return;

    const commentsRef = collection(firestore, 'posts', post.id, 'comments');
    const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(commentsQuery, async (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Comment[];
      setComments(commentsData);

      // Récupérer les pseudos des commentateurs
      const usernames: {[key: string]: string} = {};
      for (const comment of commentsData) {
        if (!commentUsernames[comment.userId]) {
          try {
            const userProfile = await getUserProfile(comment.userId);
            if (userProfile) {
              usernames[comment.userId] = userProfile.username;
              setCommentUserPhotos(prev => ({
                ...prev,
                [comment.userId]: userProfile.photoURL || null
              }));
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du pseudo du commentateur:', error);
          }
        }
      }
      setCommentUsernames(prev => ({ ...prev, ...usernames }));
    });

    return () => unsubscribe();
  }, [post.id]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userProfile = await getUserProfile(post.userId);
        if (userProfile) {
          setUsername(userProfile.username);
          setUserPhotoURL(userProfile.photoURL || null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du pseudo:', error);
      }
    };

    fetchUsername();
  }, [post.userId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Vous devez être connecté pour commenter');
      return;
    }

    try {
      setIsSubmitting(true);
      await addComment(post.id!, currentUser.uid, comment);
      setComment('');
      toast.success('Commentaire ajouté avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast.error('Une erreur est survenue lors de l\'ajout du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser) {
      toast.error('Vous devez être connecté pour liker un commentaire');
      return;
    }

    try {
      await toggleCommentLike(post.id!, commentId, currentUser.uid);
    } catch (error) {
      console.error('Erreur lors du like/unlike du commentaire:', error);
      toast.error('Une erreur est survenue lors du like/unlike du commentaire');
    }
  };

  return (
    <div className="w-full max-w-[970px] mx-auto bg-white rounded-[32px] border-[2px] border-hive-black p-6 sm:p-8 shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111] h-[700px] overflow-x-hidden">
      <div className="flex flex-col lg:flex-row w-full gap-8 h-full overflow-x-hidden">
        {/* Colonne de gauche - Post */}
        <div className="w-full lg:w-1/2 overflow-x-hidden scrollbar-thin scrollbar-track-transparent">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-between w-full">
              <Link to={`/profile/${post.userId}`} className="flex items-center gap-4">
                {userPhotoURL ? (
                  <img
                    src={userPhotoURL}
                    alt={`Photo de profil de ${username}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-hive-black"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-hive-orange border-2 border-hive-black"></div>
                )}
                <span className="text-lg font-piepie">{username}</span>
              </Link>
              {currentUser && currentUser.uid === post.userId && (
                <Menu as="div" className="relative ml-auto">
                  <Menu.Button className="p-2 hover:bg-gray-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setIsEditing(true)}
                          className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          Modifier
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={async () => {
                            if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
                              try {
                                await deletePost(post.id!);
                                toast.success('Post supprimé avec succès');
                              } catch (error) {
                                toast.error('Erreur lors de la suppression du post');
                              }
                            }
                          }}
                          className={`${active ? 'bg-gray-100' : ''} w-full text-left px-4 py-2 text-sm text-red-600`}
                        >
                          Supprimer
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              )}
            </div>
          </div>
          <h3 className="text-xl font-satoshi mb-4">{post.question}</h3>
          {isEditing ? (
            <div className="mb-6">
              <input
                type="text"
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hive-purple focus:border-transparent"
              />
              <textarea
                value={editedDetails}
                onChange={(e) => setEditedDetails(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hive-purple focus:border-transparent"
                rows={4}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={async () => {
                    try {
                      await updatePost(post.id!, {
                        question: editedQuestion,
                        details: editedDetails
                      });
                      setIsEditing(false);
                      toast.success('Post modifié avec succès');
                    } catch (error) {
                      toast.error('Erreur lors de la modification du post');
                    }
                  }}
                  className="px-4 py-2 bg-hive-purple text-white rounded-lg hover:bg-hive-purple-dark"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => {
                    setEditedQuestion(post.question);
                    setEditedDetails(post.details);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-gray-600 cursor-pointer" onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}>
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
                  <p className="text-gray-700">{post.details}</p>
                  <span className="inline-block mt-2 text-sm text-gray-600 font-satoshi">{post.style}</span>
                </div>
              )}
            </div>
          )}
          <div className="w-full">
            <img
              src={post.imageUrl}
              alt={post.question}
              className="w-full aspect-square object-cover rounded-lg border-2 border-hive-black"
            />
          </div>
        </div>

        {/* Colonne de droite - Commentaires */}
        <div className="w-full lg:w-1/2 flex flex-col h-full">
          <div className="flex-grow overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    {commentUserPhotos[comment.userId] ? (
                      <img
                        src={commentUserPhotos[comment.userId]!}
                        alt={`Photo de profil de ${commentUsernames[comment.userId]}`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-hive-black"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-hive-pink border-2 border-hive-black"></div>
                    )}
                    <span className="font-piepie">{commentUsernames[comment.userId] || comment.userId}</span>
                  </div>
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill={comment.likes?.includes(currentUser?.uid || '') ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{comment.likes?.length || 0}</span>
                  </button>
                </div>
                <p className="text-gray-700 ml-14">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Formulaire de commentaire */}
          <form onSubmit={handleSubmitComment} className="mt-auto relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="w-full p-3 border-2 border-hive-black rounded-xl resize-none shadow-[0_3px_0_0_#111111] focus:outline-none focus:border-hive-black focus:bg-hive-yellow"
              rows={3}
            />
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="absolute bottom-3 right-3 p-2 text-hive-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;