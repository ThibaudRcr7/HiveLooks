export enum ClothingCategory {
  TSHIRT = 't-shirt',
  PULL = 'pull',
  SWEATSHIRT = 'sweatshirt',
  CHEMISE = 'chemise',
  PANTALON = 'pantalon',
  SHORT = 'short',
  JUPE = 'jupe',
  ROBE = 'robe',
  VESTE = 'veste',
  MANTEAU = 'manteau',
  CARDIGAN = 'cardigan',
  ACCESSOIRE = 'accessoire',
  CHAUSSURES = 'chaussures'
}

export interface WardrobeItem {
  id: string;
  userId: string;
  name: string;
  category: ClothingCategory;
  imageUrl: string;
  color?: string;
  brand?: string;
  size?: string;
  createdAt: Date;
}