import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import { createLook } from '../firebase/looks';

interface LookFormData {
  title: string;
  description: string;
  imageUrl: string;
  style: string;
}

const CreateLook = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<LookFormData>({
    title: '',
    description: '',
    imageUrl: '',
    style: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Vous devez être connecté pour créer un look');
      return;
    }

    try {
      setLoading(true);
      const lookData = {
        ...formData,
        userId: currentUser.uid
      };

      await createLook(lookData);
      toast.success('Look créé avec succès !');
      navigate('/profile#looks');
    } catch (error) {
      console.error('Erreur lors de la création du look:', error);
      toast.error('Une erreur est survenue lors de la création du look');
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
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto bg-white rounded-[32px] border-[2px] border-hive-black shadow-[8px_8px_0_0_#906CFE,_8px_8px_0_2px_#111111] p-6">
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 space-y-6">
            <div className="h-full flex flex-col items-center justify-center">
              <label
                htmlFor="image"
                className="inline-block px-6 py-3 bg-hive-purple text-hive-black font-bold text-base md:text-lg rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200 cursor-pointer mb-4"
              >
                Choisir une photo
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                required
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Aperçu"
                  className="w-full h-[300px] object-cover rounded-lg border-2 border-hive-black"
                />
              )}
            </div>
          </div>

          <div className="md:w-1/2 space-y-6">
            <div>
              <label htmlFor="style" className="block font-bold mb-2">
                Style de la tenue
              </label>
              <input
                type="text"
                id="style"
                value={formData.style}
                onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border-2 border-hive-black focus:outline-none focus:ring-2 focus:ring-hive-pink"
                placeholder="#casual ou #streetwear"
                required
              />
            </div>

            <div>
              <label htmlFor="title" className="block font-bold mb-2">
                Titre du post
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border-2 border-hive-black focus:outline-none focus:ring-2 focus:ring-hive-pink"
                placeholder="Donnez un titre à votre look"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block font-bold mb-2">
                Donne une petite description !
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border-2 border-hive-black focus:outline-none focus:ring-2 focus:ring-hive-pink min-h-[120px]"
                placeholder="Décrivez votre look"
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-hive-purple text-black font-bold text-base md:text-lg rounded-lg border border-hive-black shadow-[0_3px_0_0_#111111] hover:translate-y-[3px] hover:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création en cours...' : 'Créer le look'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLook;