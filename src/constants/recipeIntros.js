// Tarif giriş metinleri — yemeğin yöresi, hikayesi ve püf noktaları.
// recipes.js yerine ayrı dosyada, tarif id'sine göre tutuluyor: admin
// panelinden override edilmiş tariflerde (Firestore'daki kopya bu alanı
// taşımaz) metin kaybolmasın, web ve mobil aynı kaynağı kullansın.
// Paragraflar boş satırla (\n\n) ayrılır. Şimdilik yalnızca Türkçe.
export const RECIPE_INTROS = {
  'kebab': {
    tr: `Adana kebabı, adını aldığı şehrin mutfak kültürüyle özdeşleşmiş, coğrafi işaretle tescilli bir lezzet. Ustasının elinde zırhla kıyılan kuzu eti ve kuyruk yağı, isot ve pul biberle yoğrulup geniş yassı şişlere sarılır; mangalın közünde birkaç dakikada pişer.

Adana kebabını diğer kıyma kebaplarından ayıran şey acısı ve yağ dengesidir. Kuyruk yağı hem lezzeti taşır hem de etin şişte tutunmasını sağlar; yağı azaltırsanız kebap şişten düşer, kuru kalır. Evde zırh yoksa kıymayı kasabınıza iki kez çektirmek en yakın sonucu verir.

Püf noktası: Harcı yapışkan bir kıvama gelene kadar uzun süre yoğurun ve en az iki saat dinlendirin. Közün alevsiz, kor halinde olması şart; alev, kebabın dışını yakıp içini çiğ bırakır. Lavaşı közün üzerinde birkaç saniye ısıtıp kebabın yağını emdirerek servis edin.`,
  },
  'iskender-kebap': {
    tr: `İskender kebabı, Bursa'nın simgesi haline gelmiş, dünyanın dört bir yanında bilinen bir Türk lezzeti. Yaygın anlatıma göre 19. yüzyılda Bursa'da İskender Efendi, kuzu etini yatay yerine dikey bir şişte pişirmeyi denemiş ve bugün döner dediğimiz pişirme yöntemi de bu yemekle birlikte ün kazanmıştır.

Bir İskender tabağının dört katmanı vardır: küp küp doğranmış pide, onu ıslatan domates sosu, ince kesilmiş döner ve masada üzerine cızırdatılarak dökülen kızgın tereyağı. Yanında oda sıcaklığında yoğurt ve közlenmiş biber bulunur.

Püf noktası: Tereyağını köpürene kadar kızdırın ve hemen, sofrada dökün; cızırtı bu yemeğin bir parçasıdır. Yoğurdu buzdolabından servis öncesinde çıkarın, soğuk yoğurt sıcak eti ve tereyağını hemen soğutur. İskender bekletilmeden, ilk kaşık sıcakken yenir.`,
  },
  'manti': {
    tr: `Kayseri mantısı, Türk mutfağının en emek isteyen yemeklerinden biri ve coğrafi işaretle tescilli bir lezzet. Kayseri'de iyi mantının ölçüsü küçüklüğüdür; bir kaşığa kırk mantı sığması gerektiği söylenir. Eskiden gelin adaylarının becerisinin mantının inceliğiyle ölçüldüğü anlatılır.

Tarifin temeli sade: unlu bir hamur, soğanlı kıyma ve üzerine sarımsaklı yoğurt ile kırmızı biberli tereyağı. Farkı yaratan, hamurun inceliği ve mantıların özenle kapatılmasıdır. Kayseri'de mantı kurutularak kışlık olarak da saklanır.

Püf noktası: Hamuru açmadan önce mutlaka dinlendirin; dinlenmeyen hamur açılırken geri çeker. Mantıları kapatırken dört köşeyi ortada sıkıca birleştirin ki haşlarken açılmasın. Sarımsaklı yoğurdu oda sıcaklığında hazırlayın, tereyağına naneyi en son ekleyip yakmadan gezdirin.`,
  },
  'lahmacun': {
    tr: `Lahmacun, adını Arapça "hamurlu et" anlamına gelen bir ifadeden alır ve Güneydoğu Anadolu'nun, özellikle Gaziantep ve Şanlıurfa'nın vazgeçilmez fırın lezzetidir. Bölgede çoğu zaman evde hazırlanan harç mahalle fırınına götürülür, taş fırında saniyeler içinde pişirilir.

İyi bir lahmacunun hamuru kâğıt kadar incedir, kenarları çıtır, ortası hafif yumuşak kalır. Harç kıymayla birlikte bol soğan, domates, biber ve salçadan oluşur; pişince üzerine maydanoz konur, limon sıkılır ve dürüm gibi sarılarak yenir.

Püf noktası: Harcın sulu olması gerekir; kuru harç fırında yanar ve hamura yapışmaz. Ev fırınında en iyi sonuç için fırını en yüksek ısıya getirin, mümkünse bir pizza taşı ya da ters çevrilmiş tepsiyi fırınla birlikte ısıtıp lahmacunu doğrudan onun üzerinde pişirin.`,
  },
  'kunefe': {
    tr: `Künefe, Hatay'ın simgesi olan ve coğrafi işaretle tescilli bir şerbetli tatlı. Tel kadayıfın arasına tuzsuz, uzayan Hatay peyniri konur, tereyağıyla bakır tepside pişirilir ve sıcakken üzerine soğuk şerbet dökülür. Antakya'da künefe genellikle sipariş üzerine, gözünüzün önünde hazırlanır.

Künefeyi özel kılan, dışının çıtır, içindeki peynirin ise sıcak ve uzayan kıvamda olmasıdır. Bu yüzden önceden yapılıp bekletilen bir tatlı değildir; fırından ya da ocaktan çıkar çıkmaz servis edilir.

Püf noktası: Peyniriniz tuzluysa birkaç saat suda bekletip tuzunu alın. Kadayıfı tereyağıyla iyice ovun ki her tel yağlansın, yoksa kızarmaz. Şerbet soğuk, künefe sıcak olmalı; ikisi de sıcak olursa kadayıf yumuşar. Üzerine taze çekilmiş Antep fıstığı serpin.`,
  },
  'baklava': {
    tr: `Baklava, Osmanlı saray mutfağından bugüne uzanan, Türk tatlıcılığının en bilinen temsilcisi. Gaziantep baklavası ise bu geleneğin zirvesi kabul edilir: Antep baklavası, 2013 yılında Avrupa Birliği'nde coğrafi işaretle koruma altına alınan ilk Türk ürünü olmuştur.

İyi bir baklavanın sırrı yufkanın inceliği, bol ve kaliteli tereyağı ve taze Antep fıstığıdır. Ustalar yufkayı ışığı geçirecek kadar ince açar. Evde ince hazır yufkayla da başarılı bir sonuç almak mümkün.

Püf noktası: Baklavayı fırına vermeden, yufkalar çiğken dilimleyin; piştikten sonra kesmeye çalışırsanız katlar dağılır. Şerbet tamamen soğuk, baklava fırından yeni çıkmış ve sıcak olmalı. Şerbeti dökünce baklavayı birkaç saat dinlendirin ki şerbeti eşit şekilde çeksin.`,
  },
  'karniyarik': {
    tr: `Karnıyarık, Türk mutfağında patlıcana duyulan sevginin en bilinen örneklerinden biri. Adını, kızartılan patlıcanların "karnının yarılıp" içine kıymalı harç doldurulmasından alır. İmam bayıldının etli kardeşi sayılabilir; ev sofralarının ve esnaf lokantalarının vazgeçilmez yaz yemeğidir.

Patlıcanlar önce alacalı soyulup kızartılır, sonra soğan, kıyma, domates ve biberle hazırlanan harçla doldurulur ve fırında pişirilir. Yanına pirinç pilavı ve cacık çok yakışır.

Püf noktası: Patlıcanları kızartmadan önce tuzlu suda bekletip iyice kurulayın; hem acısı gider hem de daha az yağ çeker. Kızardıktan sonra yağlı kâğıda alın. Patlıcanı ortadan yararken altını kesmemeye dikkat edin, harç dökülmesin. Fırına verirken tepsiye biraz sıcak su eklerseniz patlıcanlar kurumaz.`,
  },
  'mercimek-corbasi': {
    tr: `Mercimek çorbası, Anadolu'nun hemen her evinde ve lokantasında bulunan, Türk mutfağının en temel çorbası. Kırmızı mercimeğin kısa sürede dağılıp kadifemsi bir kıvam vermesi, onu hem kolay hem de doyurucu bir yemek yapar. Kış akşamlarının, hasta yatağının ve lokanta sabahlarının ortak çorbasıdır.

Tarifin bu versiyonunda soğan, havuç ve patates hem tatlılık hem de kıvam katar. Üzerine gezdirilen pul biberli tereyağı ve masada sıkılan limon, çorbanın tadını tamamlayan iki dokunuştur.

Püf noktası: Mercimeği pişirmeden önce suyu berraklaşana kadar yıkayın, köpük azalır. Çorbayı blenderdan geçirdikten sonra kıvamını sıcak suyla ayarlayın; çorba bekledikçe koyulaşır. Kimyonu en sonda ekleyin, uzun pişerse acılaşabilir.`,
  },
  'testi-kebabi': {
    tr: `Testi kebabı, Kapadokya'nın, özellikle Nevşehir ve Avanos'un simge yemeği. Kızılırmak kilinden yapılan çömlekleriyle ünlü Avanos'un toprak testileri, bu yemeğin hem pişirme kabı hem de sunum gösterisidir: et ve sebzeler testide saatlerce kendi buharında pişer, sofrada testinin ağzı kırılarak açılır.

Kuzu eti, domates, biber, soğan ve sarımsakla birlikte ağzı hamurla kapatılmış testide ağır ağır pişer. Kapalı kap sayesinde etin suyu ve aroması dışarı kaçmaz, et lokum gibi yumuşar.

Püf noktası: Eti testiye koymadan önce yüksek ateşte her yüzünü mühürleyin; böylece suyunu içinde tutar. Testiyi tamamen doldurmayın, buhar için yer kalsın. Testi yoksa ağzı folyoyla sıkıca kapatılmış bir güveç de iyi sonuç verir.`,
  },
  'giresun-hamsili-pilav': {
    tr: `Hamsili pilav, Karadeniz'in kış sofralarının gösterişli yemeği. Hamsi mevsiminde Giresun'dan Rize'ye kadar sahil boyunca hazırlanır; tepsinin tabanına ve kenarlarına dizilen hamsiler, iç pilavla doldurulup fırında pişirilir ve ters çevrilerek altın rengi bir kubbe gibi sofraya gelir.

Giresun usulünde iç pilava bölgenin meşhur fındığı, kuru üzüm, dereotu, tarçın ve yenibahar katılır. Fındık pilava hem çıtırlık hem de Karadeniz'e özgü bir aroma verir.

Püf noktası: Hamsileri kılçıklarını ayıklayıp ikiye açın ve derileri tepsiye bakacak şekilde dizin; ters çevirdiğinizde parlak yüzleri üstte kalır. İç pilavı tam pişirmeyin, fırında hamsiyle birlikte pişmeye devam edecek. Ters çevirmeden önce birkaç dakika dinlendirin ki pilav dağılmasın.`,
  },
}

export function getRecipeIntro(recipeId, lang = 'tr') {
  return RECIPE_INTROS[recipeId]?.[lang] || null
}
