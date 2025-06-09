import { useState, useEffect, FC } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Post as PostType, Comment, addComment, toggleCommentLike, updatePost, deletePost } from '../firebase/posts';
import { toast } from 'react-hot-toast';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { firestore } from '../firebase/firebase-config';
import { Menu } from '@headlessui/react';
import { getUserProfile } from '../firebase/users';
import ImageModal from './ImageModal';
import CaretCircleDown from '../assets/images/icons/caret-circle-down.svg';
import CaretCircleUp from '../assets/images/icons/caret-circle-up.svg';
import Heart from '../assets/images/icons/heart.svg';
import HeartFill from '../assets/images/icons/heart-fill.svg';
import PaperPlaneRight from '../assets/images/icons/paper-plane-right.svg';

interface PostProps {
  post: PostType & { tags: string[] };
  onDelete?: (postId: string) => void;
}

export const Post: FC<PostProps> = ({ post, onDelete }) => {
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

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

  const handleLike = async () => {
    if (!currentUser) {
      toast.error('Vous devez être connecté pour liker le post');
      return;
    }

    try {
      await toggleCommentLike(post.id!, '', currentUser.uid);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Erreur lors du like/unlike du post:', error);
      toast.error('Une erreur est survenue lors du like/unlike du post');
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
                  {currentUser?.uid === post.userId && (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
                              deletePost(post.id!);
                              onDelete?.(post.id!);
                            }
                          }}
                          className={`${active ? 'bg-hive-pale' : ''} w-full text-left px-4 py-2 text-sm text-red-500`}
                        >
                          Supprimer
                        </button>
                      )}
                    </Menu.Item>
                  )}
                </Menu.Items>
              </Menu>
            </div>
          </div>

          {isEditing ? (
            <div className="mb-6">
              <input
                type="text"
                value={editedQuestion}
                onChange={(e) => setEditedQuestion(e.target.value)}
                className="w-full mb-4 px-4 py-2 border border-hive-black/30 rounded-lg focus:ring-2 focus:ring-hive-purple focus:border-transparent"
              />
              <textarea
                value={editedDetails}
                onChange={(e) => setEditedDetails(e.target.value)}
                className="w-full px-4 py-2 border border-hive-black/30 rounded-lg focus:ring-2 focus:ring-hive-purple focus:border-transparent"
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
                  className="px-4 py-2 bg-hive-pale text-hive-black rounded-lg hover:bg-hive-pale/80"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-hive-black/60 cursor-pointer" onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}>
                <span className={`text-base transition-colors duration-300 ${!isDetailsExpanded ? 'text-hive-yellow' : ''}`}>
                  {isDetailsExpanded ? 'Afficher moins' : 'Afficher plus'}
                </span>
                <img 
                  src={isDetailsExpanded ? CaretCircleUp : CaretCircleDown} 
                  alt={isDetailsExpanded ? "Afficher moins" : "Afficher plus"}
                  className={`w-5 h-5 transition-all duration-300 ${isDetailsExpanded ? 'rotate-180 [filter:brightness(0)_opacity(60%)]' : '[filter:invert(67%)_sepia(51%)_saturate(1021%)_hue-rotate(358deg)_brightness(101%)_contrast(101%)]'}`}
                />
              </div>
              {isDetailsExpanded && (
                <div className="mt-4">
                  <p className="text-hive-black/70 text-lg leading-relaxed whitespace-pre-wrap mb-4">{post.details}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag) => (
                        <button
                          key={tag}
                          className="px-3 py-1.5 text-sm font-bold rounded-lg bg-white text-hive-black border border-hive-black/30 hover:bg-[#FFFDE3] transition-all duration-200"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="w-full">
            <img
              src={post.imageUrl}
              alt={post.question}
              className="w-full aspect-square object-cover rounded-lg border-2 border-hive-black cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setIsImageModalOpen(true)}
            />
          </div>
        </div>

        {/* Colonne de droite - Commentaires */}
        <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto scrollbar-thin scrollbar-track-transparent">
          <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-track-transparent">
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
                    className={`flex items-center gap-1 text-sm ${comment.likes?.includes(currentUser?.uid || '') ? 'text-hive-yellow' : 'text-hive-black/60'}`}
                  >
                    <img 
                      src={comment.likes?.includes(currentUser?.uid || '') ? HeartFill : Heart} 
                      alt="Like" 
                      className={`w-5 h-5 transition-all duration-300 ${comment.likes?.includes(currentUser?.uid || '') ? 'scale-110 [filter:invert(67%)_sepia(51%)_saturate(1021%)_hue-rotate(358deg)_brightness(101%)_contrast(101%)]' : '[filter:brightness(0)_opacity(60%)]'}`}
                    />
                    <span>{comment.likes?.length || 0}</span>
                  </button>
                </div>
                <p className="text-sm text-hive-black/70 ml-14">{comment.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmitComment} className="mt-auto relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (comment.trim()) {
                    handleSubmitComment(e);
                  }
                }
              }}
              placeholder="Ajouter un commentaire..."
              className="w-full p-3 border-2 border-hive-black rounded-xl resize-none shadow-[0_3px_0_0_#111111] focus:outline-none focus:border-hive-black focus:bg-hive-yellow"
              rows={3}
            />
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="absolute bottom-3 right-3 p-2 text-hive-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src={PaperPlaneRight} alt="Envoyer" className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={post.imageUrl}
        alt={post.question}
      />
    </div>
  );
};

export default Post;