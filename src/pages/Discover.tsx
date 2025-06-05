import { useEffect, useState } from 'react';
import { getAllPosts, Post as PostType } from '../firebase/posts';
import { getAllLooks, Look as LookType } from '../firebase/looks';
import Post from '../components/Post';
import Look from '../components/Look';
import Tag from '../components/common/Tag';
import { toast } from 'react-hot-toast';

const Discover = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [looks, setLooks] = useState<LookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [popularTags, setPopularTags] = useState<{tag: string; count: number; isLookTag: boolean}[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [fetchedPosts, fetchedLooks] = await Promise.all([
          getAllPosts(),
          getAllLooks()
        ]);
        setPosts(fetchedPosts);
        setLooks(fetchedLooks);

        // Calculer les tags populaires et leur type depuis les posts et les looks
        const tagInfo = {} as Record<string, { count: number; postCount: number; lookCount: number }>;
        
        // Compter les tags des posts
        fetchedPosts.forEach(post => {
          if (post.tags) {
            post.tags.forEach(tag => {
              if (!tagInfo[tag]) {
                tagInfo[tag] = { count: 0, postCount: 0, lookCount: 0 };
              }
              tagInfo[tag].count++;
              tagInfo[tag].postCount++;
            });
          }
        });
        
        // Compter les tags des looks
        fetchedLooks.forEach(look => {
          if (look.tags) {
            look.tags.forEach(tag => {
              if (!tagInfo[tag]) {
                tagInfo[tag] = { count: 0, postCount: 0, lookCount: 0 };
              }
              tagInfo[tag].count++;
              tagInfo[tag].lookCount++;
            });
          }
        });

        const sortedTags = Object.entries(tagInfo)
          .sort(([, a], [, b]) => b.count - a.count)
          .slice(0, 3)
          .map(([tag, info]) => ({
            tag,
            count: info.count,
            isLookTag: info.lookCount > info.postCount
          }));

        setPopularTags(sortedTags);
      } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        toast.error('Une erreur est survenue lors du chargement des posts');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const filteredContent = [...posts, ...looks].filter(item => {
    const title = 'title' in item ? item.title : item.question;
    const description = 'description' in item ? item.description : item.details;
    const search = searchQuery.toLowerCase();
    const matchesSearch = title.toLowerCase().includes(search) ||
                         description.toLowerCase().includes(search);
    
    // Vérifier si l'élément correspond au tag sélectionné
    if (selectedTag) {
      // Extraire le tag sans le compte entre parenthèses
      const cleanTag = selectedTag.split(' (')[0];
      if ('tags' in item && Array.isArray(item.tags)) {
        return matchesSearch && item.tags.includes(cleanTag);
      }
      return false; // Si pas de tags, ne pas inclure dans les résultats filtrés
    }
    
    return matchesSearch; // Si pas de tag sélectionné, filtrer uniquement sur la recherche
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

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
          <div className="mb-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-piepie tracking-wider relative inline-block">
              <span className="text-hive-black [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] absolute top-1 z-0">DÉCOUVRIR</span>
              <span className="text-hive-pale [text-shadow:_-2px_-2px_0_#111111,_2px_-2px_0_#111111,_-2px_2px_0_#111111,_2px_2px_0_#111111] relative z-10">DÉCOUVRIR</span>
            </h1>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher des posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-hive-black/30 rounded-lg focus:ring-2 focus:ring-hive-purple focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-hive-black/40"
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
          <div className="mt-4 mb-6">
            {popularTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {popularTags.map(({ tag, count }) => (
                  <Tag
                    key={tag}
                    tag={`${tag} (${count})`}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    isSelected={selectedTag === tag}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-hive-black/50 italic">Aucun tag populaire pour le moment.</p>
            )}
          </div>
        </div>

        <div className="grid gap-8">
          {filteredContent.length > 0 ? (
            filteredContent.map((item) => (
              'question' in item ? (
                <Post key={item.id} post={item as PostType} />
              ) : (
                <Look key={item.id} look={item as LookType} />
              )
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-hive-black/50">
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