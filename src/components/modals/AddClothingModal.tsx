import React from 'react';
import { Dialog } from '@headlessui/react';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

interface AddClothingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; category: string; imageUrl: string; userId: string }) => void;
}

const CLOTHING_CATEGORIES = [
  'Hauts',
  'Bas',
  'Robes',
  'Vestes',
  'Chaussures',
  'Accessoires'
];

const AddClothingModal: React.FC<AddClothingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState(CLOTHING_CATEGORIES[0]);
  const [image, setImage] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !image) return;

    try {
      setIsSubmitting(true);
      const imageUrl = await uploadImageToCloudinary(image);
      
      await onSubmit({
        name,
        category,
        imageUrl,
        userId: 'user?.uid!', // À remplacer par l'ID de l'utilisateur actuel
      });

      onClose();
      // Réinitialiser le formulaire
      setName('');
      setCategory(CLOTHING_CATEGORIES[0]);
      setImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Erreur lors de l'ajout du vêtement :", error);
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
              <label className="block text-sm font-bold uppercase mb-2">Catégorie:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-black focus:outline-none focus:border-pink-500"
              >
                {CLOTHING_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-2">Image:</label>
              <input
                type="file"
                id="image-input"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="image-input"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${dragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-500'}`}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                ) : (
                  <>
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Glissez une image ou cliquez pour sélectionner</p>
                  </>
                )}
              </label>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg border-2 border-black shadow-[0_4px_0_#000000] hover:translate-y-[2px] hover:shadow-none transition-all duration-200"
                disabled={!name || !image || isSubmitting}
              >
                Ajouter
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddClothingModal;