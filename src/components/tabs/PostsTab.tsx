import { FC, useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../firebase/firebase-config';
import { Menu } from '@headlessui/react';
import { updatePost, deletePost } from '../../firebase/posts';
import { getUserProfile } from '../../firebase/users';
import { toast } from 'react-hot-toast';

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  likes: string[];
}

interface Post {
  id: string;
  userId: string;
  question: string;
  details: string;
  style: string;
  imageUrl: string;
  createdAt: Date;
  likes: string[];
}

interface PostsTabProps {
  onPostsCountChange?: (count: number) => void;
}

const PostsTab: FC<PostsTabProps> = ({ onPostsCountChange }) => {
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedDetails, setEditedDetails] = useState('');
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [userPhotos, setUserPhotos] = useState<{ [key: string]: string | null }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLikeComment = async (postId: string, commentId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour liker un commentaire');
      return;
    }

    try {
      const commentsRef = collection(firestore, 'posts', postId, 'comments');
      const commentDoc = doc(commentsRef, commentId);
      const commentSnapshot = await getDoc(commentDoc);
      
      if (commentSnapshot.exists()) {
        const currentLikes = commentSnapshot.data().likes || [];
        const newLikes = currentLikes.includes(user.uid)
          ? currentLikes.filter((id: string) => id !== user.uid)
          : [...currentLikes, user.uid];
        
        await updateDoc(commentDoc, { likes: newLikes });
        await fetchComments(postId);
      }
    } catch (error) {
      console.error('Erreur lors du like/unlike du commentaire:', error);
      toast.error('Une erreur est survenue lors du like/unlike du commentaire');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vous devez être connecté pour commenter');
      return;
    }
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const commentsRef = collection(firestore, 'posts', postId, 'comments');
      await addDoc(commentsRef, {
        content: newComment.trim(),
        userId: user.uid,
        createdAt: serverTimestamp(),
        likes: []
      });
      setNewComment('');
      await fetchComments(postId);
      toast.success('Commentaire ajouté avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast.error('Une erreur est survenue lors de l\'ajout du commentaire');
    } finally {
      setIsSubmitting(false);
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

  const fetchComments = async (postId: string) => {
    try {
      const commentsRef = collection(firestore, 'posts', postId, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postComments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Comment[];
      setComments(prev => ({ ...prev, [postId]: postComments }));
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
    }
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;
      try {
        const postsRef = collection(firestore, 'posts');
        const q = query(postsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Post[];
        setPosts(userPosts);
        onPostsCountChange?.(userPosts.length);
        
        // Charger les commentaires et les pseudos pour chaque post
        userPosts.forEach(post => {
          fetchComments(post.id);
          fetchUsername(post.userId);
        });
      } catch (err) {
        setError('Erreur lors du chargement des posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-hive-yellow"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Vous n'avez pas encore créé de posts.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {posts.map((post) => (
        <div key={post.id} className="w-full max-w-[970px] mx-auto bg-white rounded-[32px] border-[2px] border-hive-black p-6 sm:p-8 shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111] h-[700px] overflow-x-hidden">
          <div className="flex flex-col lg:flex-row w-full gap-8 h-full overflow-x-hidden">
            {/* Colonne de gauche - Post */}
            <div className="w-full lg:w-1/2 overflow-x-hidden scrollbar-thin scrollbar-track-transparent">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    {userPhotos[post.userId] ? (
                      <img
                        src={userPhotos[post.userId]!}
                        alt={`Photo de profil de ${usernames[post.userId]}`}
                        className="w-12 h-12 rounded-full border-2 border-hive-black object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-hive-orange border-2 border-hive-black"></div>
                    )}
                    <span className="text-lg font-piepie">@{usernames[post.userId] || post.userId}</span>
                  </div>
                  {user && user.uid === post.userId && (
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
                              onClick={() => {
                                setEditingPostId(post.id);
                                setEditedQuestion(post.question);
                                setEditedDetails(post.details);
                              }}
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
                                    await deletePost(post.id);
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
              {editingPostId === post.id ? (
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
                          await updatePost(post.id, {
                            question: editedQuestion,
                            details: editedDetails
                          });
                          setEditingPostId(null);
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
                        setEditingPostId(null);
                        setEditedQuestion(post.question);
                        setEditedDetails(post.details);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div 
                    className="flex items-center gap-2 text-gray-600 cursor-pointer" 
                    onClick={() => setExpandedPosts(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(post.id)) {
                        newSet.delete(post.id);
                      } else {
                        newSet.add(post.id);
                      }
                      return newSet;
                    })}
                  >
                    <span className="text-base">{expandedPosts.has(post.id) ? 'Afficher moins' : 'Afficher plus'}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-5 h-5 transform transition-transform ${expandedPosts.has(post.id) ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {expandedPosts.has(post.id) && (
                    <div className="mt-4">
                      <p className="text-gray-700">{post.details}</p>
                      <span className="inline-block mt-2 text-sm text-gray-600 font-satoshi">{post.style}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="w-full">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.question}
                    className="w-full aspect-square object-cover rounded-lg border-2 border-hive-black"
                  />
                )}
              </div>
            </div>

            {/* Colonne de droite - Commentaires */}
            <div className="w-full lg:w-1/2 flex flex-col h-full">
              <div className="flex-grow overflow-y-auto">
                {comments[post.id]?.map((comment) => (
                  <div key={comment.id} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        {userPhotos[comment.userId] ? (
                          <img
                            src={userPhotos[comment.userId]!}
                            alt={`Photo de profil de ${usernames[comment.userId]}`}
                            className="w-10 h-10 rounded-full object-cover border-2 border-hive-black"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-hive-pink border-2 border-hive-black"></div>
                        )}
                        <span className="font-piepie">{usernames[comment.userId] || comment.userId}</span>
                      </div>
                      <button
                        onClick={() => handleLikeComment(post.id, comment.id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill={comment.likes?.includes(user?.uid || '') ? 'currentColor' : 'none'}
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
              <form onSubmit={(e) => handleSubmitComment(e, post.id)} className="mt-auto relative">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="w-full p-3 border-2 border-hive-black rounded-xl resize-none shadow-[0_3px_0_0_#111111] focus:outline-none focus:border-hive-black focus:bg-hive-yellow"
                    rows={3}
                    disabled={isSubmitting}
                  />
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="absolute bottom-3 right-3 p-2 text-hive-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsTab;