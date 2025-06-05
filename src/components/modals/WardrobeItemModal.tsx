import React from 'react';
import { WardrobeItem } from '../../types/clothing';

interface WardrobeItemModalProps {
  item: WardrobeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: WardrobeItem) => void;
  onDelete: (item: WardrobeItem) => void;
}

const WardrobeItemModal: React.FC<WardrobeItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl bg-white rounded-lg p-4 mx-4">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-hive-black/50 hover:text-hive-black/70 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Menu contextuel */}
        <div className="absolute top-4 right-16">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-hive-black/50 hover:text-hive-black/70 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-hive-black/20 py-1">
              <button
                onClick={() => {
                  onEdit(item);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-hive-black/70 hover:bg-hive-pale transition-colors"
              >
                Modifier
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer ce vêtement ?')) {
                    onDelete(item);
                    setIsMenuOpen(false);
                    onClose();
                  }
                }}
                className="w-full text-left px-4 py-2 text-hive-pink hover:bg-hive-pale transition-colors"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="mt-8">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full max-h-[70vh] object-contain rounded-lg mb-4"
          />
          <h2 className="text-2xl font-piepie mb-2">{item.name}</h2>
          <p className="text-hive-black/60">{item.category}</p>
        </div>
      </div>
    </div>
  );
};

export default WardrobeItemModal;