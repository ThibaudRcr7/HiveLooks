import { CloudinaryService } from '../types';

const CLOUDINARY_URL = process.env.VITE_CLOUDINARY_URL;
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryService: CloudinaryService = {
  uploadImage: async (file: File): Promise<string> => {
    if (!CLOUDINARY_URL || !UPLOAD_PRESET) {
      throw new Error('Configuration Cloudinary manquante');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

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