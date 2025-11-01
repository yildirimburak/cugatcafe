import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { getDb } from './config';
import { MenuItem, Category } from '@/lib/types';

const MENU_ITEMS_COLLECTION = 'menuItems';
const CATEGORIES_COLLECTION = 'categories';

// Menu Items
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const db = getDb();
  const q = query(collection(db, MENU_ITEMS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as MenuItem[];
};

export const getMenuItemsByCategory = async (categoryId: string): Promise<MenuItem[]> => {
  const db = getDb();
  const q = query(
    collection(db, MENU_ITEMS_COLLECTION), 
    where('category', '==', categoryId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as MenuItem[];
};

export const getMenuItem = async (id: string): Promise<MenuItem | null> => {
  const db = getDb();
  const docRef = doc(db, MENU_ITEMS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate() || new Date(),
    updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
  } as MenuItem;
};

export const addMenuItem = async (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const db = getDb();
  const docRef = await addDoc(collection(db, MENU_ITEMS_COLLECTION), {
    ...item,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateMenuItem = async (id: string, item: Partial<Omit<MenuItem, 'id' | 'createdAt'>>): Promise<void> => {
  const db = getDb();
  const docRef = doc(db, MENU_ITEMS_COLLECTION, id);
  await updateDoc(docRef, {
    ...item,
    updatedAt: Timestamp.now(),
  });
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  const db = getDb();
  await deleteDoc(doc(db, MENU_ITEMS_COLLECTION, id));
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const db = getDb();
  const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Category[];
};

export const addCategory = async (category: Omit<Category, 'id' | 'createdAt'>): Promise<string> => {
  const db = getDb();
  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    ...category,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateCategory = async (id: string, category: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<void> => {
  const db = getDb();
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  await updateDoc(docRef, category);
};

export const deleteCategory = async (id: string): Promise<void> => {
  const db = getDb();
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
};

