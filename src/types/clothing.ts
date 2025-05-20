export enum ClothingCategory {
  TOPS = 'tops',
  BOTTOMS = 'bottoms',
  DRESSES = 'dresses',
  OUTERWEAR = 'outerwear',
  SHOES = 'shoes',
  ACCESSORIES = 'accessories'
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