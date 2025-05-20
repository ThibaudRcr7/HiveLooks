import { FC, useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
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
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  userId: string;
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
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});

  const fetchUsername = async (userId: string) => {
    try {
      const userProfile = await getUserProfile(userId);
      if (userProfile) {
        setUsernames(prev => ({ ...prev, [userId]: userProfile.username }));
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
        <div key={post.id} className="w-full max-w-[970px] mx-auto bg-white rounded-[32px] border-[2px] border-hive-black p-6 sm:p-8 shadow-[8px_8px_0_0_#FFAF02,_8px_8px_0_2px_#111111]">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Colonne de gauche - Post */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-hive-orange border-2 border-hive-black"></div>
                    <div>
                      <h4 className="text-lg">@{usernames[post.userId] || post.userId}</h4>
                      <h3 className="text-xl font-semibold mt-2">{post.title}</h3>
                    </div>
                  </div>
                  {user && user.uid === post.userId && (
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
                              onClick={() => {
                                setEditingPostId(post.id);
                                setEditedTitle(post.title);
                                setEditedDescription(post.description);
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
              {editingPostId === post.id ? (
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
                          await updatePost(post.id, {
                            title: editedTitle,
                            description: editedDescription
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
                        setEditedTitle(post.title);
                        setEditedDescription(post.description);
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
                    <p className="text-base sm:text-lg mt-4">{post.description}</p>
                  )}
                </div>
              )}
              {post.imageUrl && (
                <div className="w-full">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full aspect-square object-cover rounded-lg border-2 border-hive-black"
                  />
                </div>
              )}
            </div>

            {/* Colonne de droite - Commentaires */}
            <div className="flex-1 flex flex-col gap-4">
              {comments[post.id]?.map((comment) => (
                <div key={comment.id} className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-hive-pink border-2 border-hive-black"></div>
                    <h4 className="font-bold">@{usernames[comment.userId] || comment.userId}</h4>
                  </div>
                  <div className="flex justify-between items-start">
                    <p>{comment.content}</p>
                    <button className="flex items-center gap-1 text-hive-black hover:text-hive-pink transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                      <span>{comment.likes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Zone de réponse */}
              <div className="mt-4 relative">
                <textarea
                  placeholder="Ajoute ton conseil..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-4 rounded-lg border-2 border-hive-black resize-none focus:outline-none focus:ring-2 focus:ring-hive-orange bg-hive-yellow placeholder-hive-black"
                  rows={3}
                />
                <button 
                  onClick={async () => {
                    if (!user || !newComment.trim()) return;
                    try {
                      const commentsRef = collection(firestore, 'posts', post.id, 'comments');
                      await fetchUsername(user.uid);
                      await addDoc(commentsRef, {
                        content: newComment.trim(),
                        userId: user.uid,
                        createdAt: serverTimestamp(),
                        likes: []
                      });
                      setNewComment('');
                      fetchComments(post.id);
                    } catch (err) {
                      console.error('Erreur lors de l\'ajout du commentaire:', err);
                    }
                  }}
                  className="absolute right-4 bottom-4 p-2 text-hive-black hover:text-hive-orange transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsTab;