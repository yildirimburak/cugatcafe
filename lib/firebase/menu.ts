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
  Timestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { getDb } from './config';
import { MenuItem, Category } from '@/lib/types';

const MENU_ITEMS_COLLECTION = 'menuItems';
const CATEGORIES_COLLECTION = 'categories';

// Menu Items
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const db = getDb();
  
  try {
    const q = query(collection(db, MENU_ITEMS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const items = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }) as MenuItem[];
    
    return items;
  } catch (error: any) {
    console.error('getMenuItems error:', error);
    // OrderBy hatası varsa, orderBy olmadan dene
    if (error.code === 'failed-precondition') {
      console.log('getMenuItems: OrderBy hatası, orderBy olmadan deniyor...');
      const qWithoutOrder = query(collection(db, MENU_ITEMS_COLLECTION));
      const querySnapshot = await getDocs(qWithoutOrder);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as MenuItem[];
      items.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      return items;
    }
    throw error;
  }
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
  
  console.log('Firebase updateMenuItem çağrıldı:', { id, item });
  
  // Timestamp'i ayrı tut, diğer tüm alanları gönder
  const { updatedAt, ...itemWithoutUpdatedAt } = item as any;
  
  const updatePayload = {
    ...itemWithoutUpdatedAt,
    updatedAt: Timestamp.now(),
  };
  
  console.log('Firebase updateDoc payload:', updatePayload);
  
  await updateDoc(docRef, updatePayload);
  
  console.log('Firebase updateDoc başarılı');
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

// Real-time listeners
export const subscribeToMenuItems = (
  callback: (items: MenuItem[]) => void
): Unsubscribe => {
  const db = getDb();
  
  try {
    const q = query(collection(db, MENU_ITEMS_COLLECTION), orderBy('createdAt', 'desc'));
    
    return onSnapshot(
      q, 
      (querySnapshot) => {
        console.log('Real-time listener: Menu items changed, snapshot size:', querySnapshot.size);
        const items = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log(`Item ${doc.id} data:`, {
            nameTr: data.nameTr,
            nameEn: data.nameEn,
            descriptionTr: data.descriptionTr,
            descriptionEn: data.descriptionEn
          });
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
        }) as MenuItem[];
        callback(items);
      },
      (error) => {
        console.error('Error in menu items listener:', error);
        // OrderBy hatası varsa, orderBy olmadan dene
        if (error.code === 'failed-precondition') {
          console.log('Retrying without orderBy...');
          const qWithoutOrder = collection(db, MENU_ITEMS_COLLECTION);
          return onSnapshot(qWithoutOrder, (querySnapshot) => {
            const items = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as MenuItem[];
            // Client-side sorting
            items.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
            callback(items);
          });
        }
      }
    );
  } catch (error) {
    console.error('Error setting up menu items listener:', error);
    // Fallback: orderBy olmadan dene
    const qWithoutOrder = collection(db, MENU_ITEMS_COLLECTION);
    return onSnapshot(qWithoutOrder, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as MenuItem[];
      items.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      callback(items);
    });
  }
};

export const subscribeToCategories = (
  callback: (categories: Category[]) => void
): Unsubscribe => {
  const db = getDb();
  
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('order', 'asc'));
    
    return onSnapshot(
      q, 
      (querySnapshot) => {
        const categories = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Category[];
        callback(categories);
      },
      (error) => {
        console.error('Error in categories listener:', error);
        // OrderBy hatası varsa, orderBy olmadan dene
        if (error.code === 'failed-precondition') {
          console.log('Retrying categories without orderBy...');
          const qWithoutOrder = collection(db, CATEGORIES_COLLECTION);
          onSnapshot(qWithoutOrder, (querySnapshot) => {
            const categories = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
            })) as Category[];
            // Client-side sorting
            categories.sort((a, b) => (a.order || 0) - (b.order || 0));
            callback(categories);
          });
        }
      }
    );
  } catch (error) {
    console.error('Error setting up categories listener:', error);
    // Fallback: orderBy olmadan dene
    const qWithoutOrder = collection(db, CATEGORIES_COLLECTION);
    return onSnapshot(qWithoutOrder, (querySnapshot) => {
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Category[];
      categories.sort((a, b) => (a.order || 0) - (b.order || 0));
      callback(categories);
    });
  }
};

