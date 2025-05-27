const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en octets
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  // Vérification du type de fichier
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`Type de fichier non supporté. Types acceptés: ${ALLOWED_FILE_TYPES.join(', ')}`);
  }

  // Vérification de la taille du fichier
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`La taille du fichier dépasse la limite de ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/dzt75ltpn/image/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("Upload Cloudinary réussi:", {
      url: result.secure_url,
      format: result.format,
      size: Math.round(result.bytes / 1024) + 'KB'
    });

    if (!response.ok) {
      throw new Error(`Échec de l'upload: ${result?.error?.message || 'Erreur inconnue'}`);
    }

    return result.secure_url;
  } catch (error) {
    console.error("Erreur détaillée de l'upload:", error);
    throw error instanceof Error ? error : new Error("Une erreur inattendue s'est produite lors de l'upload");
  }
};