export type AllergyTag = 
  | 'gluten' 
  | 'dairy' 
  | 'nuts' 
  | 'eggs' 
  | 'fish' 
  | 'shellfish' 
  | 'soy' 
  | 'sesame' 
  | 'vegetarian' 
  | 'vegan';

export interface MenuItem {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  allergies?: AllergyTag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  order: number;
  icon?: string;
  createdAt: Date;
}

export interface MenuItemFormData {
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  category: string;
  imageFile?: File;
  available: boolean;
  allergies?: AllergyTag[];
}

