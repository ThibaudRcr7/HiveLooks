import React, { useState } from 'react';
import { WardrobeItem, ClothingCategory } from '../../types/clothing';

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
  const [category, setCategory] = useState<ClothingCategory>(item.category);
  const [description, setDescription] = useState(item.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(item.id!, {
        name,
        category,
        description,
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
            <label htmlFor="name" className="block text-sm font-medium text-hive-black/70 mb-1">
              Nom
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-hive-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-hive-pink"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-hive-black/70 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-hive-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-hive-pink min-h-[100px]"
              placeholder="Décrivez votre vêtement..."
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-hive-black/70 mb-1">
              Catégorie
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ClothingCategory)}
              className="w-full px-3 py-2 border border-hive-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-hive-pink"
              required
            >
              <option value="tops">Hauts</option>
              <option value="bottoms">Bas</option>
              <option value="dresses">Robes</option>
              <option value="outerwear">Vestes/Manteaux</option>
              <option value="shoes">Chaussures</option>
              <option value="accessories">Accessoires</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-hive-pale text-hive-black font-bold rounded-lg border-2 border-hive-black hover:bg-hive-pale/80 transition-colors"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-hive-pink text-hive-black font-bold rounded-lg border-2 border-hive-black hover:bg-hive-pink/90 transition-colors disabled:opacity-50"
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