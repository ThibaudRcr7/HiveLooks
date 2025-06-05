import { FC, useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../firebase/firebase-config';
import { Post as PostComponent } from '../../components/Post';

interface Post {
  id: string;
  userId: string;
  question: string;
  details: string;
  style: string;
  imageUrl: string;
  createdAt: Date;
  likes: string[];
  tags: string[];
}

interface PostsTabProps {
  userId?: string;
  onPostsCountChange?: (count: number) => void;
}

const PostsTab: FC<PostsTabProps> = ({ userId, onPostsCountChange }) => {
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsRef = collection(firestore, 'posts');
        const q = query(
          postsRef,
          where('userId', '==', userId || user?.uid)
        );
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Post[];
        setPosts(postsData);
        if (onPostsCountChange) {
          onPostsCountChange(postsData.length);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        setError('Une erreur est survenue lors du chargement des posts');
      } finally {
        setLoading(false);
      }
    };

    if (user || userId) {
      fetchPosts();
    }
  }, [user, userId]);



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hive-purple"></div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-[200px] text-red-500">{error}</div>;
  }

  if (!posts.length) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">
          {userId === user?.uid
            ? "Vous n'avez pas encore publié de posts."
            : "Cet utilisateur n'a pas encore publié de posts."}
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun post disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {posts.map(post => (
        <PostComponent 
          key={post.id} 
          post={post} 
          onDelete={(postId) => {
            const updatedPosts = posts.filter(p => p.id !== postId);
            setPosts(updatedPosts);
            onPostsCountChange?.(updatedPosts.length);
          }}
        />
      ))}
    </div>
  );
};

export default PostsTab;