import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../firebase/firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ProfileCard from '../components/ui/ProfileCard';
import WardrobeTab from '../components/tabs/WardrobeTab';
import LooksTab from '../components/tabs/LooksTab';
import PostsTab from '../components/tabs/PostsTab';
import { useWardrobe } from '../hooks/useWardrobe';
import { getUserProfile, updateUserProfile } from '../firebase/users';
import { getUserLooks } from '../firebase/looks';
import { toast } from 'react-hot-toast';
import EditProfileModal from '../components/modals/EditProfileModal';
import { User } from '../types';

interface ProfileProps {
  userId?: string;
}

const Profile: FC<ProfileProps> = ({ userId: propUserId }) => {
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'wardrobe' | 'looks' | 'posts'>('looks');
  const [username, setUsername] = useState('');
  const [postsCount, setPostsCount] = useState(0);
  const [looksCount, setLooksCount] = useState(0);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const location = useLocation();

  const targetUserId = paramUserId || propUserId || user?.uid;
  const isOwnProfile = user?.uid === targetUserId;

  const { wardrobeItems } = useWardrobe({ targetUserId });
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['wardrobe', 'looks', 'posts'].includes(hash)) {
      setSelectedTab(hash as 'wardrobe' | 'looks' | 'posts');
    }
  }, [location]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!targetUserId) return;
      try {
        const profile = await getUserProfile(targetUserId);
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
  }, [targetUserId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!targetUserId) return;

      try {
        // Récupérer les looks
        const userLooks = await getUserLooks(targetUserId);
        setLooksCount(userLooks.length);

        // Récupérer les posts
        const postsRef = collection(firestore, 'posts');
        const q = query(postsRef, where('userId', '==', targetUserId));
        const querySnapshot = await getDocs(q);
        setPostsCount(querySnapshot.docs.length);
      } catch (error) {
        console.error('Erreur lors du chargement initial des données:', error);
        toast.error('Erreur lors du chargement des données');
      }
    };

    fetchInitialData();
  }, [targetUserId]);

  const handleEditProfile = async (data: { username: string; bio: string; photoURL: string }) => {
    if (!user || !isOwnProfile) return;

    try {
      await updateUserProfile(user.uid, {
        username: data.username,
        bio: data.bio,
        photoURL: data.photoURL
      });

      setUserProfile(prev => prev ? {
        ...prev,
        username: data.username,
        bio: data.bio,
        photoURL: data.photoURL
      } : null);
      setUsername(data.username);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  const handleLogout = async () => {
    if (!isOwnProfile) return;
    
    try {
      setLoading(true);
      await signOut(auth);
      navigate('/login');
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setLoading(false);
    }
  };

  if (!targetUserId) {
    navigate('/login');
    return null;
  }

  return (
    <div className="bg-hive-pale min-h-screen max-w-[1400px] container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-12">
      <div className="flex flex-col items-center gap-8">
        <ProfileCard
          name={username || userProfile?.email?.split('@')[0] || 'Utilisateur'}
          bio={userProfile?.bio || "Bienvenue sur mon profil HiveLooks ! Je suis passionné(e) par la mode et le style."}
          imageSrc={userProfile?.photoURL || "/images/default-avatar.svg"}
          buttonText={loading ? 'Déconnexion...' : 'Se déconnecter'}
          onButtonClick={handleLogout}
          onEditClick={() => isOwnProfile && setIsEditProfileModalOpen(true)}
          showActions={isOwnProfile}
        />

        {userProfile && isOwnProfile && (
          <EditProfileModal
            isOpen={isEditProfileModalOpen}
            onClose={() => setIsEditProfileModalOpen(false)}
            user={userProfile}
            onSubmit={handleEditProfile}
          />
        )}

        {/* Onglets de navigation */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[800px]">
          <button
            onClick={() => {
              setSelectedTab('wardrobe');
              window.location.hash = 'wardrobe';
            }}
            className={`w-full bg-white rounded-lg border-2 border-black p-4 transition-all duration-200 ${selectedTab === 'wardrobe' ? 'shadow-none' : 'shadow-[0_4px_0_0_#111111] hover:translate-y-[4px] hover:shadow-none'}`}
          >
            <div className="flex items-center gap-2 justify-center">
              <span className={`font-satoshi font-bold ${selectedTab === 'wardrobe' ? 'text-hive-pink' : ''}`}>{wardrobeItems.length}</span>
              <span>Garde-robe</span>
            </div>
          </button>
          <button
            onClick={() => {
              setSelectedTab('looks');
              window.location.hash = 'looks';
            }}
            className={`w-full bg-white rounded-lg border-2 border-black p-4 transition-all duration-200 ${selectedTab === 'looks' ? 'shadow-none' : 'shadow-[0_4px_0_0_#111111] hover:translate-y-[4px] hover:shadow-none'}`}
          >
            <div className="flex items-center gap-2 justify-center">
              <span className={`font-satoshi font-bold ${selectedTab === 'looks' ? 'text-hive-pink' : ''}`}>{looksCount}</span>
              <span>Looks</span>
            </div>
          </button>
          <button
            onClick={() => {
              setSelectedTab('posts');
              window.location.hash = 'posts';
            }}
            className={`w-full bg-white rounded-lg border-2 border-black p-4 transition-all duration-200 ${selectedTab === 'posts' ? 'shadow-none' : 'shadow-[0_4px_0_0_#111111] hover:translate-y-[4px] hover:shadow-none'}`}
          >
            <div className="flex items-center gap-2 justify-center">
              <span className={`font-satoshi font-bold ${selectedTab === 'posts' ? 'text-hive-pink' : ''}`}>{postsCount}</span>
              <span>Posts</span>
            </div>
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="w-full">
          {selectedTab === 'wardrobe' && <WardrobeTab isOwnProfile={isOwnProfile} userId={targetUserId} />}
          {selectedTab === 'looks' && <LooksTab userId={targetUserId} />}
          {selectedTab === 'posts' && <PostsTab userId={targetUserId} />}
        </div>
      </div>
    </div>
  );
};

export default Profile;