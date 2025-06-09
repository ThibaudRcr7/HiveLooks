import React from 'react';
import { Dialog } from '@headlessui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase-config';
import { uploadImageToCloudinary } from '../../utils/cloudinary';
import { ClothingCategory } from '../../types/clothing';

interface AddClothingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; category: ClothingCategory; imageUrl: string; userId: string; description: string }) => void;
}

const CLOTHING_CATEGORIES = [
  ClothingCategory.TSHIRT,
  ClothingCategory.PULL,
  ClothingCategory.SWEATSHIRT,
  ClothingCategory.CHEMISE,
  ClothingCategory.PANTALON,
  ClothingCategory.SHORT,
  ClothingCategory.JUPE,
  ClothingCategory.ROBE,
  ClothingCategory.VESTE,
  ClothingCategory.MANTEAU,
  ClothingCategory.CARDIGAN,
  ClothingCategory.ACCESSOIRE,
  ClothingCategory.CHAUSSURES
];

const AddClothingModal: React.FC<AddClothingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [user] = useAuthState(auth);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState(CLOTHING_CATEGORIES[0]);
  const [image, setImage] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Nettoyer l'URL de prévisualisation quand le composant est démonté
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (!e.dataTransfer.files || !e.dataTransfer.files[0]) {
      setError('Aucun fichier n\'a été déposé');
      return;
    }

    handleFile(e.dataTransfer.files[0]);
  };

  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleFile = (file: File) => {
    setError(null);

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError(`Type de fichier non supporté. Types acceptés: ${ALLOWED_FILE_TYPES.join(', ')}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('La taille du fichier ne doit pas dépasser 2 Mo');
      return;
    }

    setImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !category) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    if (!image) {
      setError('Veuillez sélectionner une image');
      return;
    }

    if (!user) {
      setError('Vous devez être connecté pour ajouter un vêtement');
      return;
    }

    try {
      setIsSubmitting(true);
      let imageUrl: string;

      try {
        imageUrl = await uploadImageToCloudinary(image);
        if (!imageUrl) {
          throw new Error('L\'URL de l\'image est invalide');
        }
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image:', error);
        setError(error instanceof Error 
          ? error.message 
          : 'L\'image n\'a pas pu être envoyée. Veuillez vérifier le format du fichier ou réessayer plus tard.');
        return;
      }

      try {
        await onSubmit({
          name,
          category,
          imageUrl,
          description,
          userId: user.uid
        });

        onClose();
        // Réinitialiser le formulaire
        setName('');
        setCategory(CLOTHING_CATEGORIES[0]);
        setDescription('');
        setImage(null);
        setPreviewUrl(null);
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement dans Firestore:', error);
        setError('Une erreur est survenue lors de l\'enregistrement du vêtement. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-xl border-2 border-black shadow-[8px_8px_0_0_#000000] p-6">
          <Dialog.Title className="text-2xl font-bold mb-4">Ajouter un vêtement</Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold uppercase mb-2">Nom du vêtement:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-black focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-2">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-black focus:outline-none focus:border-pink-500 min-h-[100px]"
                placeholder="Décrivez votre vêtement..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-2">Catégorie:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CLOTHING_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 text-sm rounded-lg border-2 transition-all duration-200 ${category === cat 
                      ? 'bg-hive-pink text-black border-hive-black' 
                      : 'bg-white text-hive-black border-hive-black/30 hover:border-hive-pink'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-2">Image:</label>
              <input
                type="file"
                id="image-input"
                accept={ALLOWED_FILE_TYPES.join(',')}
                onChange={(e) => {
                  setError(null);
                  if (e.target.files?.[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="image-input"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${dragActive ? 'border-hive-pink bg-hive-pink/10' : 'border-hive-black/30 hover:border-hive-pink'}`}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                ) : (
                  <>
                    <svg className="w-12 h-12 text-hive-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="mt-2 text-sm text-hive-black/50">Glissez une image ou cliquez pour sélectionner</p>
                  </>
                )}
              </label>
            </div>

            {error && (
              <div className="p-4 mb-4 text-sm text-hive-pink bg-hive-pink/10 rounded-lg" role="alert">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-hive-black/70 hover:text-hive-black"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg border-2 border-black shadow-[0_4px_0_#000000] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!name || !image || isSubmitting}
              >
                {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddClothingModal;