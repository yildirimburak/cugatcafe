/**
 * Seed script - Firebase'e menü verilerini ekler
 * Çalıştırmak için: npm run seed
 * 
 * Mevcut tüm kategorileri ve ürünleri siler, yeni verileri ekler
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ES modules için __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local dosyasını yükle
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = [
  { name: 'Kahvaltılar', nameEn: 'Breakfasts', order: 1 },
  { name: 'Omletler', nameEn: 'Omelettes', order: 2 },
  { name: 'Ekmek Üstü Lezzetler', nameEn: 'Toasted Bread Delights', order: 3 },
  { name: 'Geleneksel Lezzetler', nameEn: 'Traditional Delights', order: 4 },
  { name: 'Sahanlar', nameEn: 'Pans', order: 5 },
  { name: 'Menemenler', nameEn: 'Menemen', order: 6 },
  { name: 'Gözlemeler', nameEn: 'Gözleme', order: 7 },
  { name: 'Kahvaltı Ekstralar', nameEn: 'Breakfast Extras', order: 8 },
  { name: 'Krepler', nameEn: 'Crepes', order: 9 },
  { name: 'Tostlar', nameEn: 'Toasts', order: 10 },
  { name: 'Kruvasanlar', nameEn: 'Croissants', order: 11 },
  { name: 'Soğuk Sandviçler', nameEn: 'Cold Sandwiches', order: 12 },
  { name: 'Sıcak Sandviçler', nameEn: 'Hot Sandwiches', order: 13 },
  { name: 'Tatlılar', nameEn: 'Desserts', order: 14 },
  { name: 'Makarnalar', nameEn: 'Pastas', order: 15 },
  { name: 'Wraplar', nameEn: 'Wraps', order: 16 },
  { name: 'Kaseler', nameEn: 'Bowls', order: 17 },
  { name: 'Salatalar', nameEn: 'Salads', order: 18 },
  { name: 'Atıştırmalıklar', nameEn: 'Snacks', order: 19 },
];

async function seedData() {
  try {
    console.log('🗑️  Mevcut veriler siliniyor...\n');

    // Mevcut menü öğelerini sil
    const menuItemsSnapshot = await getDocs(collection(db, 'menuItems'));
    for (const docSnap of menuItemsSnapshot.docs) {
      await deleteDoc(doc(db, 'menuItems', docSnap.id));
    }
    console.log(`  ✅ ${menuItemsSnapshot.docs.length} menü öğesi silindi`);

    // Mevcut kategorileri sil
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    for (const docSnap of categoriesSnapshot.docs) {
      await deleteDoc(doc(db, 'categories', docSnap.id));
    }
    console.log(`  ✅ ${categoriesSnapshot.docs.length} kategori silindi\n`);

    console.log('🚀 Yeni veriler ekleniyor...\n');

    // Kategorileri ekle
    const categoryIds: Record<string, string> = {};
    console.log('📁 Kategoriler ekleniyor...');
    
    for (const category of categories) {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: Timestamp.now(),
      });
      categoryIds[category.name] = docRef.id;
      console.log(`  ✅ ${category.name} eklendi`);
    }

    console.log('\n🍽️  Menü öğeleri ekleniyor...\n');

    // Menü öğelerini ekle
    const menuItems = [
      // Kahvaltılar
      { name: 'Kahvaltı Tabağı', nameEn: 'Breakfast Plate', description: 'Domates-salatalık söğüş, beyaz peynir, eski kaşar peyniri, çeçil peyniri, acuka, göz yumurta, patates kızartması, gözleme, bal-kaymak, mevsim reçeli, nutella, zeytin, kuru domatesli cevizli sos, hindi füme, simit ve 1 fincan çay.', descriptionEn: 'Tomato-cucumber slices, white cheese, aged cheddar cheese, string cheese, acuka, fried egg, french fries, gozleme, honey-clotted cream, seasonal jam, nutella, olives, sun-dried tomato and walnut sauce, smoked turkey, simit and 1 cup of tea.', price: 600, category: 'Kahvaltılar' },
      { name: 'Mini Kahvaltı Tabağı', nameEn: 'Mini Breakfast Plate', description: 'Salatalık, domates, bal-kaymak, beyaz peynir, eski kaşar peyniri, tek göz yumurta, zeytin ve simit.', descriptionEn: 'Cucumber, tomato, honey-clotted cream, white cheese, aged cheddar cheese, one fried egg, olives and simit.', price: 500, category: 'Kahvaltılar' },
      { name: 'Kahvaltı Salatası', nameEn: 'Breakfast Salad', description: 'Salata üzerine 2 adet haşlanmış yumurta, avokado, yeşil ve siyah zeytin, lor peyniri.', descriptionEn: 'Salad with 2 boiled eggs, avocado, green and black olives, curd cheese.', price: 450, category: 'Kahvaltılar' },
      { name: 'Simit Tabağı', nameEn: 'Simit Plate', description: 'Simit, peynir, zeytin, salatalık, domates, 1 fincan çay.', descriptionEn: 'Simit, cheese, olives, cucumber, tomato, 1 cup of tea.', price: 350, category: 'Kahvaltılar' },

      // Omletler
      { name: 'Sucuklu Omlet', nameEn: 'Sausage Omelette', description: '3 adet yumurta, sucuk. Yeşillik, salatalık, domates ile servis edilir.', descriptionEn: '3 eggs, sausage. Served with greens, cucumber, tomato.', price: 260, category: 'Omletler' },
      { name: 'Kavurmalı Kaşarlı Omlet', nameEn: 'Roasted Meat and Cheddar Omelette', description: '3 adet yumurta, kavurma, kaşar peyniri. Yeşillik, salatalık, domates ile servis edilir.', descriptionEn: '3 eggs, roasted meat, cheddar cheese. Served with greens, cucumber, tomato.', price: 325, category: 'Omletler' },
      { name: 'Otlu Omlet', nameEn: 'Herb Omelette', description: '3 adet yumurta, dere otu, maydanoz. Yeşillik, salatalık, domates ile servis edilir.', descriptionEn: '3 eggs, dill, parsley. Served with greens, cucumber, tomato.', price: 235, category: 'Omletler' },
      { name: 'Mantarlı Kaşarlı Omlet', nameEn: 'Mushroom and Cheddar Omelette', description: '3 adet yumurta, mantar, kaşar peyniri. Yeşillik, salatalık, domates ile servis edilir.', descriptionEn: '3 eggs, mushroom, cheddar cheese. Served with greens, cucumber, tomato.', price: 275, category: 'Omletler' },
      { name: 'Peynirli Omlet Kaşarlı/ Beyaz Peynirli/Cheddarlı', nameEn: 'Cheese Omelette Cheddar/White Cheese/Cheddared', description: '3 adet yumurta, tercih edilen peynir. Yeşillik, salatalık, domates ile servis edilir.', descriptionEn: '3 eggs, preferred cheese. Served with greens, cucumber, tomato.', price: 240, category: 'Omletler' },
      { name: 'Patatesli, Biberli, Kaşarlı Omlet', nameEn: 'Potato, Pepper, Cheddar Omelette', description: '3 adet yumurta, kaşar peyniri, renkli biberler. Yeşillik, salatalık, domates ile servis edilir.', descriptionEn: '3 eggs, cheddar cheese, colorful peppers. Served with greens, cucumber, tomato.', price: 300, category: 'Omletler' },
      { name: 'Fit Omlet', nameEn: 'Fit Omelette', description: '3 adet yumurta, beyaz peynir, yulaf ve maydanoz. Yeşillik, salatalık, domates ile servis edilir.', descriptionEn: '3 eggs, white cheese, oats and parsley. Served with greens, cucumber, tomato.', price: 250, category: 'Omletler' },

      // Ekmek Üstü Lezzetler
      { name: 'Ekmek Üstü Kuru Kayıslı, Avokadolu Göz Yumurta', nameEn: 'Toasted Bread with Dried Apricot, Avocado and Fried Egg', description: 'Ev yapımı ekmek üzerine avokado püresi, kuru kayısılı göz yumurta. Yeşillik, salatalık, domates ile servis edilir.', descriptionEn: 'Homemade bread with avocado puree, fried egg with dried apricots. Served with greens, cucumber, tomato.', price: 300, category: 'Ekmek Üstü Lezzetler' },
      { name: 'Ekmek Üstü Çırpılmış Yumurta', nameEn: 'Toasted Bread with Scrambled Eggs', description: 'Ev yapımı ekmek üzerine avokado püresi, beyaz peynirli çırpılmış yumurta. Yeşillik, salatalık, domates ile servis edilir.', descriptionEn: 'Homemade bread with avocado puree, scrambled eggs with white cheese. Served with greens, cucumber, tomato.', price: 270, category: 'Ekmek Üstü Lezzetler' },
      { name: 'Pancarlı Ekmek Üstü Göz Yumurta', nameEn: 'Toasted Bread with Beetroot and Fried Egg', description: 'Ev yapımı ekmek üzerine avokado, labne peynir ve göz yumurta. Yeşillik, salatalık, domates ile servis edilir.', descriptionEn: 'Homemade bread with avocado, labneh cheese and fried egg. Served with greens, cucumber, tomato.', price: 325, category: 'Ekmek Üstü Lezzetler' },
      { name: 'Ispanaklı Ekmek Üstü Poşe Yumurta', nameEn: 'Toasted Bread with Spinach and Poached Egg', description: 'Ev yapımı ekmek üzerine avokado püresi, ıspanak sote, lor peyniri, kuru et, göz yumurta. Yeşillik, salatalık, domates ile servis edilir.', descriptionEn: 'Homemade bread with avocado puree, sautéed spinach, curd cheese, dried meat, fried egg. Served with greens, cucumber, tomato.', price: 350, category: 'Ekmek Üstü Lezzetler' },

      // Geleneksel Lezzetler
      { name: 'Pişi Tabağı', nameEn: 'Pişi Plate', description: '', descriptionEn: '', price: 300, category: 'Geleneksel Lezzetler' },
      { name: 'Muhlama', nameEn: 'Muhlama', description: '', descriptionEn: '', price: 350, category: 'Geleneksel Lezzetler' },
      { name: 'Soğanlı Yumurta', nameEn: 'Onion Egg', description: '', descriptionEn: '', price: 300, category: 'Geleneksel Lezzetler' },

      // Sahanlar
      { name: 'Sahanda Göz Yumurta', nameEn: 'Fried Egg in Pan', description: '', descriptionEn: '', price: 200, category: 'Sahanlar' },
      { name: 'Sahanda Sucuklu Göz Yumurta', nameEn: 'Fried Egg with Sausage in Pan', description: '', descriptionEn: '', price: 275, category: 'Sahanlar' },
      { name: 'Sahanda Kavurmalı Göz Yumurta', nameEn: 'Fried Egg with Roasted Meat in Pan', description: '', descriptionEn: '', price: 300, category: 'Sahanlar' },
      { name: 'Peynirli Çırpılmış Yumurta', nameEn: 'Scrambled Eggs with Cheese', description: '', descriptionEn: '', price: 250, category: 'Sahanlar' },
      { name: 'Kuru Kayıslı Göz Yumurta', nameEn: 'Fried Egg with Dried Apricots', description: '', descriptionEn: '', price: 250, category: 'Sahanlar' },
      { name: 'Kuru Dutlu Göz Yumurta', nameEn: 'Fried Egg with Dried Mulberries', description: '', descriptionEn: '', price: 250, category: 'Sahanlar' },

      // Menemenler
      { name: 'Menemen', nameEn: 'Menemen', description: '', descriptionEn: '', price: 250, category: 'Menemenler' },
      { name: 'Peynirli Menemen', nameEn: 'Cheese Menemen', description: '', descriptionEn: '', price: 280, category: 'Menemenler' },
      { name: 'Sucuklu Menemen', nameEn: 'Sausage Menemen', description: '', descriptionEn: '', price: 310, category: 'Menemenler' },
      { name: 'Sucuklu Peynirli Menemen', nameEn: 'Sausage and Cheese Menemen', description: '', descriptionEn: '', price: 335, category: 'Menemenler' },
      { name: 'Pastırmalı Menemen', nameEn: 'Pastrami Menemen', description: '', descriptionEn: '', price: 350, category: 'Menemenler' },

      // Gözlemeler
      { name: 'Kaşar Peynirli Gözleme', nameEn: 'Cheddar Cheese Gözleme', description: 'Domates, salatalık ile servis edilir.', descriptionEn: 'Served with tomato, cucumber.', price: 300, category: 'Gözlemeler' },
      { name: 'Beyaz Peynirli Gözleme', nameEn: 'White Cheese Gözleme', description: 'Beyaz peynir ve maydanoz.', descriptionEn: 'White cheese and parsley.', price: 280, category: 'Gözlemeler' },
      { name: 'Patatesli Gözleme', nameEn: 'Potato Gözleme', description: 'Patates, maydanoz, karışık baharat. Domates, salatalık ile servis edilir.', descriptionEn: 'Potato, parsley, mixed spices. Served with tomato, cucumber.', price: 315, category: 'Gözlemeler' },
      { name: 'Otlu Gözleme', nameEn: 'Herb Gözleme', description: 'Nane, maydanoz, dereotu, lor peyniri. Domates, salatalık ile servis edilir.', descriptionEn: 'Mint, parsley, dill, curd cheese. Served with tomato, cucumber.', price: 270, category: 'Gözlemeler' },
      { name: 'Ispanaklı Gözleme', nameEn: 'Spinach Gözleme', description: 'Sote ıspanak. Domates, salatalık ile servis edilir.', descriptionEn: 'Sautéed spinach. Served with tomato, cucumber.', price: 315, category: 'Gözlemeler' },
      { name: 'Kavurmalı Kaşarlı Gözleme', nameEn: 'Roasted Meat and Cheddar Gözleme', description: '', descriptionEn: '', price: 375, category: 'Gözlemeler' },
      { name: 'Pastırma Kaşarlı Gözleme', nameEn: 'Pastrami and Cheddar Gözleme', description: '', descriptionEn: '', price: 400, category: 'Gözlemeler' },
      { name: 'Mix Gözleme', nameEn: 'Mixed Gözleme', description: 'Mantar, sucuk ve kaşar. Domates, salatalık ile servis edilir.', descriptionEn: 'Mushroom, sausage and cheddar. Served with tomato, cucumber.', price: 350, category: 'Gözlemeler' },
      { name: 'Kuru Dutlu Gözleme', nameEn: 'Dried Mulberry Gözleme', description: 'Yöresel peynirler ve kuru dut.', descriptionEn: 'Local cheeses and dried mulberries.', price: 350, category: 'Gözlemeler' },

      // Kahvaltı Ekstralar
      { name: 'Peynir Tabağı', nameEn: 'Cheese Plate', description: '', descriptionEn: '', price: 200, category: 'Kahvaltı Ekstralar' },
      { name: 'Bal Kaymak', nameEn: 'Honey Clotted Cream', description: '', descriptionEn: '', price: 150, category: 'Kahvaltı Ekstralar' },
      { name: 'Zeytin Tabağı', nameEn: 'Olive Plate', description: '', descriptionEn: '', price: 125, category: 'Kahvaltı Ekstralar' },
      { name: 'Söğüş Tabağı', nameEn: 'Sliced Vegetable Plate', description: '', descriptionEn: '', price: 150, category: 'Kahvaltı Ekstralar' },
      { name: 'Hellim Tabağı', nameEn: 'Halloumi Plate', description: '', descriptionEn: '', price: 200, category: 'Kahvaltı Ekstralar' },
      { name: 'Avokado Tabağı', nameEn: 'Avocado Plate', description: '', descriptionEn: '', price: 150, category: 'Kahvaltı Ekstralar' },

      // Krepler
      { name: 'Pesto Soslu', nameEn: 'Pesto Sauce', description: 'Beyaz peynir, pesto sos, cheddar peyniri, krep üstüne eritilmiş kaşar peyniri. Yeşillik ile servis edilir.', descriptionEn: 'White cheese, pesto sauce, cheddar cheese, melted cheddar cheese on crepe. Served with greens.', price: 300, category: 'Krepler' },
      { name: 'Mantarlı', nameEn: 'Mushroom', description: 'Mantar, Kapya biberi, Cheddar peyniri. Yeşillik ile servis edilir.', descriptionEn: 'Mushroom, Capia pepper, Cheddar cheese. Served with greens.', price: 250, category: 'Krepler' },
      { name: 'Nutellalı Krep', nameEn: 'Nutella Crepe', description: 'Muz ve çilek ile servis edilir.', descriptionEn: 'Served with banana and strawberry.', price: 300, category: 'Krepler' },
      { name: 'Tavuklu Krep', nameEn: 'Chicken Crepe', description: 'Tavuk, mantar, kapya biber, cheddar sos.', descriptionEn: 'Chicken, mushroom, capia pepper, cheddar sauce.', price: 300, category: 'Krepler' },

      // Tostlar
      { name: 'Kaşarlı Tost', nameEn: 'Cheddar Toast', description: 'Kaşar peyniri, domates. Zeytin ve yeşillik ile servis edilir. 1 adet ikram çay.', descriptionEn: 'Cheddar cheese, tomato. Served with olives and greens. 1 complimentary tea.', price: 250, category: 'Tostlar' },
      { name: 'Kavurmalı Kaşarlı Tost', nameEn: 'Roasted Meat and Cheddar Toast', description: 'Kaşar peyniri, kavurma. Zeytin ve yeşillik ile servis edilir. 1 adet ikram çay.', descriptionEn: 'Cheddar cheese, roasted meat. Served with olives and greens. 1 complimentary tea.', price: 300, category: 'Tostlar' },
      { name: 'Salçalı Karışık Tost', nameEn: 'Tomato Paste Mixed Toast', description: 'Sucuk, kaşar, acuka. Zeytin ve yeşillik ile servis edilir. 1 adet ikram çay.', descriptionEn: 'Sausage, cheddar, acuka. Served with olives and greens. 1 complimentary tea.', price: 285, category: 'Tostlar' },
      { name: 'Beyaz Peynirli Tost', nameEn: 'White Cheese Toast', description: 'Beyaz peynir, pesto sos, domates. Zeytin ve yeşillik ile servis edilir. 1 adet ikram çay.', descriptionEn: 'White cheese, pesto sauce, tomato. Served with olives and greens. 1 complimentary tea.', price: 275, category: 'Tostlar' },
      { name: 'Avokadolu Tost', nameEn: 'Avocado Toast', description: 'Avokado, beyaz peynir, domates. Zeytin ve yeşillik ile servis edilir. 1 adet ikram çay.', descriptionEn: 'Avocado, white cheese, tomato. Served with olives and greens. 1 complimentary tea.', price: 290, category: 'Tostlar' },
      { name: 'Pastırmalı Kaşarlı Tost', nameEn: 'Pastrami and Cheddar Toast', description: 'Kaşar peyniri, pastırma.', descriptionEn: 'Cheddar cheese, pastrami.', price: 300, category: 'Tostlar' },

      // Kruvasanlar
      { name: 'Sade Kruvasan', nameEn: 'Plain Croissant', description: '', descriptionEn: '', price: 150, category: 'Kruvasanlar' },
      { name: 'Tuzlu Kruvasan Tabağı', nameEn: 'Savory Croissant Plate', description: 'Beyaz peynir, zeytin, salatalık, domates.', descriptionEn: 'White cheese, olives, cucumber, tomato.', price: 210, category: 'Kruvasanlar' },
      { name: 'Tatlı Kruvasan Tabağı', nameEn: 'Sweet Croissant Plate', description: 'Nutella, reçel, muz.', descriptionEn: 'Nutella, jam, banana.', price: 220, category: 'Kruvasanlar' },
      { name: 'Kruvasan Sandviç', nameEn: 'Croissant Sandwich', description: 'Hindi füme, cheddar peyniri, eski kaşar, kıvırcık, salatalık.', descriptionEn: 'Smoked turkey, cheddar cheese, aged cheddar, lettuce, cucumber.', price: 250, category: 'Kruvasanlar' },
      { name: 'Kruvasan Omlet', nameEn: 'Croissant Omelette', description: 'Peynirli çırpılmış yumurta. Zeytin, salatalık, domates ile servis edilir.', descriptionEn: 'Scrambled eggs with cheese. Served with olives, cucumber, tomato.', price: 275, category: 'Kruvasanlar' },

      // Soğuk Sandviçler
      { name: 'Beyaz Peynirli', nameEn: 'White Cheese', description: 'Beyaz peynir, domates, salatalık, sivri biber. Zeytin ve yeşillik ile servis edilir. 1 adet ikram çay.', descriptionEn: 'White cheese, tomato, cucumber, pointed pepper. Served with olives and greens. 1 complimentary tea.', price: 290, category: 'Soğuk Sandviçler' },
      { name: 'Hindi Füme', nameEn: 'Smoked Turkey', description: 'Hindi füme, kaşar peyniri, cheddar peyniri, labne. Zeytin ve yeşillik ile servis edilir. 1 adet ikram çay.', descriptionEn: 'Smoked turkey, cheddar cheese, labneh. Served with olives and greens. 1 complimentary tea.', price: 300, category: 'Soğuk Sandviçler' },
      { name: 'Hellimli Sandviç', nameEn: 'Halloumi Sandwich', description: 'Hellim peyniri, pesto sos, domates, salatalık.', descriptionEn: 'Halloumi cheese, pesto sauce, tomato, cucumber.', price: 300, category: 'Soğuk Sandviçler' },

      // Sıcak Sandviçler
      { name: 'Tavuklu Sandviç', nameEn: 'Chicken Sandwich', description: 'Izgara tavuk, eritilmiş kaşar peyniri, domates, mayonez. Yeşillik ile servis edilir.', descriptionEn: 'Grilled chicken, melted cheddar cheese, tomato, mayonnaise. Served with greens.', price: 325, category: 'Sıcak Sandviçler' },
      { name: 'Sebzeli Tavuklu Sandviç', nameEn: 'Vegetable Chicken Sandwich', description: 'Izgara tavuk, domates, marul, pesto sos, köz biber, köz patlıcan, cheddar peyniri. Yeşillik ile servis edilir.', descriptionEn: 'Grilled chicken, tomato, lettuce, pesto sauce, roasted pepper, roasted eggplant, cheddar cheese. Served with greens.', price: 350, category: 'Sıcak Sandviçler' },

      // Tatlılar
      { name: 'San Sebastian', nameEn: 'San Sebastian', description: '', descriptionEn: '', price: 280, category: 'Tatlılar' },
      { name: 'San Sebastian / Çikolata Sos', nameEn: 'San Sebastian / Chocolate Sauce', description: '', descriptionEn: '', price: 300, category: 'Tatlılar' },
      { name: 'Ev Yapımı Brownie', nameEn: 'Homemade Brownie', description: '', descriptionEn: '', price: 250, category: 'Tatlılar' },
      { name: 'Ev Yapımı Brownie / Kaymaklı Dondurma', nameEn: 'Homemade Brownie / Ice Cream with Clotted Cream', description: '', descriptionEn: '', price: 310, category: 'Tatlılar' },
      { name: 'Ev Yapımı Cheesecake', nameEn: 'Homemade Cheesecake', description: '', descriptionEn: '', price: 280, category: 'Tatlılar' },
      { name: 'Ev Yapımı Un Helvası', nameEn: 'Homemade Flour Halva', description: '', descriptionEn: '', price: 250, category: 'Tatlılar' },
      { name: 'Nutellalı Kruvasan', nameEn: 'Nutella Croissant', description: 'Nutella, çilek, muz.', descriptionEn: 'Nutella, strawberry, banana.', price: 250, category: 'Tatlılar' },
      { name: 'Tiramisu', nameEn: 'Tiramisu', description: '', descriptionEn: '', price: 250, category: 'Tatlılar' },
      { name: 'Cookie', nameEn: 'Cookie', description: '', descriptionEn: '', price: 165, category: 'Tatlılar' },
      { name: 'Ev Yapımı Baklava', nameEn: 'Homemade Baklava', description: '', descriptionEn: '', price: 250, category: 'Tatlılar' },

      // Makarnalar
      { name: 'Fettuccine Alfredo', nameEn: 'Fettuccine Alfredo', description: 'Tavuk parçaları, mantar, parmesan peyniri ve krema sos.', descriptionEn: 'Chicken pieces, mushroom, parmesan cheese and cream sauce.', price: 400, category: 'Makarnalar' },
      { name: 'Penne Arrabbiata', nameEn: 'Penne Arrabbiata', description: 'Acılı domates sos.', descriptionEn: 'Spicy tomato sauce.', price: 350, category: 'Makarnalar' },
      { name: 'Penne Napolitan', nameEn: 'Penne Napolitan', description: 'Napolitan sos.', descriptionEn: 'Napolitan sauce.', price: 350, category: 'Makarnalar' },
      { name: 'Soya Soslu Mevsim Sebzeli Penne', nameEn: 'Penne with Soy Sauce and Seasonal Vegetables', description: 'Tavuk parçaları, mantar, renkli biber, brokoli, havuç, yeşil soğan, parmesan peyniri.', descriptionEn: 'Chicken pieces, mushroom, colorful peppers, broccoli, carrot, green onion, parmesan cheese.', price: 375, category: 'Makarnalar' },
      { name: 'Ev Yapımı Mantı', nameEn: 'Homemade Mantı', description: '', descriptionEn: '', price: 500, category: 'Makarnalar' },

      // Wraplar
      { name: 'Tavuklu Wrap', nameEn: 'Chicken Wrap', description: 'Göğüs tavuk, renkli biberler, mantar, cheddar peyniri. Patates kızartması ile servis edilir.', descriptionEn: 'Chicken breast, colorful peppers, mushroom, cheddar cheese. Served with french fries.', price: 375, category: 'Wraplar' },
      { name: 'Sebzeli Wrap', nameEn: 'Vegetable Wrap', description: 'Izgara sebzeler, cheddar peyniri. Patates kızartması ile servis edilir.', descriptionEn: 'Grilled vegetables, cheddar cheese. Served with french fries.', price: 330, category: 'Wraplar' },
      { name: 'Falafel Wrap', nameEn: 'Falafel Wrap', description: 'Falafel, yeşillik, humus sos, domates. Patates kızartması ile servis edilir.', descriptionEn: 'Falafel, greens, hummus sauce, tomato. Served with french fries.', price: 350, category: 'Wraplar' },
      { name: 'Köfte Wrap', nameEn: 'Meatball Wrap', description: 'Izgara köfte, renkli biberler, mantar, cheddar sos. Patates kızartması ile servis edilir.', descriptionEn: 'Grilled meatballs, colorful peppers, mushroom, cheddar sauce. Served with french fries.', price: 450, category: 'Wraplar' },
      { name: 'Salad Wrap', nameEn: 'Salad Wrap', description: 'Izgara tavuk, yeşillik, salad sos. Patates kızartması ile servis edilir.', descriptionEn: 'Grilled chicken, greens, salad sauce. Served with french fries.', price: 380, category: 'Wraplar' },

      // Kaseler
      { name: 'Köfte Kase', nameEn: 'Meatball Bowl', description: 'Köfte, Frik pilavı, yeşillikler, çeri domates, piyaz salatası.', descriptionEn: 'Meatballs, Frik rice, greens, cherry tomatoes, piyaz salad.', price: 500, category: 'Kaseler' },
      { name: 'Falafel Kase', nameEn: 'Falafel Bowl', description: 'Falafel, yeşillik, tahinli sos, maş fasülyesi.', descriptionEn: 'Falafel, greens, tahini sauce, mung beans.', price: 450, category: 'Kaseler' },
      { name: 'BBQ Soslu Tavuk Kase', nameEn: 'BBQ Sauce Chicken Bowl', description: 'Göğüs tavuk, renkli biberler, yeşillik, firik pilavı.', descriptionEn: 'Chicken breast, colorful peppers, greens, Frik rice.', price: 475, category: 'Kaseler' },
      { name: 'Köri Soslu Tavuk Kase', nameEn: 'Curry Sauce Chicken Bowl', description: 'Göğüs tavuk, renkli biberler, mantar, yeşillik, firik pilavı.', descriptionEn: 'Chicken breast, colorful peppers, mushroom, greens, Frik rice.', price: 475, category: 'Kaseler' },
      { name: 'Soya Soslu Tavuklu Kase', nameEn: 'Soy Sauce Chicken Bowl', description: 'Renkli biberler, kuru soğan, mantar, havuç, yeşillik, firik pilavı.', descriptionEn: 'Colorful peppers, dried onion, mushroom, carrot, greens, Frik rice.', price: 475, category: 'Kaseler' },

      // Salatalar
      { name: 'Hellim Peynirli Salata', nameEn: 'Halloumi Cheese Salad', description: 'Akdeniz yeşilliği, domates, salatalık, kavrulmuş badem.', descriptionEn: 'Mediterranean greens, tomato, cucumber, roasted almonds.', price: 330, category: 'Salatalar' },
      { name: 'Pancarlı Peynirli Salata', nameEn: 'Beetroot Cheese Salad', description: 'Fırın Pancar, yeşillik, lor peyniri.', descriptionEn: 'Baked beetroot, greens, curd cheese.', price: 320, category: 'Salatalar' },
      { name: 'Sezar Salata', nameEn: 'Caesar Salad', description: 'Yeşillik, sezar sos, ızgara tavuk.', descriptionEn: 'Greens, Caesar sauce, grilled chicken.', price: 325, category: 'Salatalar' },
      { name: 'Izgara Tavuklu Salata', nameEn: 'Grilled Chicken Salad', description: '', descriptionEn: '', price: 350, category: 'Salatalar' },
      { name: 'Kinoa Salatası', nameEn: 'Quinoa Salad', description: 'Kinoa, yeşillik.', descriptionEn: 'Quinoa, greens.', price: 320, category: 'Salatalar' },
      { name: 'Tavuklu Kinoa Salatası', nameEn: 'Chicken Quinoa Salad', description: 'Izgara tavuk, kinoa, yeşillik.', descriptionEn: 'Grilled chicken, quinoa, greens.', price: 390, category: 'Salatalar' },
      { name: 'Falafelli Kinoa Salatası', nameEn: 'Falafel Quinoa Salad', description: 'Falafel, kinoa, yeşillik.', descriptionEn: 'Falafel, quinoa, greens.', price: 375, category: 'Salatalar' },

      // Atıştırmalıklar
      { name: 'Patates Tabağı', nameEn: 'French Fries Plate', description: '', descriptionEn: '', price: 250, category: 'Atıştırmalıklar' },
      { name: 'Mücver Tabağı', nameEn: 'Vegetable Fritter Plate', description: '', descriptionEn: '', price: 250, category: 'Atıştırmalıklar' },
      { name: 'Falafel Tabağı', nameEn: 'Falafel Plate', description: '', descriptionEn: '', price: 250, category: 'Atıştırmalıklar' },
    ];

    for (const item of menuItems) {
      const categoryId = categoryIds[item.category];
      if (!categoryId) {
        console.warn(`  ⚠️  Kategori bulunamadı: ${item.category} - ${item.name} atlandı`);
        continue;
      }

      const docRef = await addDoc(collection(db, 'menuItems'), {
        name: item.name,
        nameEn: item.nameEn,
        description: item.description,
        descriptionEn: item.descriptionEn,
        price: item.price,
        category: categoryId,
        available: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      console.log(`  ✅ ${item.name} eklendi`);
    }

    console.log('\n✨ Veriler başarıyla eklendi!');
    console.log(`\n📊 Özet:`);
    console.log(`   - ${categories.length} kategori eklendi`);
    console.log(`   - ${menuItems.length} menü öğesi eklendi`);
    console.log('\n📝 Admin panelden görüntülemek için: http://localhost:3000/admin');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

seedData();
