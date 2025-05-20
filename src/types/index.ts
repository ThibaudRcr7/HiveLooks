import { QueryConstraint } from 'firebase/firestore';

// Types liés aux utilisateurs
export interface User {
  id: string;
  username: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  bio?: string;
}

// Types liés aux vêtements
export * from './clothing';


// Types liés aux posts
export interface Post {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl?: string;
  wardrobeItems?: string[];  // IDs des vêtements associés
  likes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  likes: number;
  createdAt: Date;
}

// Types liés à l'authentification
export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Types liés aux composants UI
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

// Types liés aux services
export interface FirestoreDocument {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export interface FirestoreService {
  getDocument: <T extends FirestoreDocument>(collection: string, id: string) => Promise<T | null>;
  setDocument: <T extends FirestoreDocument>(collection: string, id: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDocument: <T extends FirestoreDocument>(collection: string, id: string, data: Partial<Omit<T, 'id'>>) => Promise<void>;
  deleteDocument: (collection: string, id: string) => Promise<void>;
  queryDocuments: <T extends FirestoreDocument>(collection: string, constraints: QueryConstraint[]) => Promise<T[]>;
}

export interface CloudinaryService {
  uploadImage: (file: File) => Promise<string>;
  deleteImage: (publicId: string) => Promise<void>;
}