import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase/firebase-config';
import { toast } from 'react-hot-toast';
import { uploadImageToCloudinary } from '../utils/cloudinary';

interface PostFormData {
  style: string;
  question: string;
  details: string;
  imageUrl: string;
}

const CreatePost = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<PostFormData>({
    style: '',
    question: '',
    details: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Vous devez être connecté pour créer un post');
      return;
    }

    try {
      setLoading(true);
      const postData = {
        ...formData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        likes: []
      };

      await addDoc(collection(firestore, 'posts'), postData);
      toast.success('Post créé avec succès !');
      navigate('/profile');
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
      toast.error('Une erreur est survenue lors de la création du post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const imageUrl = await uploadImageToCloudinary(file);
        setFormData(prev => ({ ...prev, imageUrl }));
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image:', error);
        toast.error('Une erreur est survenue lors de l\'upload de l\'image');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl mb-8 uppercase text-center">Créer un nouveau post</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne de gauche - Aperçu de l'image */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full aspect-square max-w-md overflow-hidden rounded-2xl border-2 border-hive-black shadow-lg bg-white">
            {formData.imageUrl ? (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gray-50">
                <svg
                  className="w-16 h-16 text-gray-400 mb-4"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-gray-500 text-center mb-4">Sélectionnez une photo de votre tenue</p>
              </div>
            )}
          </div>
          <label className="inline-flex items-center px-4 py-2 border-2 border-hive-black rounded-xl bg-hive-pink shadow-[0_3px_0_0_#111111] cursor-pointer transition-all duration-200 hover:translate-y-[3px] hover:shadow-none">
            <span className="text-hive-black font-bold font-satoshi">Télécharger une photo</span>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Colonne de droite - Formulaire */}
        <div className="flex flex-col space-y-6">
          <div>
            <label htmlFor="style" className="block text-sm font-bold font-satoshi text-black mb-2">
              Style
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">#</span>
              <input
                type="text"
                id="style"
                value={formData.style}
                onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                className="block w-full pl-8 pr-3 py-2 rounded-xl border-2 border-hive-black shadow-sm focus:ring-2 focus:ring-hive-pink focus:border-hive-pink"
                placeholder="vintage"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="question" className="block text-sm font-bold font-satoshi text-black mb-2">
              Pose ta question !
            </label>
            <input
              type="text"
              id="question"
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              className="block w-full px-3 py-2 rounded-xl border-2 border-hive-black shadow-sm focus:ring-2 focus:ring-hive-pink focus:border-hive-pink"
              placeholder="Que pensez-vous de cette tenue ?"
              required
            />
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-bold font-satoshi text-black mb-2">
              Donne un peu plus de détails !
            </label>
            <textarea
              id="details"
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              rows={4}
              className="block w-full px-3 py-2 rounded-xl border-2 border-hive-black shadow-sm focus:ring-2 focus:ring-hive-pink focus:border-hive-pink resize-none"
              placeholder="Décrivez votre tenue et ce que vous souhaitez savoir..."
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-hive-pink text-hive-black font-bold rounded-xl border-2 border-hive-black shadow-[0_3px_0_0_#111111] hover:bg-hive-pink/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hive-pink ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:translate-y-[3px] hover:shadow-none'}`}
            >
              {loading ? 'Création en cours...' : 'Envoyer le post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;