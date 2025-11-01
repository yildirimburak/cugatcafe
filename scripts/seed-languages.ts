/**
 * Seed script - Firebase'e varsayılan dilleri ekler
 * Çalıştırmak için: npm run seed:languages
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

const languages = [
  // Aktif diller (sadece TR ve EN)
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', enabled: true },
  { code: 'en', name: 'English', nativeName: 'English', enabled: true },
  
  // Pasif diller - Avrupa
  { code: 'de', name: 'German', nativeName: 'Deutsch', enabled: false },
  { code: 'fr', name: 'French', nativeName: 'Français', enabled: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', enabled: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', enabled: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', enabled: false },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', enabled: false },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', enabled: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', enabled: false },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', enabled: false },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', enabled: false },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', enabled: false },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', enabled: false },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', enabled: false },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', enabled: false },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', enabled: false },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', enabled: false },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', enabled: false },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', enabled: false },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', enabled: false },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', enabled: false },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', enabled: false },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', enabled: false },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', enabled: false },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', enabled: false },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', enabled: false },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', enabled: false },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', enabled: false },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', enabled: false },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', enabled: false },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', enabled: false },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', enabled: false },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', enabled: false },
  
  // Asya
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '中文', enabled: false },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', enabled: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', enabled: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', enabled: false },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', enabled: false },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', enabled: false },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', enabled: false },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', enabled: false },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', enabled: false },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', enabled: false },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', enabled: false },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', enabled: false },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', enabled: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', enabled: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', enabled: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', enabled: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', enabled: false },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', enabled: false },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', enabled: false },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', enabled: false },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', enabled: false },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', enabled: false },
  { code: 'uz', name: 'Uzbek', nativeName: 'O\'zbek', enabled: false },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', enabled: false },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', enabled: false },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', enabled: false },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', enabled: false },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', enabled: false },
  
  // Orta Doğu ve Afrika
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', enabled: false },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', enabled: false },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', enabled: false },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', enabled: false },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', enabled: false },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', enabled: false },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', enabled: false },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', enabled: false },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', enabled: false },
  
  // Amerika
  { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español (México)', enabled: false },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', enabled: false },
  { code: 'fr-CA', name: 'French (Canada)', nativeName: 'Français (Canada)', enabled: false },
  
  // Okyanusya
  { code: 'mi', name: 'Māori', nativeName: 'Te Reo Māori', enabled: false },
];

async function seedLanguages() {
  try {
    console.log('🚀 Firebase\'e varsayılan diller ekleniyor...\n');

    for (const language of languages) {
      const docRef = await addDoc(collection(db, 'languages'), {
        ...language,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`  ✅ ${language.nativeName} (${language.code}) eklendi (ID: ${docRef.id})`);
    }

    console.log('\n✨ Diller başarıyla eklendi!');
    console.log('\n📝 Admin panelden görüntülemek için: http://localhost:3000/admin');
    console.log('⚠️  Not: Translation dosyalarını (messages/{code}.json) manuel olarak eklemeyi unutmayın!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

seedLanguages();

