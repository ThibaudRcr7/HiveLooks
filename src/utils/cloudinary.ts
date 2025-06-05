const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB en octets
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  // Vérification du type de fichier
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`Type de fichier non supporté. Types acceptés: ${ALLOWED_FILE_TYPES.join(', ')}`);
  }

  // Vérification de la taille du fichier
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`La taille du fichier ne doit pas dépasser 2 Mo`);
  }

  if (!file) {
    throw new Error('Aucun fichier fourni');
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default"); // Preset non signé par défaut
  formData.append("cloud_name", "dzt75ltpn");
  
  // Pour les uploads non signés, on utilise des paramètres de transformation simples
  formData.append("width", "1200");
  formData.append("quality", "auto");
  formData.append("folder", "hivelooks_wardrobe");

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/dzt75ltpn/image/upload", {
      method: "POST",
      body: formData,
    });

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Réponse Cloudinary invalide:', responseText);
      throw new Error('Réponse invalide du serveur Cloudinary');
    }

    if (!response.ok) {
      const errorMessage = result.error ? result.error.message : `Erreur Cloudinary: ${response.status} ${response.statusText}`;
      console.error('Détails de l\'erreur Cloudinary:', result);
      throw new Error(errorMessage);
    }

    if (!result || !result.secure_url) {
      console.error('Réponse Cloudinary invalide:', result);
      throw new Error('URL sécurisée manquante dans la réponse Cloudinary');
    }

    console.log("Upload Cloudinary réussi:", {
      url: result.secure_url,
      format: result.format,
      size: Math.round(result.bytes / 1024) + 'KB'
    });

    return result.secure_url;
  } catch (error) {
    console.error("Erreur lors de l'upload sur Cloudinary:", error);
    throw new Error("Erreur lors de l'upload de l'image");
  }
};