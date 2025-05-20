import { useEffect, useState } from 'react';
import { getAllPosts, Post as PostType, deletePost } from '../firebase/posts';
import Post from '../components/Post';
import { toast } from 'react-hot-toast';

const Discover = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        toast.error('Une erreur est survenue lors du chargement des posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const title = post.title ?? '';
    const description = post.description ?? '';
    const search = searchQuery ?? '';
    
    return title.toLowerCase().includes(search.toLowerCase()) ||
           description.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hive-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-4xl w-full mx-auto p-6 flex-grow">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Découvrir</h1>
          <button
            onClick={async () => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer tous les posts ?')) {
                try {
                  await Promise.all(posts.map(post => {
                    if (post.id) {
                      return deletePost(post.id);
                    }
                    return Promise.resolve();
                  }));
                  setPosts([]);
                  toast.success('Tous les posts ont été supprimés avec succès');
                } catch (error) {
                  console.error('Erreur lors de la suppression des posts:', error);
                  toast.error('Une erreur est survenue lors de la suppression des posts');
                }
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Supprimer tous les posts
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher des posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hive-purple focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        </div>

        <div className="grid gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Post key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchQuery
                  ? 'Aucun post ne correspond à votre recherche'
                  : 'Aucun post disponible pour le moment'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;