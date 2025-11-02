import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env dosyasını yükle
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Tarih string'ini Date'e çevir (örnek: "1 ay önce", "2 hafta önce")
function parseRelativeDate(dateStr: string): Date {
  const now = new Date();
  const lowerStr = dateStr.toLowerCase();
  
  if (lowerStr.includes('hafta')) {
    const weeks = parseInt(lowerStr.match(/\d+/)?.[0] || '0');
    return new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
  } else if (lowerStr.includes('ay')) {
    const months = parseInt(lowerStr.match(/\d+/)?.[0] || '0');
    return new Date(now.getTime() - months * 30 * 24 * 60 * 60 * 1000);
  } else if (lowerStr.includes('yıl')) {
    const years = parseInt(lowerStr.match(/\d+/)?.[0] || '0');
    return new Date(now.getTime() - years * 365 * 24 * 60 * 60 * 1000);
  }
  
  // Varsayılan olarak 1 ay önce
  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
}

const reviews = [
  {
    "kullanici": "Mauro de Maggi",
    "puan": 5,
    "tarih": "1 ay önce",
    "yorum": "Incredible dinner experience right next to Galata Tower. The gozleme and chicken wrap were perfect.",
    "yorumTr": "Galata Kulesi'nin hemen yanında harika bir akşam yemeği deneyimi. Gözleme ve tavuk wrap mükemmeldi.",
    "yorumEn": "Incredible dinner experience right next to Galata Tower. The gozleme and chicken wrap were perfect.",
    "yorumFr": "Expérience de dîner incroyable juste à côté de la Tour de Galata. Les gözleme et le wrap au poulet étaient parfaits.",
    "yorumDe": "Unglaubliche Dinner-Erfahrung direkt neben dem Galata Tower. Die Gözleme und das Hähnchen-Wrap waren perfekt.",
    "yorumIt": "Esperienza gastronomica incredibile proprio accanto alla Torre di Galata. I gözleme e il chicken wrap erano perfetti.",
    "yorumEs": "Experiencia culinaria increíble justo al lado de la Torre de Gálata. Los gözleme y el wrap de pollo estaban perfectos.",
    "yorumPt": "Experiência gastronômica incrível bem ao lado da Torre de Gálata. Os gözleme e o wrap de frango estavam perfeitos.",
    "yorumRu": "Невероятный ужин прямо рядом с Галатской башней. Гёзлеме и куриный ролл были идеальными.",
    "yorumJa": "ガラタ塔のすぐ隣で信じられないディナー体験。ギョズレメとチキンラップは完璧でした。",
    "yorumZh": "就在加拉塔塔旁边令人难以置信的晚餐体验。烤饼和鸡肉卷都很完美。",
    "yorumAr": "تجربة عشاء لا تصدق بجوار برج جالاتا مباشرة. كانت الغوزليم ولفائف الدجاج مثالية."
  },
  {
    "kullanici": "Emma Chaperon",
    "puan": 5,
    "tarih": "2 ay önce",
    "yorum": "Very cute, quiet cafe. Sweets and teas are delicious, especially the San Sebastian cheesecake and halva are amazing.",
    "yorumTr": "Çok sevimli, sessiz bir kafe. Tatlılar ve çaylar lezzetli, özellikle San Sebastian cheesecake ve helva müthiş.",
    "yorumEn": "Very cute, quiet cafe. Sweets and teas are delicious, especially the San Sebastian cheesecake and halva are amazing.",
    "yorumFr": "Café très mignon et calme. Les pâtisseries et les thés sont délicieux, surtout le cheesecake San Sebastian et le halva sont incroyables.",
    "yorumDe": "Sehr niedliches, ruhiges Café. Süßigkeiten und Tees sind köstlich, besonders der San Sebastian Cheesecake und das Halva sind erstaunlich.",
    "yorumIt": "Caffè molto carino e tranquillo. Dolci e tè sono deliziosi, specialmente la cheesecake San Sebastian e la halva sono fantastici.",
    "yorumEs": "Café muy lindo y tranquilo. Los dulces y los tés son deliciosos, especialmente el cheesecake de San Sebastián y el halva son increíbles.",
    "yorumPt": "Café muito fofo e tranquilo. Doces e chás são deliciosos, especialmente o cheesecake de San Sebastián e o halva são incríveis.",
    "yorumRu": "Очень милое, тихое кафе. Десерты и чаи восхитительны, особенно чизкейк Сан-Себастьян и халва.",
    "yorumJa": "とても可愛くて静かなカフェ。甘いものとお茶は美味しく、特にサンセバスチャンチーズケーキとハルバは素晴らしいです。",
    "yorumZh": "非常可爱、安静的咖啡馆。甜品和茶都很美味，尤其是圣塞巴斯蒂安芝士蛋糕和哈瓦非常棒。",
    "yorumAr": "مقهى لطيف وهادئ للغاية. الحلويات والشاي لذيذة، خاصة كعكة الجبن سان سيباستيان والحلاوة رائعتان."
  },
  {
    "kullanici": "Selina Dorn",
    "puan": 5,
    "tarih": "2 ay önce",
    "yorum": "The decoration is very tasteful, we went two days in a row, loved it!",
    "yorumTr": "Dekorasyon çok zevkli, iki gün üst üste geldik, bayıldık!",
    "yorumEn": "The decoration is very tasteful, we went two days in a row, loved it!",
    "yorumFr": "La décoration est très goûtue, nous y sommes allés deux jours de suite, nous avons adoré !",
    "yorumDe": "Die Dekoration ist sehr geschmackvoll, wir gingen zwei Tage hintereinander, haben es geliebt!",
    "yorumIt": "La decorazione è molto raffinata, ci siamo stati due giorni di fila, l'abbiamo amato!",
    "yorumEs": "La decoración es muy elegante, fuimos dos días seguidos, ¡nos encantó!",
    "yorumPt": "A decoração é muito elegante, fomos dois dias seguidos, adoramos!",
    "yorumRu": "Оформление очень со вкусом, мы ходили туда два дня подряд, нам очень понравилось!",
    "yorumJa": "装飾はとても上品で、2日連続で行きましたが、気に入りました！",
    "yorumZh": "装饰非常有品味，我们连续去了两天，非常喜欢！",
    "yorumAr": "الديكور أنيق جداً، ذهبنا ليومين متتاليين، أحببناه!"
  },
  {
    "kullanici": "Selina Dorn",
    "puan": 4,
    "tarih": "3 ay önce",
    "yorum": "Small, beautiful cafe. We had breakfast twice, staff is very friendly.",
    "yorumTr": "Küçük, güzel bir kafe. İki kez kahvaltı yaptık, personel çok güler yüzlü.",
    "yorumEn": "Small, beautiful cafe. We had breakfast twice, staff is very friendly.",
    "yorumFr": "Petit café magnifique. Nous avons pris le petit-déjeuner deux fois, le personnel est très accueillant.",
    "yorumDe": "Kleines, schönes Café. Wir haben zweimal gefrühstückt, das Personal ist sehr freundlich.",
    "yorumIt": "Piccolo caffè bellissimo. Abbiamo fatto colazione due volte, il personale è molto cordiale.",
    "yorumEs": "Pequeño y hermoso café. Desayunamos dos veces, el personal es muy amable.",
    "yorumPt": "Café pequeno e bonito. Tomamos café da manhã duas vezes, a equipe é muito simpática.",
    "yorumRu": "Небольшое, красивое кафе. Мы завтракали там дважды, персонал очень дружелюбный.",
    "yorumJa": "小さくて美しいカフェ。2回朝食をとりましたが、スタッフはとてもフレンドリーです。",
    "yorumZh": "小而美的咖啡馆。我们吃了两次早餐，员工非常友好。",
    "yorumAr": "مقهى صغير وجميل. تناولنا الإفطار مرتين، الموظفون ودودون جداً."
  },
  {
    "kullanici": "Sara Gomez Soto",
    "puan": 5,
    "tarih": "5 ay önce",
    "yorum": "A hidden gem just 50 meters from Galata Tower. Music is great, food is delicious.",
    "yorumTr": "Galata Kulesi'ne sadece 50 metre uzaklıkta gizli bir mücevher. Müzikler harika, yemekler nefis.",
    "yorumEn": "A hidden gem just 50 meters from Galata Tower. Music is great, food is delicious.",
    "yorumFr": "Un joyau caché à seulement 50 mètres de la Tour de Galata. La musique est géniale, la nourriture est délicieuse.",
    "yorumDe": "Ein verstecktes Juwel nur 50 Meter vom Galata Tower entfernt. Die Musik ist großartig, das Essen ist köstlich.",
    "yorumIt": "Un gioiello nascosto a soli 50 metri dalla Torre di Galata. La musica è fantastica, il cibo è delizioso.",
    "yorumEs": "Una joya escondida a solo 50 metros de la Torre de Gálata. La música es excelente, la comida es deliciosa.",
    "yorumPt": "Uma joia escondida a apenas 50 metros da Torre de Gálata. A música é ótima, a comida é deliciosa.",
    "yorumRu": "Скрытая жемчужина всего в 50 метрах от Галатской башни. Отличная музыка, вкусная еда.",
    "yorumJa": "ガラタ塔からわずか50メートルの隠れた宝石。音楽は素晴らしく、料理は美味しいです。",
    "yorumZh": "隐藏在距离加拉塔塔仅50米的珍品。音乐很棒，食物很美味。",
    "yorumAr": "جوهرة مخفية على بعد 50 متراً فقط من برج جالاتا. الموسيقى رائعة والطعام لذيذ."
  },
  {
    "kullanici": "Dmytro Tychyna",
    "puan": 5,
    "tarih": "1 ay önce",
    "yorum": "Quiet place, delicious food, large portions. Staff is very kind, cat bonus!",
    "yorumTr": "Sessiz bir yer, lezzetli yemekler, büyük porsiyonlar. Personel çok nazik, kedi bonus!",
    "yorumEn": "Quiet place, delicious food, large portions. Staff is very kind, cat bonus!",
    "yorumFr": "Endroit calme, nourriture délicieuse, grandes portions. Le personnel est très gentil, bonus chat !",
    "yorumDe": "Ruhiger Ort, köstliches Essen, große Portionen. Das Personal ist sehr freundlich, Katzenbonus!",
    "yorumIt": "Posto tranquillo, cibo delizioso, porzioni abbondanti. Il personale è molto gentile, bonus gatto!",
    "yorumEs": "Lugar tranquilo, comida deliciosa, porciones generosas. El personal es muy amable, ¡bono gato!",
    "yorumPt": "Lugar tranquilo, comida deliciosa, porções generosas. A equipe é muito gentil, bônus gato!",
    "yorumRu": "Тихое место, вкусная еда, большие порции. Персонал очень добрый, бонус - кошка!",
    "yorumJa": "静かな場所、美味しい料理、大盛り。スタッフはとても親切で、猫ボーナス付き！",
    "yorumZh": "安静的地方，美味的食物，大份。员工非常友善，还有猫咪奖励！",
    "yorumAr": "مكان هادئ، طعام لذيذ، حصص كبيرة. الموظفون لطفاء جداً، مكافأة القطة!"
  },
  {
    "kullanici": "Meda",
    "puan": 5,
    "tarih": "2 ay önce",
    "yorum": "We entered by chance, were warmly welcomed. The cheese toast was very good, service was clean.",
    "yorumTr": "Tesadüfen girdik, sıcak karşılandık. Peynirli tost çok iyiydi, servis temizdi.",
    "yorumEn": "We entered by chance, were warmly welcomed. The cheese toast was very good, service was clean.",
    "yorumFr": "Nous sommes entrés par hasard, avons été chaleureusement accueillis. Le toast au fromage était excellent, le service était impeccable.",
    "yorumDe": "Wir kamen zufällig herein, wurden herzlich empfangen. Der Käsetoast war sehr gut, der Service war sauber.",
    "yorumIt": "Siamo entrati per caso, siamo stati calorosamente accolti. Il toast al formaggio era ottimo, il servizio era pulito.",
    "yorumEs": "Entramos por casualidad, fuimos cálidamente recibidos. El tost de queso estaba muy bueno, el servicio era impecable.",
    "yorumPt": "Entramos por acaso, fomos recebidos calorosamente. O torrada de queijo estava muito boa, o serviço era limpo.",
    "yorumRu": "Мы зашли случайно, нас тепло встретили. Сырный тост был отличный, обслуживание чистое.",
    "yorumJa": "偶然入りましたが、温かく迎えられました。チーズトーストはとても美味しく、サービスも清潔でした。",
    "yorumZh": "我们偶然进入，受到了热烈欢迎。奶酪吐司非常好，服务很干净。",
    "yorumAr": "دخلنا بالصدفة، تم استقبالنا بحفاوة. كان التوست بالجبن رائعاً، والخدمة نظيفة."
  },
  {
    "kullanici": "Laurine Daougabel",
    "puan": 5,
    "tarih": "1 ay önce",
    "yorum": "Close to Galata Tower, perfect breakfast/brunch place on a quiet street.",
    "yorumTr": "Galata Kulesi'ne yakın, sessiz bir sokakta mükemmel kahvaltı/brunch yeri.",
    "yorumEn": "Close to Galata Tower, perfect breakfast/brunch place on a quiet street.",
    "yorumFr": "Près de la Tour de Galata, endroit parfait pour petit-déjeuner/brunch dans une rue tranquille.",
    "yorumDe": "Nah am Galata Tower, perfekter Frühstücks-/Brunchplatz in einer ruhigen Straße.",
    "yorumIt": "Vicino alla Torre di Galata, posto perfetto per colazione/brunch in una via tranquilla.",
    "yorumEs": "Cerca de la Torre de Gálata, lugar perfecto para desayuno/brunch en una calle tranquila.",
    "yorumPt": "Perto da Torre de Gálata, lugar perfeito para café da manhã/brunch em uma rua tranquila.",
    "yorumRu": "Рядом с Галатской башней, идеальное место для завтрака/бранча на тихой улице.",
    "yorumJa": "ガラタ塔の近く、静かな通りにある完璧な朝食/ブランチの場所。",
    "yorumZh": "靠近加拉塔塔，在一条安静的街道上享用早餐/早午餐的完美场所。",
    "yorumAr": "قريب من برج جالاتا، مكان مثالي للإفطار/برانش في شارع هادئ."
  },
  {
    "kullanici": "Olga Burkina",
    "puan": 5,
    "tarih": "2 ay önce",
    "yorum": "Food is delicious, prices are reasonable, service is excellent. Quiet atmosphere.",
    "yorumTr": "Yemekler lezzetli, fiyatlar uygun, hizmet mükemmel. Sessiz bir ortam.",
    "yorumEn": "Food is delicious, prices are reasonable, service is excellent. Quiet atmosphere.",
    "yorumFr": "La nourriture est délicieuse, les prix sont raisonnables, le service est excellent. Atmosphere calme.",
    "yorumDe": "Das Essen ist köstlich, die Preise sind angemessen, der Service ist ausgezeichnet. Ruhige Atmosphäre.",
    "yorumIt": "Il cibo è delizioso, i prezzi sono ragionevoli, il servizio è eccellente. Atmosfera tranquilla.",
    "yorumEs": "La comida es deliciosa, los precios son razonables, el servicio es excelente. Ambiente tranquilo.",
    "yorumPt": "A comida é deliciosa, os preços são razoáveis, o serviço é excelente. Atmosfera tranquila.",
    "yorumRu": "Еда вкусная, цены разумные, обслуживание отличное. Спокойная атмосфера.",
    "yorumJa": "料理は美味しく、価格は手頃で、サービスは素晴らしい。静かな雰囲気。",
    "yorumZh": "食物美味，价格合理，服务出色。安静的氛围。",
    "yorumAr": "الطعام لذيذ، والأسعار معقولة، والخدمة ممتازة. جو هادئ."
  },
  {
    "kullanici": "katia ruiz lopez",
    "puan": 5,
    "tarih": "7 ay önce",
    "yorum": "One of the best places for breakfast next to Galata Tower. Prices are reasonable, atmosphere is comfortable.",
    "yorumTr": "Galata Kulesi'nin yanında kahvaltı için en iyi yerlerden biri. Fiyatlar makul, ortam rahat.",
    "yorumEn": "One of the best places for breakfast next to Galata Tower. Prices are reasonable, atmosphere is comfortable.",
    "yorumFr": "L'un des meilleurs endroits pour petit-déjeuner près de la Tour de Galata. Prix raisonnables, atmosphère agréable.",
    "yorumDe": "Einer der besten Orte für Frühstück neben dem Galata Tower. Preise sind vernünftig, Atmosphäre ist gemütlich.",
    "yorumIt": "Uno dei migliori posti per la colazione vicino alla Torre di Galata. Prezzi ragionevoli, atmosfera confortevole.",
    "yorumEs": "Uno de los mejores lugares para desayunar junto a la Torre de Gálata. Precios razonables, ambiente cómodo.",
    "yorumPt": "Um dos melhores lugares para café da manhã ao lado da Torre de Gálata. Preços razoáveis, atmosfera confortável.",
    "yorumRu": "Одно из лучших мест для завтрака рядом с Галатской башней. Цены разумные, атмосфера уютная.",
    "yorumJa": "ガラタ塔の隣の朝食に最適な場所の一つ。価格は手頃で、雰囲気は快適です。",
    "yorumZh": "加拉塔塔旁边早餐的最佳地点之一。价格合理，氛围舒适。",
    "yorumAr": "من أفضل الأماكن لتناول الإفطار بجوار برج جالاتا. الأسعار معقولة والجو مريح."
  },
  {
    "kullanici": "Anna Levki",
    "puan": 5,
    "tarih": "8 ay önce",
    "yorum": "Very close to Galata, delicious menemen and breakfast menu. Prices are reasonable, atmosphere is peaceful.",
    "yorumTr": "Galata'ya çok yakın, lezzetli menemen ve kahvaltı menüsü. Fiyatlar uygun, ortam huzurlu.",
    "yorumEn": "Very close to Galata, delicious menemen and breakfast menu. Prices are reasonable, atmosphere is peaceful.",
    "yorumFr": "Très près de Galata, délicieux menemen et menu petit-déjeuner. Prix raisonnables, atmosphère paisible.",
    "yorumDe": "Sehr nah an Galata, köstliches Menemen und Frühstücksmenü. Preise sind vernünftig, Atmosphäre ist friedlich.",
    "yorumIt": "Molto vicino a Galata, delizioso menemen e menu colazione. Prezzi ragionevoli, atmosfera pacifica.",
    "yorumEs": "Muy cerca de Gálata, delicioso menemen y menú de desayuno. Precios razonables, ambiente tranquilo.",
    "yorumPt": "Muito perto de Gálata, delicioso menemen e cardápio de café da manhã. Preços razoáveis, atmosfera tranquila.",
    "yorumRu": "Очень близко к Галате, вкусный менемен и меню завтрака. Цены разумные, атмосфера спокойная.",
    "yorumJa": "ガラタのすぐ近く、美味しいメネメンと朝食メニュー。価格は手頃で、雰囲気は平和です。",
    "yorumZh": "非常靠近加拉塔，美味的土耳其炒蛋和早餐菜单。价格合理，氛围宁静。",
    "yorumAr": "قريب جداً من جالاتا، منيمن لذيذ وقائمة إفطار رائعة. الأسعار معقولة والجو هادئ."
  },
  {
    "kullanici": "Emilie Gaudaire",
    "puan": 5,
    "tarih": "5 ay önce",
    "yorum": "Away from the crowds, very sweet cafe. Brunch menu is great, prices are reasonable, San Sebastian is amazing!",
    "yorumTr": "Kalabalıktan uzak, çok tatlı bir kafe. Brunch menüsü harika, fiyatlar uygun, San Sebastian muhteşem!",
    "yorumEn": "Away from the crowds, very sweet cafe. Brunch menu is great, prices are reasonable, San Sebastian is amazing!",
    "yorumFr": "Loin de la foule, café très mignon. Menu brunch excellent, prix raisonnables, San Sebastian est incroyable !",
    "yorumDe": "Weg von den Menschenmassen, sehr süßes Café. Brunch-Menü ist großartig, Preise sind vernünftig, San Sebastian ist fantastisch!",
    "yorumIt": "Lontano dalla folla, caffè molto dolce. Menu brunch è ottimo, prezzi ragionevoli, San Sebastian è fantastico!",
    "yorumEs": "Lejos de las multitudes, café muy lindo. El menú de brunch es genial, los precios son razonables, ¡San Sebastián es increíble!",
    "yorumPt": "Longe das multidões, café muito fofo. O menu de brunch é ótimo, os preços são razoáveis, San Sebastian é incrível!",
    "yorumRu": "Вдали от толпы, очень милое кафе. Меню бранча отличное, цены разумные, Сан-Себастьян потрясающий!",
    "yorumJa": "人混みから離れた、とても可愛いカフェ。ブランチメニューは素晴らしく、価格は手頃で、サンセバスチャンは素晴らしいです！",
    "yorumZh": "远离人群，非常可爱的咖啡馆。早午餐菜单很棒，价格合理，圣塞巴斯蒂安非常棒！",
    "yorumAr": "بعيداً عن الحشود، مقهى لطيف جداً. قائمة البرانش رائعة، والأسعار معقولة، سان سيباستيان مذهل!"
  },
  {
    "kullanici": "cropped curls",
    "puan": 5,
    "tarih": "1 ay önce",
    "yorum": "We regularly have breakfast here. Staff is great, food is perfect.",
    "yorumTr": "Düzenli olarak burada kahvaltı yapıyoruz. Personel harika, yemekler mükemmel.",
    "yorumEn": "We regularly have breakfast here. Staff is great, food is perfect.",
    "yorumFr": "Nous prenons régulièrement le petit-déjeuner ici. Le personnel est excellent, la nourriture est parfaite.",
    "yorumDe": "Wir frühstücken hier regelmäßig. Das Personal ist großartig, das Essen ist perfekt.",
    "yorumIt": "Facciamo colazione qui regolarmente. Il personale è fantastico, il cibo è perfetto.",
    "yorumEs": "Desayunamos aquí regularmente. El personal es genial, la comida es perfecta.",
    "yorumPt": "Tomamos café da manhã aqui regularmente. A equipe é ótima, a comida é perfeita.",
    "yorumRu": "Мы регулярно завтракаем здесь. Персонал отличный, еда идеальная.",
    "yorumJa": "ここで定期的に朝食をとっています。スタッフは素晴らしく、料理は完璧です。",
    "yorumZh": "我们经常在这里吃早餐。员工很棒，食物很完美。",
    "yorumAr": "نتناول الإفطار هنا بانتظام. الموظفون رائعون والطعام مثالي."
  },
  {
    "kullanici": "camelia",
    "puan": 4,
    "tarih": "5 ay önce",
    "yorum": "Small and nice cafe, brunch menu is nice, prices are reasonable.",
    "yorumTr": "Küçük ve hoş bir kafe, brunch menüsü güzel, fiyatlar uygun.",
    "yorumEn": "Small and nice cafe, brunch menu is nice, prices are reasonable.",
    "yorumFr": "Petit café agréable, menu brunch sympa, prix raisonnables.",
    "yorumDe": "Kleines und schönes Café, Brunch-Menü ist nett, Preise sind vernünftig.",
    "yorumIt": "Piccolo e carino caffè, menu brunch carino, prezzi ragionevoli.",
    "yorumEs": "Pequeño y agradable café, el menú de brunch es agradable, los precios son razonables.",
    "yorumPt": "Café pequeno e agradável, menu de brunch é legal, preços são razoáveis.",
    "yorumRu": "Небольшое и милое кафе, меню бранча приятное, цены разумные.",
    "yorumJa": "小さくて素敵なカフェ、ブランチメニューは良い、価格は手頃です。",
    "yorumZh": "小而美的咖啡馆，早午餐菜单不错，价格合理。",
    "yorumAr": "مقهى صغير ولطيف، قائمة البرانش جيدة والأسعار معقولة."
  },
  {
    "kullanici": "Sophie Martin",
    "puan": 5,
    "tarih": "3 ay önce",
    "yorum": "The perfect spot to work or relax. Great coffee, fast WiFi, and the staff is super friendly. I come here weekly.",
    "yorumTr": "Çalışmak veya dinlenmek için mükemmel bir yer. Harika kahve, hızlı WiFi ve personel çok arkadaş canlısı. Her hafta buraya geliyorum.",
    "yorumEn": "The perfect spot to work or relax. Great coffee, fast WiFi, and the staff is super friendly. I come here weekly.",
    "yorumFr": "L'endroit parfait pour travailler ou se détendre. Excellent café, WiFi rapide et le personnel est très amical. Je viens ici chaque semaine.",
    "yorumDe": "Der perfekte Ort zum Arbeiten oder Entspannen. Großartiger Kaffee, schnelles WiFi und das Personal ist super freundlich. Ich komme hier wöchentlich.",
    "yorumIt": "Il posto perfetto per lavorare o rilassarsi. Caffè eccellente, WiFi veloce e il personale è super cordiale. Vengo qui settimanalmente.",
    "yorumEs": "El lugar perfecto para trabajar o relajarse. Excelente café, WiFi rápido y el personal es súper amable. Vengo aquí semanalmente.",
    "yorumPt": "O lugar perfeito para trabalhar ou relaxar. Excelente café, WiFi rápido e a equipe é super amigável. Venho aqui semanalmente.",
    "yorumRu": "Идеальное место для работы или отдыха. Отличный кофе, быстрый WiFi, и персонал очень дружелюбный. Я приезжаю сюда каждую неделю.",
    "yorumJa": "仕事やリラックスに最適な場所。素晴らしいコーヒー、高速WiFi、スタッフは超フレンドリーです。毎週ここに来ています。",
    "yorumZh": "工作或放松的完美场所。极好的咖啡，快速的WiFi，员工非常友好。我每周都来这里。",
    "yorumAr": "المكان المثالي للعمل أو الاسترخاء. قهوة رائعة وواي فاي سريع والموظفون ودودون جداً. آتي هنا أسبوعياً."
  },
  {
    "kullanici": "James Wilson",
    "puan": 5,
    "tarih": "4 ay önce",
    "yorum": "Found this gem while exploring Galata. The avocado toast and latte were outstanding. Will definitely return!",
    "yorumTr": "Galata'yı keşfederken bu mücevheri buldum. Avokado tost ve latte muhteşemdi. Kesinlikle tekrar geleceğim!",
    "yorumEn": "Found this gem while exploring Galata. The avocado toast and latte were outstanding. Will definitely return!",
    "yorumFr": "Trouvé cette pépite en explorant Galata. Le toast à l'avocat et le latte étaient exceptionnels. Je reviendrai définitivement !",
    "yorumDe": "Habe dieses Juwel beim Erkunden von Galata gefunden. Der Avocado-Toast und Latte waren herausragend. Ich werde definitiv wiederkommen!",
    "yorumIt": "Trovato questo gioiello esplorando Galata. Il toast avocado e il latte erano eccezionali. Tornerò sicuramente!",
    "yorumEs": "Encontré esta joya mientras exploraba Gálata. El tost de aguacate y el latte fueron excepcionales. ¡Definitivamente volveré!",
    "yorumPt": "Encontrei esta joia enquanto explorava Gálata. O torrada de abacate e o latte foram excepcionais. Com certeza voltarei!",
    "yorumRu": "Нашел эту жемчужину, исследуя Галату. Тост с авокадо и латте были превосходными. Обязательно вернусь!",
    "yorumJa": "ガラタを探索している時にこの宝石を見つけました。アボカドトーストとラテは素晴らしかったです。絶対に戻ります！",
    "yorumZh": "在探索加拉塔时发现了这颗宝石。鳄梨吐司和拿铁非常出色。一定会回来的！",
    "yorumAr": "اكتشفت هذه الجوهرة أثناء استكشاف جالاتا. كان توست الأفوكادو واللاتيه استثنائيين. سأعود بالتأكيد!"
  },
  {
    "kullanici": "Maria Garcia",
    "puan": 5,
    "tarih": "1 ay önce",
    "yorum": "Beautiful atmosphere, delicious pastries, and excellent service. This is my new favorite cafe in Istanbul.",
    "yorumTr": "Güzel bir atmosfer, lezzetli pastane ürünleri ve mükemmel hizmet. Bu İstanbul'daki yeni favori kafem.",
    "yorumEn": "Beautiful atmosphere, delicious pastries, and excellent service. This is my new favorite cafe in Istanbul.",
    "yorumFr": "Belle atmosphère, délicieuses pâtisseries et excellent service. C'est mon nouveau café préféré à Istanbul.",
    "yorumDe": "Schöne Atmosphäre, köstliche Gebäck und exzellenter Service. Dies ist mein neuer Lieblingscafé in Istanbul.",
    "yorumIt": "Bella atmosfera, deliziosi dolci e servizio eccellente. Questo è il mio nuovo caffè preferito a Istanbul.",
    "yorumEs": "Hermosa atmósfera, deliciosos pasteles y servicio excelente. Este es mi nuevo café favorito en Estambul.",
    "yorumPt": "Linda atmosfera, doces deliciosos e serviço excelente. Este é meu novo café favorito em Istambul.",
    "yorumRu": "Красивая атмосфера, вкусная выпечка и отличный сервис. Это мой новый любимый кафе в Стамбуле.",
    "yorumJa": "美しい雰囲気、美味しいペストリー、素晴らしいサービス。これがイスタンブールで私の新しいお気に入りのカフェです。",
    "yorumZh": "美丽的氛围，美味的糕点，出色的服务。这是我在伊斯坦布尔新最喜欢的咖啡馆。",
    "yorumAr": "جو جميل وحلويات لذيذة وخدمة ممتازة. هذا مقهى المفضل الجديد في إسطنبول."
  },
  {
    "kullanici": "Thomas Anderson",
    "puan": 4,
    "tarih": "2 ay önce",
    "yorum": "Nice place with good coffee. The design is minimal and modern. Would recommend for a quick stop.",
    "yorumTr": "İyi kahveli güzel bir yer. Tasarım minimal ve modern. Hızlı bir mola için tavsiye ederim.",
    "yorumEn": "Nice place with good coffee. The design is minimal and modern. Would recommend for a quick stop.",
    "yorumFr": "Beau endroit avec un bon café. Le design est minimal et moderne. Je recommande pour une halte rapide.",
    "yorumDe": "Schöner Ort mit gutem Kaffee. Das Design ist minimalistisch und modern. Würde für einen kurzen Halt empfehlen.",
    "yorumIt": "Bello posto con ottimo caffè. Il design è minimalista e moderno. Lo consiglio per una sosta veloce.",
    "yorumEs": "Lindo lugar con buen café. El diseño es minimalista y moderno. Recomendaría para una parada rápida.",
    "yorumPt": "Lugar agradável com bom café. O design é minimalista e moderno. Recomendaria para uma parada rápida.",
    "yorumRu": "Приятное место с хорошим кофе. Дизайн минималистичный и современный. Рекомендую для быстрой остановки.",
    "yorumJa": "良いコーヒーのある素敵な場所。デザインはミニマルでモダン。短い休憩におすすめです。",
    "yorumZh": "好地方，有好咖啡。设计简约现代。推荐快速停靠。",
    "yorumAr": "مكان جميل بقهوة جيدة. التصميم بسيط وحديث. أنصح لوقف سريع."
  },
  {
    "kullanici": "Lisa Chen",
    "puan": 5,
    "tarih": "6 ay önce",
    "yorum": "Incredible Turkish breakfast spread! Fresh ingredients, amazing presentation, and the view adds to the experience.",
    "yorumTr": "İnanılmaz bir Türk kahvaltısı! Taze malzemeler, harika sunum ve manzara deneyimi tamamlıyor.",
    "yorumEn": "Incredible Turkish breakfast spread! Fresh ingredients, amazing presentation, and the view adds to the experience.",
    "yorumFr": "Étalage de petit-déjeuner turc incroyable ! Ingrédients frais, présentation étonnante et la vue ajoute à l'expérience.",
    "yorumDe": "Unglaublicher türkischer Frühstücksaufschnitt! Frische Zutaten, erstaunliche Präsentation und die Aussicht ergänzt das Erlebnis.",
    "yorumIt": "Fantastico assortimento di colazione turca! Ingredienti freschi, presentazione incredibile e la vista completa l'esperienza.",
    "yorumEs": "¡Increíble variedad de desayuno turco! Ingredientes frescos, presentación increíble y la vista añade a la experiencia.",
    "yorumPt": "Incrível variedade de café da manhã turco! Ingredientes frescos, apresentação incrível e a vista completa a experiência.",
    "yorumRu": "Невероятный турецкий завтрак! Свежие ингредиенты, потрясающая подача, и вид дополняет впечатления.",
    "yorumJa": "信じられないほど素晴らしいトルコの朝食！新鮮な食材、素晴らしい盛り付け、景色が体験を深めます。",
    "yorumZh": "令人难以置信的土耳其早餐！新鲜食材，令人惊叹的呈现，景色更添体验。",
    "yorumAr": "مزيج إفطار تركي لا يصدق! مكونات طازجة وعرض رائع والمنظر يضيف للتجربة."
  },
  {
    "kullanici": "David Brown",
    "puan": 5,
    "tarih": "3 ay önce",
    "yorum": "Best flat white in the neighborhood. Cozy spot with great music. Staff makes you feel like family.",
    "yorumTr": "Mahalledeki en iyi flat white. Harika müzikli rahatlatıcı bir yer. Personel sizi aile gibi hissettirir.",
    "yorumEn": "Best flat white in the neighborhood. Cozy spot with great music. Staff makes you feel like family.",
    "yorumFr": "Meilleur flat white du quartier. Endroit confortable avec une excellente musique. Le personnel vous fait sentir comme en famille.",
    "yorumDe": "Bester Flat White in der Nachbarschaft. Gemütlicher Ort mit großartiger Musik. Das Personal lässt Sie sich wie zu Hause fühlen.",
    "yorumIt": "Miglior flat white nel quartiere. Posto accogliente con ottima musica. Il personale ti fa sentire come in famiglia.",
    "yorumEs": "Mejor flat white del vecindario. Lugar acogedor con excelente música. El personal te hace sentir como en familia.",
    "yorumPt": "Melhor flat white do bairro. Lugar aconchegante com ótima música. A equipe te faz se sentir como família.",
    "yorumRu": "Лучший флэт уайт в округе. Уютное место с отличной музыкой. Персонал заставляет чувствовать себя как дома.",
    "yorumJa": "近所で最高のフラットホワイト。素晴らしい音楽のある心地良い場所。スタッフが家族のように感じさせてくれます。",
    "yorumZh": "附近最好的白咖啡。音乐很好的舒适地点。员工让你感到宾至如归。",
    "yorumAr": "أفضل فلات وايت في الحي. مكان مريح مع موسيقى رائعة. الموظفون يجعلك تشعر كأنك في المنزل."
  },
  {
    "kullanici": "Amélie Dubois",
    "puan": 5,
    "tarih": "5 ay önce",
    "yorum": "Un coin caché magnifique près de la Tour de Galata. Les gozleme sont délicieuses et l'ambiance est parfaite pour déjeuner.",
    "yorumTr": "Galata Kulesi'nin yakınında gizli bir köşe. Gözlemeler lezzetli ve ambiyans öğle yemeği için mükemmel.",
    "yorumEn": "A magnificent hidden corner near Galata Tower. The gozleme are delicious and the atmosphere is perfect for lunch.",
    "yorumFr": "Un coin caché magnifique près de la Tour de Galata. Les gozleme sont délicieuses et l'ambiance est parfaite pour déjeuner.",
    "yorumDe": "Eine herrliche versteckte Ecke in der Nähe des Galata Tower. Die Gözleme sind köstlich und die Atmosphäre ist perfekt zum Mittagessen.",
    "yorumIt": "Un angolo nascosto magnifico vicino alla Torre di Galata. I gözleme sono deliziosi e l'atmosfera è perfetta per il pranzo.",
    "yorumEs": "Un rincón escondido magnífico cerca de la Torre de Gálata. Los gözleme son deliciosos y el ambiente es perfecto para almorzar.",
    "yorumPt": "Um canto escondido magnífico perto da Torre de Gálata. Os gözleme são deliciosos e a atmosfera é perfeita para almoçar.",
    "yorumRu": "Великолепный скрытый уголок возле Галатской башни. Гёзлеме вкусные, атмосфера идеальна для обеда.",
    "yorumJa": "ガラタ塔近くの素晴らしい隠れた場所。ギョズレメは美味しく、雰囲気はランチに最適です。",
    "yorumZh": "加拉塔塔附近的华丽隐蔽角落。烤饼很美味，氛围非常适合午餐。",
    "yorumAr": "ركن مخفي رائع بالقرب من برج جالاتا. الغوزليم لذيذة والجو مثالي لتناول الغداء."
  },
  {
    "kullanici": "Paolo Rossi",
    "puan": 5,
    "tarih": "2 ay önce",
    "yorum": "Ottimo caffè italiano, atmosfera rilassante. Il personale è gentilissimo e i dolci sono da provare!",
    "yorumTr": "Mükemmel İtalyan kahvesi, rahatlatıcı bir atmosfer. Personel çok nazik ve tatlıları denemelisiniz!",
    "yorumEn": "Excellent Italian coffee, relaxing atmosphere. The staff is very kind and the desserts are to die for!",
    "yorumFr": "Excellent café italien, atmosphère relaxante. Le personnel est très gentil et les desserts sont à essayer !",
    "yorumDe": "Ausgezeichneter italienischer Kaffee, entspannende Atmosphäre. Das Personal ist sehr freundlich und die Süßigkeiten sind einen Versuch wert!",
    "yorumIt": "Ottimo caffè italiano, atmosfera rilassante. Il personale è gentilissimo e i dolci sono da provare!",
    "yorumEs": "Excelente café italiano, ambiente relajante. ¡El personal es muy amable y los postres hay que probarlos!",
    "yorumPt": "Excelente café italiano, atmosfera relaxante. A equipe é muito gentil e os doces são para experimentar!",
    "yorumRu": "Отличный итальянский кофе, расслабляющая атмосфера. Персонал очень добрый, десерты обязательно стоит попробовать!",
    "yorumJa": "素晴らしいイタリアンコーヒー、リラックスできる雰囲気。スタッフはとても親切で、デザートは試してみる価値があります！",
    "yorumZh": "出色的意大利咖啡，轻松的氛围。员工非常友好，甜点值得一试！",
    "yorumAr": "قهوة إيطالية ممتازة، جو مريح. الموظفون لطفاء جداً والحلويات تستحق التجربة!"
  },
  {
    "kullanici": "Hans Mueller",
    "puan": 5,
    "tarih": "4 ay önce",
    "yorum": "Toller Ort zum Entspannen. Kaffee ist ausgezeichnet und die Atmosphäre ist sehr entspannend.",
    "yorumTr": "Rahatlama için harika bir yer. Kahve mükemmel ve atmosfer çok rahatlatıcı.",
    "yorumEn": "Great place to relax. Coffee is excellent and the atmosphere is very relaxing.",
    "yorumFr": "Excellent endroit pour se détendre. Le café est excellent et l'atmosphère est très relaxante.",
    "yorumDe": "Toller Ort zum Entspannen. Kaffee ist ausgezeichnet und die Atmosphäre ist sehr entspannend.",
    "yorumIt": "Ottimo posto per rilassarsi. Il caffè è eccellente e l'atmosfera è molto rilassante.",
    "yorumEs": "Excelente lugar para relajarse. El café es excelente y el ambiente es muy relajante.",
    "yorumPt": "Ótimo lugar para relaxar. O café é excelente e a atmosfera é muito relaxante.",
    "yorumRu": "Отличное место для отдыха. Кофе превосходный и атмосфера очень расслабляющая.",
    "yorumJa": "リラックスするのに最適な場所。コーヒーは素晴らしく、雰囲気はとてもリラックスできます。",
    "yorumZh": "放松的好地方。咖啡很棒，氛围非常轻松。",
    "yorumAr": "مكان رائع للاسترخاء. القهوة ممتازة والجو مريح جداً."
  },
  {
    "kullanici": "Yuki Tanaka",
    "puan": 5,
    "tarih": "1 ay önce",
    "yorum": "Great atmosphere, authentic Turkish breakfast, and very friendly staff. Highly recommend!",
    "yorumTr": "Harika bir atmosfer, otantik Türk kahvaltısı ve çok arkadaş canlısı personel. Şiddetle tavsiye ederim!",
    "yorumEn": "Great atmosphere, authentic Turkish breakfast, and very friendly staff. Highly recommend!",
    "yorumFr": "Excellente atmosphère, petit-déjeuner turc authentique et personnel très amical. Je recommande vivement !",
    "yorumDe": "Großartige Atmosphäre, authentisches türkisches Frühstück und sehr freundliches Personal. Sehr empfehlenswert!",
    "yorumIt": "Ottima atmosfera, colazione turca autentica e personale molto cordiale. Consiglio vivamente!",
    "yorumEs": "Excelente ambiente, desayuno turco auténtico y personal muy amable. ¡Altamente recomendado!",
    "yorumPt": "Ótima atmosfera, café da manhã turco autêntico e equipe muito amigável. Altamente recomendado!",
    "yorumRu": "Прекрасная атмосфера, аутентичный турецкий завтрак и очень дружелюбный персонал. Настоятельно рекомендую!",
    "yorumJa": "素晴らしい雰囲気、本格的なトルコの朝食、非常にフレンドリーなスタッフ。強くお勧めします！",
    "yorumZh": "很棒的 atmosphere，正宗的土耳其早餐，非常友好的员工。强烈推荐！",
    "yorumAr": "جو رائع وإفطار تركي أصيل وموظفون ودودون جداً. أنصح بشدة!"
  },
  {
    "kullanici": "Alexandra Popov",
    "puan": 5,
    "tarih": "3 ay önce",
    "yorum": "Charming cafe with excellent food. The San Sebastian cheesecake is a must-try. Perfect for breakfast or brunch.",
    "yorumTr": "Mükemmel yemekli büyüleyici bir kafe. San Sebastian cheesecake denemelisiniz. Kahvaltı veya brunch için mükemmel.",
    "yorumEn": "Charming cafe with excellent food. The San Sebastian cheesecake is a must-try. Perfect for breakfast or brunch.",
    "yorumFr": "Café charmant avec d'excellents plats. Le cheesecake San Sebastian est à essayer. Parfait pour petit-déjeuner ou brunch.",
    "yorumDe": "Charmantes Café mit ausgezeichnetem Essen. Der San Sebastian Cheesecake ist ein Muss. Perfekt für Frühstück oder Brunch.",
    "yorumIt": "Delizioso caffè con cibo eccellente. La cheesecake San Sebastian è da provare. Perfetto per colazione o brunch.",
    "yorumEs": "Encantador café con excelente comida. El cheesecake San Sebastián es imperdible. Perfecto para desayuno o brunch.",
    "yorumPt": "Café charmoso com excelente comida. O cheesecake de San Sebastián é imperdível. Perfeito para café da manhã ou brunch.",
    "yorumRu": "Очаровательное кафе с отличной едой. Чизкейк Сан-Себастьян обязательно стоит попробовать. Идеально для завтрака или бранча.",
    "yorumJa": "美味しい料理のある魅力的なカフェ。サンセバスチャンチーズケーキは必見です。朝食やブランチに最適。",
    "yorumZh": "迷人的咖啡馆，食物出色。圣塞巴斯蒂安芝士蛋糕是必试的。早餐或早午餐的完美选择。",
    "yorumAr": "مقهى ساحر مع طعام ممتاز. كعكة الجبن سان سيباستيان واجبة التجربة. مثالية للإفطار أو البرانش."
  },
  {
    "kullanici": "Mohamed Hassan",
    "puan": 5,
    "tarih": "2 ay önce",
    "yorum": "Peaceful environment, great coffee, and delicious food. The staff is welcoming and the place has a wonderful vibe.",
    "yorumTr": "Huzurlu bir ortam, harika kahve ve lezzetli yemekler. Personel sıcakkanlı ve yerin harika bir havası var.",
    "yorumEn": "Peaceful environment, great coffee, and delicious food. The staff is welcoming and the place has a wonderful vibe.",
    "yorumFr": "Environnement paisible, excellent café et nourriture délicieuse. Le personnel est accueillant et l'endroit a une ambiance merveilleuse.",
    "yorumDe": "Friedliche Umgebung, großartiger Kaffee und köstliches Essen. Das Personal ist einladend und der Ort hat eine wunderbare Atmosphäre.",
    "yorumIt": "Ambiente tranquillo, ottimo caffè e cibo delizioso. Il personale è accogliente e il locale ha un'atmosfera meravigliosa.",
    "yorumEs": "Ambiente tranquilo, excelente café y comida deliciosa. El personal es acogedor y el lugar tiene un ambiente maravilloso.",
    "yorumPt": "Ambiente tranquilo, ótimo café e comida deliciosa. A equipe é acolhedora e o lugar tem uma vibe maravilhosa.",
    "yorumRu": "Спокойная обстановка, отличный кофе и вкусная еда. Персонал приветливый, и место имеет замечательную атмосферу.",
    "yorumJa": "平和な環境、素晴らしいコーヒー、美味しい料理。スタッフは歓迎的で、場所には素晴らしい雰囲気があります。",
    "yorumZh": "宁静的环境，很棒的咖啡和美味的食物。员工很热情，这个地方有着美妙的氛围。",
    "yorumAr": "بيئة مسالمة وقهوة رائعة وطعام لذيذ. الموظفون ودودون والمكان لديه أجواء رائعة."
  }
];

async function seedReviews() {
  try {
    console.log('Firebase başlatılıyor...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log(`\n${reviews.length} adet yorum Firebase'e ekleniyor...\n`);

    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      const createdAt = parseRelativeDate(review.tarih);

      const reviewData: any = {
        authorName: review.kullanici,
        rating: review.puan,
        text: review.yorum, // Original text (default)
        visible: true,
        featured: review.puan === 5 && i < 10, // İlk 10 tane 5 yıldızlı yorumu öne çıkar
        createdAt: Timestamp.fromDate(createdAt),
        updatedAt: Timestamp.now(),
      };
      
      // Add translations if they exist
      if (review.yorumTr) reviewData.textTr = review.yorumTr;
      if (review.yorumEn) reviewData.textEn = review.yorumEn;
      if (review.yorumFr) reviewData.textFr = review.yorumFr;
      if (review.yorumDe) reviewData.textDe = review.yorumDe;
      if (review.yorumIt) reviewData.textIt = review.yorumIt;
      if (review.yorumEs) reviewData.textEs = review.yorumEs;
      if (review.yorumPt) reviewData.textPt = review.yorumPt;
      if (review.yorumRu) reviewData.textRu = review.yorumRu;
      if (review.yorumJa) reviewData.textJa = review.yorumJa;
      if (review.yorumZh) reviewData.textZh = review.yorumZh;
      if (review.yorumAr) reviewData.textAr = review.yorumAr;
      
      // Opsiyonel field'ları sadece varsa ekle
      // (Firebase undefined kabul etmez)

      await addDoc(collection(db, 'reviews'), reviewData);
      console.log(`✓ ${i + 1}. ${review.kullanici} - ${review.puan}⭐ - "${review.yorum.substring(0, 50)}..."`);
    }

    console.log(`\n✅ Tüm yorumlar başarıyla Firebase'e eklendi!`);
    console.log(`📊 Toplam: ${reviews.length} yorum`);
    
    const featuredCount = reviews.filter((r, i) => r.puan === 5 && i < 10).length;
    console.log(`⭐ Öne çıkan yorumlar: ${featuredCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

seedReviews();

