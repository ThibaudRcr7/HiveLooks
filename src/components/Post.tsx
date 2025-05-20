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
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedDescription, setEditedDescription] = useState(post.description);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    if (!post.id) return;

    const commentsRef = collection(firestore, 'posts', post.id, 'comments');
    const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Comment[];
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [post.id]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userProfile = await getUserProfile(post.userId);
        if (userProfile) {
          setUsername(userProfile.username);
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
        <div className="w-full lg:w-1/2 overflow-x-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-between w-full">
              <Link to={`/profile/${post.userId}`} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-hive-orange border-2 border-hive-black"></div>
                <div>
                  <h4 className="text-lg">@{username || post.userId}</h4>
                  <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
                </div>
              </Link>
              {currentUser && currentUser.uid === post.userId && (
                <Menu as="div" className="relative">
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
          {isEditing ? (
            <div className="mb-6">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hive-purple focus:border-transparent"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hive-purple focus:border-transparent"
                rows={4}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={async () => {
                    try {
                      await updatePost(post.id!, {
                        title: editedTitle,
                        description: editedDescription
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
                    setEditedTitle(post.title);
                    setEditedDescription(post.description);
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
              <div className="flex items-center gap-2 text-gray-600 cursor-pointer" onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
                <span className="text-base">{isDescriptionExpanded ? 'Afficher moins' : 'Afficher plus'}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 transform transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {isDescriptionExpanded && (
                <p className="text-base sm:text-lg mt-4">{post.description}</p>
              )}
            </div>
          )}
          <div className="w-full">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full aspect-square object-cover rounded-lg border-2 border-hive-black"
            />
          </div>
        </div>

        {/* Colonne de droite - Commentaires */}
        <div className="flex flex-col h-full w-full lg:w-1/2 overflow-hidden">
          {/* Zone de commentaires scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-hide overflow-x-hidden mb-4 max-h-[calc(100%-160px)]">
            <div className="px-4">
              <div className="flex flex-col gap-4">
                {comments.map((comment) => {
                  return (
                    <div key={comment.id} className="p-4 sm:p-6 bg-white rounded-xl border-2 border-hive-black">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-hive-pink border-2 border-hive-black"></div>
                        <h4 className="font-bold text-sm">@{username || 'utilisateur'}</h4>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-sm flex-1">{comment.content}</p>
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className="flex items-center gap-1 text-hive-black hover:text-hive-pink transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill={comment.likes?.includes(currentUser?.uid || '') ? "#FF1493" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                          </svg>
                          <span className="text-sm font-medium">{comment.likes?.length || 0}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Zone de réponse fixe en bas */}
          <div className="sticky bottom-0 bg-white pt-4">
            <div className="relative px-4">
            <form onSubmit={handleSubmitComment}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajoute ton conseil..."
                className="w-full p-4 rounded-lg border-2 border-hive-black resize-none focus:outline-none focus:ring-2 focus:ring-hive-orange bg-hive-yellow placeholder-hive-black"
                rows={3}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-4 bottom-4 p-2 text-hive-black hover:text-hive-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Post;