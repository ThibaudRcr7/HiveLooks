import { collection, addDoc, getDocs, query, where, updateDoc, doc, orderBy, serverTimestamp, writeBatch, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from './firebase-config';

// Types
export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  likes?: string[];
}

export interface Post {
  id?: string;
  userId: string;
  question: string;
  details: string;
  style: string;
  imageUrl: string;
  createdAt: Date;
  tags: string[];
}

// Collection reference
export const postsCollection = collection(firestore, 'posts');

/**
 * Récupère tous les posts pour la page découverte
 */
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Post[];
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    throw error;
  }
};

/**
 * Récupère les posts d'un utilisateur spécifique
 */
export const getUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const q = query(
      postsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Post[];
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    throw error;
  }
};

/**
 * Ajoute un commentaire à un post
 */
export const addComment = async (postId: string, userId: string, content: string): Promise<void> => {
  try {
    const commentsRef = collection(firestore, 'posts', postId, 'comments');
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
 * Like ou unlike un commentaire
 */
export const toggleCommentLike = async (postId: string, commentId: string, userId: string): Promise<void> => {
  try {
    const commentRef = doc(firestore, 'posts', postId, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);

    if (!commentSnap.exists()) {
      // Le commentaire n'existe pas, on log un avertissement
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
 * Crée un nouveau post
 */
export const createPost = async (post: Omit<Post, 'id' | 'createdAt' | 'tags'>): Promise<string> => {
  try {
    // Extraire les hashtags du style et des détails
    const styleTag = post.style.startsWith('#') ? [post.style.toLowerCase()] : [`#${post.style.toLowerCase()}`];
    const detailsTags = post.details
      .split(/\s+/)
      .filter(word => word.startsWith('#'))
      .map(tag => tag.toLowerCase());

    const newPost = {
      ...post,
      createdAt: serverTimestamp(),
      tags: [...new Set([...styleTag, ...detailsTags])]
    };

    const docRef = await addDoc(postsCollection, newPost);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    throw error;
  }
};

/**
 * Modifie un post existant
 */
export const updatePost = async (postId: string, updates: Partial<Post>): Promise<void> => {
  try {
    const postRef = doc(firestore, 'posts', postId);
    await updateDoc(postRef, updates);
  } catch (error) {
    console.error('Erreur lors de la modification du post:', error);
    throw error;
  }
};

/**
 * Supprime un post et ses commentaires sans vérification d'authentification
 * @param postId L'identifiant du post à supprimer
 * @returns Une promesse qui se résout quand le post et ses commentaires sont supprimés
 */
export const deletePost = async (postId: string): Promise<void> => {
  try {
    if (!postId) {
      throw new Error('L\'identifiant du post est requis');
    }

    const postRef = doc(firestore, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      console.warn(`Le post avec l'ID ${postId} n'existe pas ou a déjà été supprimé.`);
      return;
    }

    const batch = writeBatch(firestore);
    
    // Supprimer tous les commentaires du post
    const commentsRef = collection(firestore, 'posts', postId, 'comments');
    const commentsSnapshot = await getDocs(commentsRef);
    
    commentsSnapshot.docs.forEach((commentDoc) => {
      batch.delete(commentDoc.ref);
    });
    
    // Supprimer le post
    batch.delete(postRef);
    
    // Exécuter toutes les opérations de suppression en une seule transaction
    await batch.commit();
    console.log(`Post ${postId} et ses commentaires ont été supprimés avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la suppression du post et de ses commentaires:', error);
    throw error;
  }
};

/**
 * Supprime tous les posts et leurs commentaires
 */
export const deleteAllPosts = async (): Promise<void> => {
  try {
    const batch = writeBatch(firestore);
    const postsSnapshot = await getDocs(postsCollection);

    // Pour chaque post
    for (const postDoc of postsSnapshot.docs) {
      // Supprimer tous les commentaires du post
      const commentsRef = collection(firestore, 'posts', postDoc.id, 'comments');
      const commentsSnapshot = await getDocs(commentsRef);
      
      commentsSnapshot.docs.forEach((commentDoc) => {
        batch.delete(commentDoc.ref);
      });
      
      // Supprimer le post
      batch.delete(postDoc.ref);
    }

    // Exécuter toutes les opérations de suppression en une seule transaction
    await batch.commit();
    console.log('Tous les posts et leurs commentaires ont été supprimés avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression de tous les posts:', error);
    throw error;
  }
};