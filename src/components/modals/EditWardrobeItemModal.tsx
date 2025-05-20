import React, { useState } from 'react';
import { WardrobeItem } from '../../firebase/firestore';

interface EditWardrobeItemModalProps {
  item: WardrobeItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemId: string, updates: Partial<WardrobeItem>) => Promise<void>;
}

const EditWardrobeItemModal: React.FC<EditWardrobeItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(item.id!, {
        name,
        category,
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de la modification du vêtement:', error);
      alert('Une erreur est survenue lors de la modification du vêtement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg p-6 mx-4">
        <h2 className="text-2xl font-piepie mb-6">Modifier le vêtement</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWardrobeItemModal;