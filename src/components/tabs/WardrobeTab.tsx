import React, { useState } from 'react';
import { WardrobeItem } from '../../types/clothing';
import AddClothingModal from '../modals/AddClothingModal';
import WardrobeItemModal from '../modals/WardrobeItemModal';
import EditWardrobeItemModal from '../modals/EditWardrobeItemModal';
import { useWardrobe } from '../../hooks/useWardrobe';

const WardrobeTab: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { wardrobeItems, isLoading, error, addItem, deleteItem, updateItem } = useWardrobe();

  if (isLoading) {
    return <div className="flex justify-center items-center p-8">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 text-red-500">
        Une erreur est survenue lors du chargement de la garde-robe
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end px-4">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-hive-pink text-black font-bold rounded-lg border-2 border-hive-black shadow-[0_3px_0_0_#111111] px-4 py-2 hover:translate-y-[3px] hover:shadow-none transition-all duration-200 flex items-center gap-2"
        >
          <span>Ajouter un vêtement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {wardrobeItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0_#000000] p-4 relative group cursor-pointer"
            onClick={() => {
              setSelectedItem(item);
              setIsViewModalOpen(true);
            }}
          >
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h3 className="font-piepie text-lg">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.category}</p>
          </div>
        ))}
      </div>

      <AddClothingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addItem}
      />

      <WardrobeItemModal
        item={selectedItem}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedItem(null);
        }}
        onEdit={(item) => {
          setIsViewModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={(item) => deleteItem(item.id!)}
      />

      {selectedItem && (
        <EditWardrobeItemModal
          item={selectedItem}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          onSubmit={updateItem}
        />
      )}
    </div>
  );
};

export default WardrobeTab;