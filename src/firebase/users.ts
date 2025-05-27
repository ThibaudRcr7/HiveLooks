import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase-config';

import { User as UserType } from '../types';

export type User = Omit<UserType, 'id'> & { uid: string };

/**
 * Crée un nouveau profil utilisateur dans Firestore
 */
export const createUserProfile = async (uid: string, username: string, email: string): Promise<void> => {
  try {
    const userRef = doc(firestore, 'users', uid);
    await setDoc(userRef, {
      uid,
      username,
      email,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la création du profil utilisateur:', error);
    throw error;
  }
};

/**
 * Récupère les informations d'un utilisateur
 */
export const getUserProfile = async (uid: string): Promise<UserType | null> => {
  try {
    const userRef = doc(firestore, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      return {
        ...userData,
        id: userData.uid
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur:', error);
    throw error;
  }
};

/**
 * Met à jour le profil d'un utilisateur
 */
export const updateUserProfile = async (uid: string, data: Partial<UserType>): Promise<void> => {
  try {
    const userRef = doc(firestore, 'users', uid);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil utilisateur:', error);
    throw error;
  }
};