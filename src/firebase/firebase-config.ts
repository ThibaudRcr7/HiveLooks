import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de l'authentification
const auth = getAuth(app);

// Initialisation de Firestore
const firestore = getFirestore(app);

// Configuration des émulateurs en environnement de développement
export const setupEmulators = async () => {
  if (false && location.hostname === 'localhost') {
    try {
      connectFirestoreEmulator(firestore, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      console.log('✓ Émulateurs configurés avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la configuration des émulateurs:', error);
      console.warn('⚠ Utilisation des services Firebase en production');
    }
  } else {
    console.log('🔥 Utilisation de Firebase en mode production');
  }
};

export { app, auth, firestore };