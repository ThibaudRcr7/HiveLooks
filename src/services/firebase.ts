import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  serverTimestamp,

} from 'firebase/firestore';
import { firestore as db } from '../firebase/firebase-config';
import { FirestoreService, FirestoreDocument, Post, WardrobeItem } from '../types';

export const firestoreService: FirestoreService = {
  getDocument: async <T extends FirestoreDocument>(collectionName: string, id: string): Promise<T | null> => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    } as T;
  },

  setDocument: async <T extends FirestoreDocument>(collectionName: string, id: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  updateDocument: async <T extends FirestoreDocument>(collectionName: string, id: string, data: Partial<Omit<T, 'id'>>): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  deleteDocument: async (collectionName: string, id: string): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  },

  queryDocuments: async <T extends FirestoreDocument>(collectionName: string, constraints: QueryConstraint[]): Promise<T[]> => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as T;
    });
  }
};

// Fonctions utilitaires pour les requêtes courantes
export const getRecentPosts = async (limitCount: number = 10): Promise<Post[]> => {
  return firestoreService.queryDocuments<Post>('posts', [
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  ]);
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  return firestoreService.queryDocuments<Post>('posts', [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ]);
};

// Fonctions de gestion de la garde-robe
export const addWardrobeItem = async (item: Omit<WardrobeItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const itemId = crypto.randomUUID();
  await firestoreService.setDocument<WardrobeItem>('wardrobe', itemId, item);
  return itemId;
};

export const getWardrobeItems = async (userId: string): Promise<WardrobeItem[]> => {
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId invalide pour la récupération des vêtements');
  }

  return firestoreService.queryDocuments<WardrobeItem>('wardrobe', [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ]);
};

export const updateWardrobeItem = async (itemId: string, updates: Partial<Omit<WardrobeItem, 'id'>>): Promise<void> => {
  await firestoreService.updateDocument<WardrobeItem>('wardrobe', itemId, updates);
};

export const deleteWardrobeItem = async (itemId: string): Promise<void> => {
  await firestoreService.deleteDocument('wardrobe', itemId);
};