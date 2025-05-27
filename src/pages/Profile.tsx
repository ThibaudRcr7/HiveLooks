import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';
import ProfileCard from '../components/ui/ProfileCard';
import WardrobeTab from '../components/tabs/WardrobeTab';
import LooksTab from '../components/LooksTab';
import PostsTab from '../components/tabs/PostsTab';
import { useWardrobe } from '../hooks/useWardrobe';
import { getUserProfile, updateUserProfile } from '../firebase/users';
import { toast } from 'react-hot-toast';
import EditProfileModal from '../components/modals/EditProfileModal';
import { User } from '../types';

const Profile: FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'wardrobe' | 'looks' | 'posts'>('wardrobe');
  const [username, setUsername] = useState('');
  const [postsCount, setPostsCount] = useState(0);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const { wardrobeItems } = useWardrobe();
  const location = useLocation();

  // Persistance de l'onglet sélectionné via l'URL
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['wardrobe', 'looks', 'posts'].includes(hash)) {
      setSelectedTab(hash as 'wardrobe' | 'looks' | 'posts');
    }
  }, [location]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          const userProfileData: User = {
            ...profile,
            id: profile.id
          };
          setUserProfile(userProfileData);
          setUsername(profile.username);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        toast.error('Erreur lors de la récupération du profil');
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleEditProfile = async (data: { username: string; bio: string; photoURL: string }) => {
    if (!user) return;

    try {
      await updateUserProfile(user.uid, {
        username: data.username,
        bio: data.bio,
        photoURL: data.photoURL
      });

      // Mise à jour du state local
      setUserProfile(prev => prev ? {
        ...prev,
        username: data.username,
        bio: data.bio,
        photoURL: data.photoURL
      } : null);
      setUsername(data.username);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  };



  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-[1400px] container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-12">
        <div className="flex flex-col items-center gap-8">
          <ProfileCard
            name={username || user?.email?.split('@')[0] || 'Utilisateur'}
            bio={userProfile?.bio || "Bienvenue sur mon profil HiveLooks ! Je suis passionné(e) par la mode et le style."}
            imageSrc={userProfile?.photoURL || "/images/default-avatar.svg"}
            buttonText="Se déconnecter"
            onButtonClick={handleLogout}
            onEditClick={() => setIsEditProfileModalOpen(true)}
          />

          {userProfile && (
            <EditProfileModal
              isOpen={isEditProfileModalOpen}
              onClose={() => setIsEditProfileModalOpen(false)}
              user={userProfile}
              onSubmit={handleEditProfile}
            />
          )}

          {showAccountInfo && (
            <div className="w-[400px] bg-white rounded-lg border-2 border-black shadow-[4px_4px_0_#000000] p-6 space-y-4">
              <h3 className="font-satoshi font-bold text-xl">Informations du compte</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Utilisateur</label>
                <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">{user?.uid}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {user?.emailVerified ? 'Vérifié' : 'Non vérifié'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dernière connexion</label>
                <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {user?.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>
          )}
          {/* Onglets de navigation */}
          <div className="w-full max-w-[600px] flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                setSelectedTab('wardrobe');
                window.location.hash = 'wardrobe';
              }}
              className={`w-full bg-white rounded-lg border-2 border-black p-4 transition-all duration-200 ${selectedTab === 'wardrobe' ? 'bg-black shadow-none' : 'shadow-[0_4px_0_0_#111111] hover:translate-y-[4px] hover:shadow-none'}`}
            >
              <div className="flex items-center gap-2 justify-center">
                <span className={`font-satoshi font-bold ${selectedTab === 'wardrobe' ? 'text-pink-500' : ''}`}>{wardrobeItems.length}</span>
                <span>Garde-robe</span>
              </div>
            </button>
            <button
              onClick={() => {
                setSelectedTab('looks');
                window.location.hash = 'looks';
              }}
              className={`w-full bg-white rounded-lg border-2 border-black p-4 transition-all duration-200 ${selectedTab === 'looks' ? 'bg-black shadow-none' : 'shadow-[0_4px_0_0_#111111] hover:translate-y-[4px] hover:shadow-none'}`}
            >
              <div className="flex items-center gap-2 justify-center">
                <span className={`font-satoshi font-bold ${selectedTab === 'looks' ? 'text-pink-500' : ''}`}>8</span>
                <span>Looks</span>
              </div>
            </button>
            <button
              onClick={() => {
                setSelectedTab('posts');
                window.location.hash = 'posts';
              }}
              className={`w-full bg-white rounded-lg border-2 border-black p-4 transition-all duration-200 ${selectedTab === 'posts' ? 'bg-black shadow-none' : 'shadow-[0_4px_0_0_#111111] hover:translate-y-[4px] hover:shadow-none'}`}
            >
              <div className="flex items-center gap-2 justify-center">
                <span className={`font-satoshi font-bold ${selectedTab === 'posts' ? 'text-pink-500' : ''}`}>{postsCount}</span>
                <span>Posts</span>
              </div>
            </button>
          </div>

          {/* Contenu des onglets avec transition */}
          <div className="w-full animate-fadeIn">
            {selectedTab === 'wardrobe' && <WardrobeTab />}
            {selectedTab === 'looks' && user && <LooksTab userId={user.uid} />}
            {selectedTab === 'posts' && <PostsTab onPostsCountChange={setPostsCount} />}
          </div>
        </div>
      </div>
  );
};

export default Profile;