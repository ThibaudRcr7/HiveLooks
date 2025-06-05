import { CloudinaryService } from '../types';

const CLOUDINARY_URL = process.env.VITE_CLOUDINARY_URL;
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB en octets

export const cloudinaryService: CloudinaryService = {
  uploadImage: async (file: File): Promise<string> => {
    if (!CLOUDINARY_URL || !UPLOAD_PRESET) {
      throw new Error('Configuration Cloudinary manquante');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('La taille du fichier ne doit pas dépasser 2 Mo');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append("upload_preset", "ml_default");
    
    // Ajout des paramètres d'optimisation Cloudinary
    formData.append('transformation', JSON.stringify({
      width: 1200,
      crop: 'limit',
      quality: 'auto',
      fetch_format: 'auto'
    }));

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Échec du téléchargement de l\'image');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Erreur lors du téléchargement vers Cloudinary:', error);
      throw error;
    }
  },

  deleteImage: async (publicId: string): Promise<void> => {
    if (!CLOUDINARY_URL) {
      throw new Error('Configuration Cloudinary manquante');
    }

    try {
      const response = await fetch(`${CLOUDINARY_URL}/destroy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          public_id: publicId
        })
      });

      if (!response.ok) {
        throw new Error('Échec de la suppression de l\'image');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      throw error;
    }
  }
};