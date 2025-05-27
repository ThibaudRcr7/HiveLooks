import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase-config';
import { WardrobeItem, ClothingCategory } from '../types';
import { addWardrobeItem, getWardrobeItems, deleteWardrobeItem, updateWardrobeItem } from '../services/firebase';

export interface WardrobeHook {
  wardrobeItems: WardrobeItem[];
  isLoading: boolean;
  error: Error | null;
  addItem: (item: { name: string; category: ClothingCategory; imageUrl: string }) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  updateItem: (itemId: string, updates: Partial<WardrobeItem>) => Promise<void>;
}

export const useWardrobe = (): WardrobeHook => {
  const [user] = useAuthState(auth);
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadWardrobeItems = async () => {
      if (!user) {
        setWardrobeItems([]);
        setIsLoading(false);
        return;
      }

      if (!user.uid) {
        setError(new Error("Impossible de charger la garde-robe : utilisateur non identifié"));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        setError(null);
        const items = await getWardrobeItems(user.uid);
        if (isMounted) {
          setWardrobeItems(items);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Erreur lors du chargement de la garde-robe. Veuillez réessayer.'));
          setWardrobeItems([]); // Réinitialiser les items en cas d'erreur
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadWardrobeItems();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const addItem = async ({ name, category, imageUrl }: { name: string; category: ClothingCategory; imageUrl: string }) => {
    if (!user) return;

    try {
      // Ajout du vêtement dans Firestore avec l'URL Cloudinary
      const itemId = await addWardrobeItem({
        name,
        category,
        imageUrl,
        userId: user.uid
      });

      const newItem: WardrobeItem = {
        id: itemId,
        name,
        category,
        imageUrl,
        userId: user.uid,
        createdAt: new Date()
      };

      setWardrobeItems(prev => [...prev, newItem]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors de l\'ajout du vêtement'));
      throw err;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await deleteWardrobeItem(itemId);
      setWardrobeItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors de la suppression du vêtement'));
      throw err;
    }
  };

  const updateItem = async (itemId: string, updates: Partial<WardrobeItem>) => {
    try {
      await updateWardrobeItem(itemId, updates);
      setWardrobeItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, ...updates }
            : item
        )
      );
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Erreur lors de la modification du vêtement'));
      throw error;
    }
  };

  return {
    wardrobeItems,
    isLoading,
    error,
    addItem,
    deleteItem,
    updateItem,
  };
};