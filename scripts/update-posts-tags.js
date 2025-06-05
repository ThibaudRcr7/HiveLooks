import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration Firebase depuis les variables d'environnement
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updatePostsTags() {
  try {
    const postsRef = collection(db, 'posts');
    const querySnapshot = await getDocs(postsRef);
    
    // Créer un nouveau batch
    const batch = writeBatch(db);
    let batchCount = 0;
    const BATCH_SIZE = 500; // Limite de Firestore pour les opérations par batch
    
    for (const postDoc of querySnapshot.docs) {
      const postData = postDoc.data();
      
      // Extraire les tags du style et des détails
      const styleTag = postData.style.startsWith('#') 
        ? [postData.style.toLowerCase()] 
        : [`#${postData.style.toLowerCase()}`];
      
      const detailsTags = postData.details
        ? postData.details
            .split(/\s+/)
            .filter(word => word.startsWith('#'))
            .map(tag => tag.toLowerCase())
        : [];
      
      // Combiner et dédupliquer les tags
      const tags = [...new Set([...styleTag, ...detailsTags])];
      
      // Ajouter l'opération de mise à jour au batch
      batch.update(doc(db, 'posts', postDoc.id), { tags });
      batchCount++;
      
      // Si on atteint la limite du batch, on l'exécute
      if (batchCount === BATCH_SIZE) {
        await batch.commit();
        console.log(`Batch de ${batchCount} documents mis à jour`);
        batchCount = 0;
      }
    }
    
    // Exécuter le dernier batch s'il reste des opérations
    if (batchCount > 0) {
      await batch.commit();
      console.log(`Dernier batch de ${batchCount} documents mis à jour`);
    }
    
    console.log('Mise à jour des tags terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des tags:', error);
  }
}

// Exécuter la fonction de mise à jour
updatePostsTags();