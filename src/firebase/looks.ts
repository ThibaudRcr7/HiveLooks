import { collection, addDoc, getDocs, query, where, updateDoc, doc, orderBy, serverTimestamp, writeBatch, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from './firebase-config';

// Types
export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  likes: string[];
}

export interface Look {
  id?: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  likes: string[];
  style?: string;
}

// Collection reference
export const looksCollection = collection(firestore, 'looks');

/**
 * Récupère tous les looks pour la page découverte
 */
export const getAllLooks = async (): Promise<Look[]> => {
  try {
    const q = query(looksCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Look[];
  } catch (error) {
    console.error('Erreur lors de la récupération des looks:', error);
    throw error;
  }
};

/**
 * Récupère les looks d'un utilisateur spécifique
 */
export const getUserLooks = async (userId: string): Promise<Look[]> => {
  try {
    // Cette requête nécessite un index composite sur:
    // Collection: 'looks'
    // Champs indexés: 
    // - userId (Ascending)
    // - createdAt (Descending)
    const q = query(
      looksCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Look[];
  } catch (error) {
    if (error instanceof Error && error.message.includes('requires an index')) {
      const customError = new Error(
        'Un index Firestore est requis pour cette requête. ' +
        'Veuillez suivre le lien dans la console pour créer l\'index automatiquement.'
      );
      customError.name = 'FirestoreIndexError';
      console.error('Erreur d\'index Firestore :', error);
      console.info(
        '⚠️ Action requise : Créez l\'index composite en suivant le lien ci-dessus ' +
        'dans la console Firebase pour optimiser les performances de la requête.'
      );
      throw customError;
    }
    console.error('Erreur lors de la récupération des looks:', error);
    throw new Error('Une erreur est survenue lors de la récupération des looks. Veuillez réessayer.');
  }
};

/**
 * Ajoute un commentaire à un look
 */
export const addComment = async (lookId: string, userId: string, content: string): Promise<void> => {
  try {
    const commentsRef = collection(firestore, 'looks', lookId, 'comments');
    await addDoc(commentsRef, {
      userId,
      content,
      createdAt: serverTimestamp(),
      likes: []
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error);
    throw error;
  }
};

/**
 * Gère le like/unlike d'un commentaire
 */
export const toggleLike = async (lookId: string, userId: string): Promise<void> => {
  if (!lookId || !userId) {
    throw new Error('L\'identifiant du look et de l\'utilisateur sont requis');
  }

  const lookRef = doc(firestore, 'looks', lookId);

  try {
    await updateDoc(lookRef, {
      likes: arrayUnion(userId)
    });
  } catch (error) {
    // Si l'utilisateur a déjà liké, on retire son like
    try {
      await updateDoc(lookRef, {
        likes: arrayRemove(userId)
      });
    } catch (error) {
      console.error('Erreur lors du like/unlike du look:', error);
      throw new Error('Une erreur est survenue lors de la mise à jour du like');
    }
  }
};

export const toggleCommentLike = async (lookId: string, commentId: string, userId: string): Promise<void> => {
  try {
    const commentRef = doc(firestore, 'looks', lookId, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);

    if (!commentSnap.exists()) {
      console.warn('Commentaire introuvable pour le like.');
      return;
    }

    const commentData = commentSnap.data();
    const likes: string[] = commentData.likes || [];

    const hasLiked = likes.includes(userId);
    const updatedLikes = hasLiked
      ? likes.filter((id) => id !== userId)
      : [...likes, userId];

    await updateDoc(commentRef, { likes: updatedLikes });
  } catch (error) {
    console.error('Erreur lors du like/unlike du commentaire:', error);
    throw error;
  }
};

/**
 * Crée un nouveau look
 */
export const createLook = async (look: Omit<Look, 'id' | 'createdAt' | 'comments' | 'likes'>): Promise<string> => {
  try {
    const newLook = {
      ...look,
      createdAt: serverTimestamp(),
      likes: []
    };

    const docRef = await addDoc(looksCollection, newLook);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création du look:', error);
    throw error;
  }
};

/**
 * Met à jour un look existant
 */
export const updateLook = async (lookId: string, updates: Partial<Look>): Promise<void> => {
  try {
    const lookRef = doc(firestore, 'looks', lookId);
    await updateDoc(lookRef, updates);
  } catch (error) {
    console.error('Erreur lors de la modification du look:', error);
    throw error;
  }
};

/**
 * Supprime un look et ses commentaires
 */
export const deleteLook = async (lookId: string): Promise<void> => {
  try {
    if (!lookId) {
      throw new Error('L\'identifiant du look est requis');
    }

    const lookRef = doc(firestore, 'looks', lookId);
    const lookSnap = await getDoc(lookRef);

    if (!lookSnap.exists()) {
      console.warn(`Le look avec l'ID ${lookId} n'existe pas ou a déjà été supprimé.`);
      return;
    }

    const batch = writeBatch(firestore);
    
    // Supprimer tous les commentaires du look
    const commentsRef = collection(firestore, 'looks', lookId, 'comments');
    const commentsSnapshot = await getDocs(commentsRef);
    
    commentsSnapshot.docs.forEach((commentDoc) => {
      batch.delete(commentDoc.ref);
    });
    
    // Supprimer le look
    batch.delete(lookRef);
    
    // Exécuter toutes les opérations de suppression en une seule transaction
    await batch.commit();
    console.log(`Look ${lookId} et ses commentaires ont été supprimés avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la suppression du look et de ses commentaires:', error);
    throw error;
  }
};