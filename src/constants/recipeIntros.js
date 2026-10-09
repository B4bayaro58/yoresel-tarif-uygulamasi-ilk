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

  // ── 2. grup (20 tarif) ──
  'hunkar-begendi': {
    tr: `Hünkâr beğendi, adındaki "hünkâr" kelimesinin işaret ettiği gibi Osmanlı saray mutfağından gelen bir yemek. Yaygın anlatıma göre 19. yüzyılda İstanbul'u ziyaret eden Fransız İmparatoriçesi Eugénie'ye sunulmuş ve çok beğenilmiştir; adının bu hikayeden geldiği söylenir.

Yemek iki ayrı hazırlıktan oluşur: ağır ateşte yumuşayana kadar pişen domatesli kuzu yahnisi ve közlenmiş patlıcanla yapılan, sütlü ve kaşarlı "beğendi". Közün dumanlı aroması ile tereyağlı beşamelin buluştuğu bu beğendi, yemeği sıradan bir et yemeğinden ayırır.

Püf noktası: Patlıcanları doğrudan ateşte, kabukları tamamen kömürleşene kadar közleyin; dumanlı tat buradan gelir. Soyduktan sonra limonlu suya atarsanız kararmazlar. Sütü una yavaş yavaş, ılık olarak ekleyin ki beğendi topaklanmasın.`,
  },
  'imam-bayildi': {
    tr: `İmam bayıldı, Türk mutfağının en ünlü zeytinyağlılarından biri. Adının hikayesi üzerine farklı rivayetler anlatılır: kimine göre yemeği tadan imam lezzetinden bayılmış, kimine göre ise yemeğe giden zeytinyağının miktarını duyunca. Hangisi doğru olursa olsun, bu yemeğin ruhu gerçekten bol ve iyi zeytinyağıdır.

Karnıyarığın etsiz kardeşi sayılan imam bayıldıda patlıcanlar kızartılmadan, yavaşça karamelize edilmiş soğan, sarımsak, domates ve maydanozla doldurulup kısık ateşte zeytinyağıyla pişirilir.

Püf noktası: Soğanları acele etmeden, kısık ateşte uzun süre kavurun; yemeğin tatlı derinliği bu adımdan gelir. Tüm zeytinyağlılar gibi imam bayıldı da soğuk ya da oda sıcaklığında yenir. Bir gün önceden pişirip dinlendirirseniz lezzeti daha da oturur.`,
  },
  'dolma': {
    tr: `Zeytinyağlı sarma, bağları ve zeytinlikleriyle Ege'nin, özellikle İzmir'in sofralarından eksik olmayan bir lezzet. Etsiz olduğu için "yalancı dolma" olarak da bilinir. Asma yaprağına sarılan pirinçli iç, zeytinyağı, kuş üzümü, çam fıstığı ve bol yeşillikle hazırlanır.

İyi bir sarmanın ölçüsü inceliğidir: kalem gibi ince, sıkı sarılmış ve pişerken açılmayan sarmalar ustalık işaretidir. Bu tarifteki tarçın, kuş üzümü ve çam fıstığı, iç pilava İstanbul ve Ege mutfağına özgü hafif tatlı bir aroma verir.

Püf noktası: Salamura yaprakları sıcak suda bekletip iyice durulayın, yoksa sarmalar tuzlu olur. Sarmaları tencereye sıkı dizin ve üzerine ters bir tabak kapatın; pişerken dağılmazlar. Sarma, tencerede soğuyarak demlenir; sıcakken servis etmeyin.`,
  },
  'adiyaman-tantuni': {
    tr: `Tantuni, Mersin'in simgesi haline gelmiş bir sokak lezzeti. Çok ince doğranmış dana eti, geniş ve sığ bir sacda, az yağla, hızla kavrulur; ardından lavaşa sarılarak domates, soğan ve maydanozla servis edilir. Mersin'de tantuncu dükkanlarının önünden geçerken sacın sesini ve kokusunu fark etmemek mümkün değildir.

Tantuniyi diğer dürümlerden ayıran, etin çok küçük doğranması ve sacda hızla pişirilmesidir. Bu tarifte kuyruk yağı ve isot, ete hem yumuşaklık hem de bölgenin tanıdık acılığını katar.

Püf noktası: Eti her seferinde az miktarda pişirin; sacı ya da tavayı doldurursanız et suyunu bırakır ve kavrulmak yerine haşlanır. Sac çok sıcak olmalı. Lavaşı da aynı sacda birkaç saniye ısıtırsanız etin yağını emer ve kolayca sarılır.`,
  },
  'cag-kebabi': {
    tr: `Cağ kebabı, Erzurum'un ve özellikle Oltu ilçesinin simgesi. Dikey dönerden farklı olarak yatay bir şişe ("cağ") dizilen marine kuzu eti, odun ateşinin karşısında döndürülerek pişirilir. Dışı kızaran kısımlar ince uzun bir bıçakla kesilip doğrudan küçük şişlere alınır ve lavaşla yenir.

Erzurum'da cağ kebabı bir yemekten çok bir ritüeldir: masaya şiş şiş gelir ve "yeter" diyene kadar servis devam eder. Etin soğan suyu ve baharatlarla uzun süre marine edilmesi, yumuşaklığının sırrıdır.

Püf noktası: Eti en az altı saat, tercihen bir gece marine edin. Evde yatay cağ yoksa marine edilmiş eti ince dilimler halinde şişlere dizip ızgarada ya da fırının ızgara ayarında pişirebilirsiniz. Eti her seferinde sadece kızaran dış katmandan, ince ince kesin.`,
  },
  'kuru-fasulye': {
    tr: `Kuru fasulye, pilavla birlikte Türk mutfağının "milli yemeği" olarak anılır. Ev sofralarından esnaf lokantalarına, asker kışlalarından üniversite yemekhanelerine kadar her yerde pişen bu yemek, sade malzemelerle büyük bir doyuruculuk sunar. Erzurum'un İspir fasulyesi ve dermason gibi iri, ince kabuklu çeşitler en çok tercih edilenlerdir.

Bu tarifte fasulyeler salçalı ve tereyağlı bir soğan kavurmasıyla pişer; dilerseniz biraz dana kuşbaşı ekleyerek etli de yapabilirsiniz. Yanına tereyağlı pirinç pilavı, turşu ve çiğ soğan klasik eşlikçilerdir.

Püf noktası: Fasulyeleri bir gece önceden suya yatırın ve ilk kaynama suyunu dökün; hem daha çabuk pişer hem de daha hafif olur. Tuzu pişirmenin sonuna doğru ekleyin, başta eklenen tuz fasulyenin kabuğunu sertleştirebilir.`,
  },
  'urfa-cig-kofte': {
    tr: `Çiğ köfte, Şanlıurfa ve çevresinin en bilinen lezzeti. Geleneksel tarifte ince bulgur, çok yağsız çiğ etle birlikte saatlerce yoğrulurdu. Günümüzde ise satılan çiğ köftelerin neredeyse tamamı etsizdir; bu tarif de evde kolayca yapılabilen etsiz versiyondur.

Çiğ köftenin karakterini isot verir: Urfa'nın güneşte kurutulup terletilen koyu renkli biberi, köfteye hem dumanlı bir acılık hem de koyu bir renk katar. Nar ekşisi ve limon ise bu acıyı dengeleyen ekşiliği sağlar.

Püf noktası: Çiğ köftenin sırrı yoğurmadadır. Bulguru salça ve baharatlarla en az yirmi dakika, avuç içiyle bastırarak yoğurun; bulgur yumuşadıkça köfte kendini toplar. Gerekirse elinizi suyla ıslatın. Marul yaprağı ve limonla, tercihen aynı gün servis edin.`,
  },
  'icli-kofte': {
    tr: `İçli köfte, Güneydoğu Anadolu ve Hatay mutfağının emek isteyen ama zahmetine değen bir lezzeti. İnce bulgurdan yapılan ince bir kabuğun içine cevizli, baharatlı kıyma harcı doldurulur ve kızartılır. Bölgede içli köfte yapmak çoğu zaman kadınların bir araya geldiği bir imece işidir.

İyi bir içli köftenin kabuğu incedir ve kızarırken çatlamaz. Bu tarifte dış hamura eklenen irmik ve un, bulgurun daha kolay şekil almasını sağlar; iç harçtaki ceviz ise hem lezzet hem de doku katar.

Püf noktası: Dış hamuru elinizi sık sık suya batırarak şekillendirin, böylece duvarları ince açabilirsiniz. İç harcı tamamen soğuttuktan sonra kullanın. Fazla köfte yaptıysanız kızartmadan dondurabilir, ihtiyaç olduğunda doğrudan kızgın yağa atabilirsiniz.`,
  },
  'ali-nazik': {
    tr: `Ali nazik, Gaziantep mutfağının en zarif kebaplarından biri. Közlenmiş patlıcan ve sarımsaklı yoğurtla hazırlanan kremsi bir yatağın üzerine sotelenmiş kuzu eti konur, en son da kızgın, pul biberli tereyağı gezdirilir. Adının nereden geldiği üzerine farklı hikayeler anlatılır; ancak yemek, Antep sofralarının vazgeçilmezidir.

Ali nazik, hünkâr beğendiye benzese de ondan farklıdır: beğendide patlıcan sütlü bir beşamelle birleşirken ali nazikte yoğurtla buluşur. Bu da yemeği daha hafif ve ferah kılar.

Püf noktası: Patlıcanları doğrudan ateşte közleyin ki dumanlı aroma yoğurda geçsin. Yoğurdu oda sıcaklığında kullanın; çok soğuk yoğurt sıcak etle birlikte servis edilince tabak çabuk soğur. Tereyağını en son, sofraya getirmeden hemen önce cızırdatarak dökün.`,
  },
  'gaziantep-beyran': {
    tr: `Beyran, Gaziantep'in sabah çorbası. Şehirde kış aylarında, güne erken başlayanlar için açılan beyrancılarda kemikli kuzu etinin suyu, didiklenmiş et ve pirinçle hazırlanan bu acılı çorba, bakır kaselerde ateşte kaynatılarak servis edilir. Antepliler için beyran bir kahvaltı ve şifa kaynağıdır.

Beyranın lezzeti, uzun süre haşlanan kemikli etin berrak suyundan gelir. Üzerine gezdirilen pul biberli ve kimyonlu kuyruk yağı ise çorbaya hem acılığını hem de bol sarımsakla birlikte karakteristik kokusunu verir.

Püf noktası: Eti kısık ateşte, köpüğünü alarak uzun süre haşlayın; acele ederseniz et suyu bulanık ve yavan olur. Pirinci et suyunda ayrı haşlayın. Servisten hemen önce kaseyi kaynar et suyuyla doldurun, beyran çok sıcak yenir.`,
  },
  'ezogelin-corbasi': {
    tr: `Ezogelin çorbası, adını Gaziantep'te yaşamış Ezo Gelin'den alır. Anlatılana göre 20. yüzyılın başlarında yaşayan Ezo, güzelliğiyle ün salmış ama talihsiz evlilikler yaşamış, gurbette bu çorbayı pişirmiştir. Bugün ezogelin, mercimek çorbasıyla birlikte lokantaların en sevilen çorbalarındandır.

Mercimek çorbasından farkı, kırmızı mercimeğin yanına bulgur ve pirinç eklenmesi ve çorbanın blenderdan geçirilmemesidir. Böylece hem daha doyurucu hem de daneli bir kıvamı olur. Nane ve pul biberli tereyağı, çorbanın imzasıdır.

Püf noktası: Bu çorbayı blenderdan geçirmeyin; bulgur ve pirincin tanesi hissedilmelidir. Salçayı soğanla birlikte kokusu çıkana kadar kavurun. Çorba bekledikçe koyulaşır, servis öncesi kıvamını sıcak suyla açın ve mutlaka limonla sunun.`,
  },
  'sutlac': {
    tr: `Sütlaç, Osmanlı'dan bu yana İstanbul muhallebicilerinin vazgeçilmez tatlısı. Pirinç, süt ve şekerle hazırlanan bu sade tatlı, Türk mutfağında en çok sevilen sütlü tatlıların başında gelir. Bu tarif, üzeri fırında kızartılan "fırın sütlaç" versiyonudur.

Sütlacı lezzetli kılan, pirincin önce suda iyice şişirilmesi ve sütle sabırla pişirilmesidir. Fırında üstünde oluşan karamelize lekeler, tatlıya hafif bir yanık şeker aroması ve görsel çekicilik katar.

Püf noktası: Pirinç ununu mutlaka soğuk sütle ayrı bir kapta eritip öyle ekleyin, yoksa topaklanır. Pişirirken tencerenin dibini sürekli karıştırın; süt kolayca dibe tutar. Fırına verirken güveçleri içinde su olan bir tepsiye koyarsanız sütlaç kesilmeden üstü kızarır.`,
  },
  'kazandibi': {
    tr: `Kazandibi, İstanbul muhallebicilerinin klasik tatlılarından biri. Adı, kazanın dibine tutturularak karamelize edilen muhallebiden gelir. Geleneksel olarak tavuk göğsü tatlısının dibi yakılarak yapıldığı ve böylece doğduğu anlatılır; bu tarif ise evde kolayca yapılabilen tavuksuz versiyondur.

Kazandibinin özelliği, altın kahverengi karamelize yüzü ile kremamsı muhallebinin aynı dilimde buluşmasıdır. Rulo yapılarak dilimlenir ve soğuk servis edilir.

Püf noktası: Muhallebiyi tavaya dökmeden önce tavanın tabanına tereyağı sürüp şeker serpin; karamelizasyonu bu şeker sağlar. Tabanı yakmadan, koyu altın rengine gelene kadar pişirin, acı tat istemiyorsanız ateşi çok yükseltmeyin. Rulo yapmadan önce tamamen soğumasını bekleyin.`,
  },
  'gaziantep-katmer': {
    tr: `Antep katmeri, Gaziantep'in sabah kahvaltılarının en özel lezzeti. İncecik açılmış hamurun içine kaymak, dövülmüş Antep fıstığı ve şeker konur, katlanır ve sacda pişirilir. Gaziantep'te düğün sabahı damat evine katmer gönderme geleneği hâlâ yaşatılır.

Katmerin lezzeti malzemelerin kalitesinden gelir: taze kaymak, iyi dövülmüş çiğ Antep fıstığı ve bol tereyağı. Dışı çıtır, içi sıcak ve kremsi olmalıdır.

Püf noktası: Fıstığı robotta toz haline getirmek yerine havanda iri dövün; dişte hissedilen tane katmerin keyfidir. Sacı ya da tavayı orta ateşte kullanın, çok yüksek ateşte dışı yanar, içindeki kaymak ısınmaz. Katmer bekletilmez, sıcakken ve hemen yenir.`,
  },
  'menemen': {
    tr: `Menemen, Türk kahvaltısının en sevilen sıcak yemeklerinden biri. Adını İzmir'in Menemen ilçesinden aldığı söylenir. Domates, sivri biber ve yumurtadan oluşan bu basit yemek, her evde biraz farklı yapılır ve "soğanlı mı, soğansız mı" sorusu sofralarda bitmeyen bir tartışmadır.

İyi bir menemenin sırrı domatesin suyunu çekmesi ve yumurtanın fazla pişmemesidir. Sonuç sulu ama lapa olmayan, kremamsı bir kıvamdır.

Püf noktası: Domateslerin kabuğunu soyun ve suyunu çekene kadar pişirin; suyu fazla kalırsa menemen sulanır. Yumurtaları önceden çırpmayın, doğrudan tavaya kırıp yavaşça karıştırın. Yumurtalar tam pişmeden ocaktan alın, tavanın sıcaklığı pişirmeyi tamamlar. Doğrudan tavadan, taze ekmekle servis edin.`,
  },
  'pide': {
    tr: `Pide, Türkiye'nin her köşesinde farklı şekillerde yapılan bir fırın lezzeti; Karadeniz pidesi ise kayık şeklindeki formu ve ucu sivri kapatılmış kenarlarıyla en bilinenlerden biridir. Trabzon ve çevresinde pideciler, odun ateşli taş fırınlarda kıymalı, kaşarlı, yumurtalı pek çok çeşidi saniyeler içinde pişirir.

Bu tarifteki pide, sütle yoğrulmuş yumuşak bir hamurun üzerine çiğ olarak hazırlanan kıymalı harç ve kaşar peyniri konularak yapılır. Fırından çıkınca sürülen tereyağı, Karadeniz pidesinin olmazsa olmazıdır.

Püf noktası: Kıymalı harcı kavurmadan, çiğ olarak koyun; et fırında hamurla birlikte pişer ve suyunu hamura verir. Ev fırınını en yüksek ısıya getirin ve pideyi fırının alt rafında pişirin ki tabanı da kızarsın. Fırından çıkar çıkmaz tereyağı sürün.`,
  },
  'rize-muhlama': {
    tr: `Muhlama (mıhlama), Doğu Karadeniz'in, özellikle Rize ve Trabzon yaylalarının kahvaltı sofralarının yıldızı. Mısır unu, bol köy tereyağı ve uzayan yerel peynirle bakır bir sahanda pişirilir ve ortaya koyulup sahandan ekmekle yenir. Rize'de bu peynir için genellikle kolot peyniri kullanılır.

Muhlamanın kıvamı, peynirin uzayıp tel tel olmasıyla ölçülür. Hazır olduğunda kenarlarından yağ salar ve parlak bir görünüm alır. Yanında demli Rize çayı, Karadeniz kahvaltısını tamamlar.

Püf noktası: Mısır ununu tereyağında, renk vermeden ama çiğ kokusu gidene kadar kavurun. Suyu azar azar ve sürekli karıştırarak ekleyin, topaklanmasın. Uzayan bir muhlama için tuzu az, yağlı ve iyi eriyen bir peynir seçin; kolot bulamazsanız taze kaşar veya tel peyniri karıştırabilirsiniz.`,
  },
  'kisir': {
    tr: `Kısır, Güneydoğu Anadolu'dan ve Hatay'dan tüm Türkiye'ye yayılmış bir bulgur salatası. Kadın günlerinin, piknik sepetlerinin ve beş çayı sofralarının vazgeçilmezidir. İnce bulgur salça, bol limon, zeytinyağı ve yeşilliklerle yoğrulur, marul yaprağına sarılarak yenir.

Kısır yapılan yere göre değişir: Hatay ve Antep'te nar ekşisi ve acı biber salçası öne çıkarken bazı bölgelerde ceviz ya da domates eklenir. Bu tarif, salçalı ve limonlu temel kısırdır.

Püf noktası: Bulguru kaynar suyla ıslatıp kapağını kapatarak şişirin; fazla su kısırı lapa yapar, bulgur ancak üzerini geçecek kadar suyla ıslatılmalıdır. Salçayı sıcak bulgurla yoğurun, böylece rengi ve tadı eşit dağılır. Yeşillikleri en son, servise yakın ekleyin ki solmasın.`,
  },
  'cilbir': {
    tr: `Çılbır, Osmanlı mutfağının en eski yumurta yemeklerinden biri. Sarımsaklı yoğurt üzerine konan poşe yumurtalar ve üzerine dökülen pul biberli tereyağından oluşan bu sade yemek, saray mutfağından bugünün kahvaltı sofralarına kadar gelmiştir.

Çılbırı özel kılan, yumurtanın beyazının pişmiş, sarısının ise akışkan kalmasıdır. Yumurta sarısı kırıldığında yoğurt ve kızgın tereyağıyla karışarak ekmeğe banılacak bir sos oluşturur.

Püf noktası: Yoğurdu buzdolabından önceden çıkarın, soğuk yoğurt yumurtayı hemen soğutur. Poşe için çok taze yumurta kullanın ve suya biraz sirke ekleyin; yumurtanın beyazı dağılmadan toplanır. Yumurtaları kaynayan değil, hafif fokurdayan suda pişirin ve servis etmeden hemen önce tereyağını cızırdatarak dökün.`,
  },
  'siirt-perde-pilavi': {
    tr: `Perde pilavı, Siirt'in coğrafi işaretle tescilli yöresel yemeği. Tavuklu, bademli ve fıstıklı iç pilav, tereyağlı yufkadan bir "perde" ile tamamen sarılıp fırında pişirilir ve ters çevrilerek kubbe şeklinde sofraya gelir. Siirt'te özellikle düğünlerde pişirilen bu yemeğin malzemelerine evlilikle ilgili anlamlar yüklendiği anlatılır.

Perde pilavının etkisi, sofrada kesildiği andadır: altın rengi, çıtır yufka kabuk açıldığında içinden kokulu, kuruyemişli pilav çıkar. Tarçın ve yenibahar pilava hafif ve sıcak bir aroma verir.

Püf noktası: İç pilavı tam pişirmeyin; fırında yufkanın içinde pişmeye devam edecek. Yufkaları kabın kenarlarından taşacak şekilde döşeyin ki pilavın üstünü tamamen kapatabilesiniz. Fırından çıkınca birkaç dakika dinlendirip öyle ters çevirin, perde dağılmaz.`,
  },

  // ── 3. grup (20 tarif) ──
  'konya-firin-kebabi': {
    tr: `Konya fırın kebabı, Konya mutfağının en köklü et yemeklerinden biri. Kemikli kuzu eti, sadece tuz, karabiber ve birkaç aromatikle, kapalı bir kapta ve düşük ısıda saatlerce pişirilir. Sonuçta et kemikten kendiliğinden ayrılır, kendi suyunda ve yağında yumuşacık olur.

Bu yemeğin sırrı sadeliğinde ve sabırda yatar. Konya'da fırın kebabı geleneksel olarak büyük taş fırınlarda, tandır kebabına benzer şekilde pişirilir ve genellikle pide ekmeği üzerinde servis edilir. Ev fırınında güveçle bu sonuca çok yaklaşmak mümkündür.

Püf noktası: Güvecin kapağını kenarlarından un-su hamuruyla kapatın ki buhar kaçmasın; et kendi buharında pişmelidir. Pişirme süresince kapağı açmayın. Fırından çıkınca on beş dakika dinlendirin ve güveçte biriken suyu servis sırasında etin üzerine gezdirin.`,
  },
  'izmir-boyoz': {
    tr: `Boyoz, İzmir'in sabahlarıyla özdeşleşmiş, tahinli ve katmerli küçük bir hamur işi. İspanya'dan göç eden Sefarad Yahudilerinin mutfağından İzmir'e geçtiği ve zamanla şehrin simgesi haline geldiği anlatılır. İzmir'de boyoz genellikle haşlanmış yumurta ve bir bardak çayla, sokakta ayaküstü yenir.

Boyozun dokusu, tahin ve yağla katlanarak açılan hamurdan gelir. Fırında kabaran katmanlar dışta hafif çıtır, içte yumuşak kalır. Az malzemeyle yapılan ama sabır isteyen bir lezzettir.

Püf noktası: Hamuru yoğurduktan sonra mutlaka dinlendirin ki elastikiyet kazanıp kolay açılsın. Tahinli harcı ince ve eşit sürün, sonra hamuru sıkıca rulo yapın. Ruloyu kesmeden önce buzdolabında dinlendirmek dilimlerin dağılmamasını sağlar. Boyozları fırından çıkınca bir bezle örtün, yumuşak kalırlar.`,
  },
  'edirne-tava-cigeri': {
    tr: `Edirne tava ciğeri, şehrin adıyla birlikte anılan en ünlü lezzet. İncecik dilimlenmiş kuzu ciğeri una bulanıp kızgın yağda saniyeler içinde kızartılır ve yanında kızarmış kuru acı biber, soğan ve cacıkla servis edilir. Edirne'nin ciğercileri, bu tekniği kuşaktan kuşağa aktaran ustalarıyla bilinir.

Tava ciğerin başarısı, ciğerin ne kadar ince kesildiğine ve ne kadar kısa sürede piştiğine bağlıdır. Doğru pişmiş ciğer yumuşak ve suludur; fazla pişen ciğer ise sertleşir ve lastik gibi olur.

Püf noktası: Ciğeri kesmeden önce buzdolabında biraz sertleştirirseniz çok ince dilimleyebilirsiniz. Unu iyice silkeleyin, fazla un yağda yanar. Tavayı ve yağı çok iyi ısıtın ve ciğerleri tek kat halinde, az sayıda kızartın. Her yüzünü kısa süre pişirip hemen servis edin.`,
  },
  'tokat-kebabi': {
    tr: `Tokat kebabı, Tokat'ın en bilinen yemeği ve sebzeyle etin aynı şişte buluştuğu özgün bir kebap. Kuzu eti, patlıcan, patates, domates ve biber, araya kuyruk yağı dilimleri konularak şişlere dizilir. Geleneksel olarak bu şişler özel fırınlarda dikey asılarak pişirilir; böylece kuyruk yağı eriyip sebzelerin ve etin üzerinden süzülür.

Tokat kebabının lezzeti bu yağ akışından gelir: patates ve patlıcan, etin ve kuyruk yağının suyunu emerek yumuşar. Yanında bir baş közlenmiş sarımsak ve ince lavaş ya da tandır ekmeği servis edilir.

Püf noktası: Patlıcanları tuzlu suda bekletip iyice kurulayın. Kuyruk yağı dilimlerini etin hemen üstüne gelecek şekilde dizin ki eriyen yağ ete ve sebzelere işlesin. Ev fırınında pişirirken şişleri bir kez çevirin ve son dakikalarda ızgara ayarında üstünü kızartın.`,
  },
  'nigde-etli-ekmek': {
    tr: `Etli ekmek, Orta Anadolu'nun ince hamurlu fırın lezzeti. Niğde'de ve çevresinde mahalle fırınlarında pişirilen etli ekmek, incecik açılmış hamurun üzerine çiğ kıymalı harcın sürülüp yüksek ısıda kısa sürede pişirilmesiyle hazırlanır. Lahmacuna benzese de daha geniş ve ince hamuru, sade harcıyla kendine özgüdür.

Harcın içinde kıymanın yanında rendelenmiş soğan ve domates, biber ve salça bulunur. Pişince üzerine maydanoz serpilir, limon sıkılır ve rulo yapılarak yenir.

Püf noktası: Harcı kavurmadan, çiğ olarak ve ince bir tabaka halinde yayın; kalın harç hamuru ıslatır. Fırını mümkün olan en yüksek ısıya getirin ve bir fırın taşı ya da tepsiyi önceden ısıtın. Etli ekmek kısa sürede pişer; kenarları kızarınca hemen çıkarın.`,
  },
  'trabzon-akçaabat-köfte': {
    tr: `Akçaabat köftesi, Trabzon'un Akçaabat ilçesinden çıkıp tüm Türkiye'ye yayılmış, coğrafi işaretli bir lezzet. Sadeliğiyle tanınır: yağlı dana kıyma, soğan, sarımsak ve birkaç baharat. İçine ekmek içi ya da yumurta katılmaz.

Akçaabat'ta köftecilerde bu köfte genellikle piyaz, közlenmiş biber ve mısır ekmeğiyle servis edilir. Kalınca şekillendirilen köftelerin dışı ızgarada hafif kızarır, içi sulu kalır.

Püf noktası: Kıymayı soğanın suyunu sıkıp ekledikten sonra uzun süre yoğurun ve buzdolabında dinlendirin; köfte böylece kendini toplar ve ızgarada dağılmaz. Közün alevsiz olmasını bekleyin. Köfteleri ızgarada fazla çevirmeyin, her yüzünü bir kez pişirin.`,
  },
  'inegol-koftesi': {
    tr: `İnegöl köftesi, Bursa'nın İnegöl ilçesinin coğrafi işaretli ünlü lezzeti. Bu köftenin İnegöl'e 20. yüzyılın başlarında Balkanlardan göç eden ustalarla geldiği anlatılır. Bugün ilçede köfteci sayısı neredeyse sayılamayacak kadar çoktur.

İnegöl köftesini diğerlerinden ayıran malzeme listesinin kısalığıdır: kıyma, soğan, tuz ve az miktarda karbonat. Sarımsak ve baharat çeşitliliği yoktur. Karbonat köfteye yumuşaklık verir; uzun dinlendirme ise lezzetin oturmasını sağlar.

Püf noktası: Harcı en az iki saat, mümkünse bir gece dinlendirin. Köfteleri ıslak elle, kısa ve yassı silindirler halinde şekillendirin. Izgarayı çok iyi ısıtın ve köfteleri yüksek ateşte kısa sürede pişirin ki dışı kızarsın, içi sulu kalsın.`,
  },
  'tekirdag-köftesi': {
    tr: `Tekirdağ köftesi, Trakya'nın en bilinen lezzeti ve coğrafi işaretli bir ürün. Bu köftenin Tekirdağ'a Balkanlardan gelen göçmenlerle yerleştiği anlatılır. Şehirde köfte, yanında piyaz ve közlenmiş biberle, çoğu zaman tek başına bir öğün olarak yenir.

Tekirdağ köftesinin yumuşaklığı, kıymaya eklenen bayat ekmek içi ve karbonattan, aroması ise kimyondan gelir. Uzun ve hafif yuvarlak şekli onu yassı ızgara köftelerinden ayırır.

Püf noktası: Ekmek içini ıslattıktan sonra suyunu çok iyi sıkın; fazla su köfteyi dağıtır. Harcı uzun süre yoğurun ve buzdolabında en az bir saat, tercihen bir gece dinlendirin. Izgarayı hafifçe yağlayın ve köftelerin her yüzünü kızarana kadar pişirin.`,
  },
  'mardin-kaburga-dolmasi': {
    tr: `Kaburga dolması, Mardin mutfağının bayram ve misafir sofralarındaki gösterişli yemeği. Kuzu kaburgasının içine açılan cebe baharatlı, kıymalı pirinç harcı doldurulur ve saatlerce fırında pişirilir. Mardin'de bu yemek, özellikle Kurban Bayramı'nda pişirilen geleneksel yemeklerin başında gelir.

Harçtaki yenibahar ve tarçın, Mardin mutfağının farklı kültürlerden beslenen zengin baharat geleneğini yansıtır. Uzun pişirme süresi boyunca kaburganın yağı pirince işler ve et kemikten ayrılacak kadar yumuşar.

Püf noktası: Kaburganın cebini kasabınıza açtırın. Harcı fazla doldurmayın; pirinç pişerken şişer ve ağzını zorlar. Cebin ağzını iple dikin ya da kürdanla kapatın. Kaburgayı folyo altında düşük ısıda pişirin, son yarım saatte folyoyu açıp üstünü kızartın.`,
  },
  'hatay-tepsi-kebabi': {
    tr: `Tepsi kebabı, Hatay mutfağının en pratik ve sevilen fırın yemeklerinden biri. Baharatlı kıyma tepsiye ince bir tabaka halinde yayılır, üzerine domates ve biber dizilir, salçalı bir sos gezdirilerek fırında pişirilir. Antakya'da tepsi kebabı genellikle evde hazırlanıp mahalle fırınına gönderilir.

Bu yemek kalabalık sofralar için idealdir: tek tepside pişer, dilimlenerek servis edilir. Kıymaya katılan sarımsak, maydanoz ve Hatay'ın sevdiği baharatlar, ona kendine özgü bir lezzet verir.

Püf noktası: Kıyma harcını dinlendirdikten sonra tepsiye eşit kalınlıkta yayın; kalın yerler geç pişer. Tepsiye yaymadan önce kıymayı ıslak elle bastırırsanız düzgün bir yüzey elde edersiniz. Fırından çıkınca birkaç dakika bekletin, dilimler daha düzgün kesilir.`,
  },
  'kayseri-pastirma': {
    tr: `Kayseri pastırması, Türkiye'nin en bilinen et kurutma geleneğinin ürünü ve coğrafi işaretli bir lezzet. Adının, etin tuzlanıp preslenmesinden, yani "bastırılmasından" geldiği kabul edilir. Kayseri'nin kuru ve soğuk iklimi, bu uzun kurutma sürecine çok uygundur.

Pastırmanın karakterini "çemen" denen kaplama verir: çemen otu tohumu, kırmızı biber ve sarımsakla hazırlanan bu macun ete hem koruyucu bir kabuk hem de yoğun, keskin bir aroma kazandırır. İnce dilimlenen pastırma çiğ olarak ya da yumurtayla, kuru fasulyeyle ve böreklerde kullanılır.

Püf noktası: Evde pastırma yapmak haftalar süren bir süreçtir ve serin, havadar bir ortam gerektirir. Eti her gün çevirerek tuzlayın ve kurutma aşamalarını atlamayın. Servis ederken çok ince dilimleyin; kalın dilim pastırma sert ve tuzlu gelir.`,
  },
  'trabzon-hamsi-tava': {
    tr: `Hamsi, Karadeniz'in en sevilen balığı ve hamsi tava da bu sevginin en sade ifadesi. Kasım ile şubat arası hamsinin en yağlı ve lezzetli olduğu dönemdir; bu aylarda Trabzon'dan Rize'ye sahil boyunca hamsi tavası pişmeyen ev neredeyse yoktur. Karadeniz'in türkülerinde ve fıkralarında da hamsi hep başroldedir.

Hamsiler mısır ununa bulanıp tavada yan yana dizilerek kızartılır. Mısır unu, Karadeniz mutfağının temel malzemesidir ve hamsiye kendine özgü çıtır bir kabuk verir.

Püf noktası: Hamsileri yıkadıktan sonra çok iyi kurulayın; ıslak balık unu tutmaz ve yağı sıçratır. Tavayı kalabalık etmeyin, hamsileri sıkı ama tek kat dizin. Yağın yeterince sıcak olduğundan emin olun ki hamsi yağ çekmeden kızarsın. Mısır ekmeği ve limonla hemen servis edin.`,
  },
  'adana-salgam': {
    tr: `Şalgam suyu, Adana ve Mersin'in vazgeçilmez fermente içeceği. Ekşi, tuzlu ve dilerseniz acılı tadıyla özellikle kebap ve dürümün yanında içilir. Adı şalgamdan gelse de, içeceğe koyu mor rengini ve tadının büyük kısmını mor havuç verir.

Şalgam suyu, mor havuç ve şalgamın bulgur ekşisi ve tuzla birlikte günlerce fermente edilmesiyle hazırlanır. Fermantasyon içeceğe hem ekşiliğini hem de kendine özgü kokusunu kazandırır. Bölgede acılı ve acısız olarak iki şekilde tüketilir.

Püf noktası: Şalgam ve havuçları soymayın, sadece iyice fırçalayın; renk büyük oranda kabuktadır. Kavanozu oda sıcaklığında, güneş almayan bir yerde tutun ve her gün karıştırın. Rengi koyu mora döndüğünde ve hoş bir ekşi koku geldiğinde süzüp buzdolabında saklayın.`,
  },
  'isparta-gul-lokumu': {
    tr: `Isparta, yağ gülü yetiştiriciliği ve gül yağı üretimiyle dünyaca tanınan bir şehir. Her bahar mayıs ve haziran aylarında, sabahın erken saatlerinde toplanan gül yapraklarından gül yağı ve gül suyu elde edilir. Gül lokumu da bu geleneğin sofraya yansımasıdır.

Lokum, şeker şurubu ve nişastanın uzun süre karıştırılarak pişirilmesiyle yapılan, Osmanlı'dan bu yana Türk şekerlemeciliğinin simgesi olmuş bir tatlıdır. Gül suyu lokuma hafif, çiçeksi bir aroma ve pembe bir renk verir.

Püf noktası: Nişastayı mutlaka soğuk suyla eritip öyle ekleyin ve pişirme boyunca karıştırmayı bırakmayın. Karışım şeffaflaşıp koyulaşınca ocaktan alın. Gül suyunu ateşten aldıktan sonra ekleyin ki kokusu uçmasın. Lokumu kesmeden önce tamamen donmasını bekleyin.`,
  },
  'karabuk-safranbolu-lokumu': {
    tr: `Safranbolu lokumu, UNESCO Dünya Mirası listesindeki tarihi Safranbolu'nun ahşap konakları kadar tanınan lezzetidir. Şehir adını, eskiden çevresinde yetiştirilen safrandan alır. Safranbolu'da lokum, çarşıdaki lokumcularda hâlâ geleneksel yöntemlerle, büyük kazanlarda saatlerce karıştırılarak yapılır.

Bu tarifte lokuma safran ve gül suyu ile aroma, bütün ceviz içiyle doku verilir. Safran, lokuma hafif altın sarısı bir renk ve kendine özgü bir koku katar.

Püf noktası: Lokum karışımını kısık ateşte ve sabırla, kaşık dik durana kadar pişirin; erken alınan lokum yapışkan kalır. Safranı az sıcak suda bekletip suyuyla birlikte ekleyin ki rengi iyi dağılsın. Kestiğiniz lokumları pudra şekeri ve nişasta karışımına bolca bulayın, birbirine yapışmazlar.`,
  },
  'izmit-pismaniyesi': {
    tr: `Pişmaniye, Kocaeli'nin ve İzmit'in simge tatlısı. İnce ince, pamuk gibi lifler halindeki bu tatlı, şekerin kaynatılıp tereyağında kavrulmuş unla birlikte defalarca çekilip katlanmasıyla yapılır. İzmit'ten geçen yolcuların pişmaniye kutusu almadan şehirden ayrılmaması bir gelenek gibidir.

Pişmaniye yapmak ustalık ve ekip işidir: geleneksel olarak birkaç kişi bir tepsinin etrafında oturur ve şeker halkasını unla birlikte çekerek yüzlerce ince lif elde eder. Evde yapmak zahmetli ama keyifli bir deneyimdir.

Püf noktası: Şekeri karıştırmadan kaynatın ve sıcaklığı bir termometreyle takip edin; doğru ısıya ulaşmayan şeker lif vermez. Unu tereyağında renk almadan kavurun ve tamamen soğutun. Çekme işlemini şeker sertleşmeden, hızlı ve sürekli yapın. Pişmaniye nemden etkilenir, kapalı kapta saklayın.`,
  },
  'bursa-ekmek-kadayifi': {
    tr: `Ekmek kadayıfı, Türk tatlıları içinde en sade malzemeli ama en zengin lezzetlilerden biri: ekmek, şerbet ve kaymak. Bursa'da bu tatlı, şehrin ünlü kaymağıyla birlikte servis edilir. Fırında kızaran ekmeğin şerbeti çekip yumuşaması ve üzerindeki kaymakla birleşmesi, tatlıya hem ağır hem de ferah bir tat verir.

Bu tarifte bayat ekmek dilimleri tereyağıyla fırında kızartılır, sıcakken soğuk şerbetle ıslatılır ve şerbeti iyice çektikten sonra kaymak ve dövülmüş cevizle süslenir.

Püf noktası: Ekmeği fırında iyice kızartın; yeterince kurumayan ekmek şerbeti çekince dağılır. Sıcak ekmeğe soğuk şerbet dökün ve tatlıyı en az yirmi dakika dinlendirin. Kaymağı servis etmeden hemen önce koyun. Ekmek kadayıfı soğuk ya da oda sıcaklığında yenir.`,
  },
  'bodrum-cokertme-kebabi': {
    tr: `Çökertme kebabı, Bodrum ve Muğla yöresinin en sevilen kebabı. İncecik kesilip kızartılmış çıtır patatesler, sarımsaklı yoğurt ve yüksek ateşte sotelenmiş dana eti üst üste dizilir; üzerine domates sosu ve kızgın pul biberli tereyağı gezdirilir. Ege'nin yazlık sofralarında hem lokantaların hem de evlerin klasiğidir.

Çökertmeyi özel kılan, farklı doku ve sıcaklıkların aynı tabakta buluşmasıdır: çıtır patates, serin yoğurt, sıcak et ve cızırdayan tereyağı. Tabağa gelir gelmez yenmesi gereken bir yemektir.

Püf noktası: Patatesleri kibrit çöpü inceliğinde kesin, soğuk suda bekletip nişastasını alın ve çok iyi kurulayın; ıslak patates çıtır olmaz. Yoğurdu oda sıcaklığında kullanın. Eti az miktarlarda, çok yüksek ateşte kısa süre pişirin ki suyunu bırakmadan mühürlensin.`,
  },
  'malatya-anali-kizli': {
    tr: `Analı kızlı, Malatya ve çevresinin bulgurlu köfte çorbası. Adını çorbadaki iki farklı köfteden alır: içi kıymalı harçla doldurulan büyük köfteler "ana", içsiz küçük bulgur köfteleri ise "kız" olarak adlandırılır. Bu ikisi birlikte et suyunda pişirilir.

Doğu ve Güneydoğu Anadolu'da bulgur köfteli çorbaların pek çok çeşidi vardır; analı kızlı bunların en bilinenlerinden biridir. Köfte yapımı emek ister, bu yüzden genellikle kalabalık aile sofralarında ve misafir için pişirilir.

Püf noktası: Bulgur hamurunu iyice yoğurun ki köfteler pişerken dağılmasın; gerekirse biraz daha un ekleyin. Ana köfteleri ince duvarlı yapın. Köfteleri et suyuna kaynarken ekleyin ve önce büyükleri, ardından küçükleri pişirin. Servis öncesi pul biberli tereyağı gezdirin.`,
  },
  'yozgat-toyga-corbasi': {
    tr: `Toyga çorbası, Yozgat ve Orta Anadolu'nun yoğurtlu çorbası. Adının eski Türkçede düğün anlamına gelen "toy" kelimesiyle ilişkili olduğu söylenir; bölgede gerçekten de düğün sofralarının açılış çorbası olarak bilinir. Yayla çorbasına benzese de içindeki nohut ona ayrı bir doyuruculuk katar.

Yoğurt, yumurta ve unla terbiye edilen et suyu, pirinç ve nohutla birlikte pişirilir. Üzerine gezdirilen naneli ve pul biberli tereyağı çorbanın kokusunu ve rengini tamamlar.

Püf noktası: Yoğurtlu karışımı çorbaya doğrudan dökmeyin; önce birkaç kepçe sıcak suyla ılıştırın, sonra yavaşça ekleyin ki yoğurt kesilmesin. Yoğurdu ekledikten sonra çorbayı kısık ateşte, kaynatmadan ve sürekli karıştırarak pişirin. Naneyi tereyağında kısa süre kavurun, yakmayın.`,
  },

  // ── 4. grup (20 tarif) ──
  'edirne-gullaç': {
    tr: `Güllaç, Osmanlı saray mutfağından günümüze ulaşan ve özellikle Ramazan ayıyla özdeşleşmiş hafif bir sütlü tatlı. Nişasta ve undan yapılan incecik, kâğıt gibi güllaç yaprakları şekerli ve gül sulu sütle ıslatılarak kat kat dizilir. Saray kültürünün izlerini bugün de taşıyan Edirne'de güllaç, gül suyunun kokusuyla ayrı bir anlam kazanır.

Güllaç, ağır şerbetli tatlıların aksine ferah ve hafiftir; iftar sofralarında bu yüzden çok sevilir. Üzerine serpilen nar taneleri ve dövülmüş Antep fıstığı hem renk hem de doku katar.

Püf noktası: Sütü kaynattıktan sonra ılımaya bırakın; çok sıcak süt güllaç yapraklarını eritir, soğuk süt ise yaprakları yeterince yumuşatmaz. Her katı sütle iyice ıslatın. Güllacı en az dört saat, tercihen bir gece buzdolabında dinlendirin ve süslemeyi servisten hemen önce yapın.`,
  },
  'izmir-lokma': {
    tr: `Lokma, İzmir'de bir tatlıdan çok bir paylaşma geleneği. Bir yakının ölümünün ardından, bir dileğin gerçekleşmesinde ya da özel günlerde büyük kazanlarda lokma kızartılır ve mahalleliye, sokaktan geçenlere ikram edilir. İzmir sokaklarında lokma kuyruğu görmek alışıldık bir manzaradır.

Mayalı, akışkan bir hamurdan küçük toplar halinde kızgın yağa bırakılan lokmalar, kızarınca hemen şerbete atılır. Dışı çıtır, içi yumuşak ve şerbetini çekmiş lokma, sıcakken yenir.

Püf noktası: Hamurun iyice mayalanıp kabarcıklanmasını bekleyin; mayalanmayan hamur ağır olur. Hamuru ıslak elle ya da ıslatılmış kaşıkla yağa bırakın, yapışmaz. Yağın çok sıcak olmamasına dikkat edin, yoksa lokmanın dışı kararır ama içi pişmez. Sıcak lokmayı soğuk şerbete atın.`,
  },
  'finike-portakalli-revani': {
    tr: `Revani, irmikle yapılan şerbetli bir kek tatlısı ve Türk mutfağının en sevilen ev tatlılarından biri. Antalya'nın Finike ilçesi ise kokulu ve sulu portakallarıyla ünlüdür. Bu tarif, iki lezzeti bir araya getirerek hem hamura hem de şerbete taze portakal suyu ve kabuğu katar.

Portakal, revaninin klasik tatlılığına ferah bir ekşilik ve çiçeksi bir koku verir. Şerbetini iyice çekmiş revani nemli ve yumuşak olur, yine de dağılmaz.

Püf noktası: Portakal kabuğunu rendelerken sadece turuncu kısmı alın, beyaz kısım acılık verir. Yumurta ve şekeri iyice köpürene kadar çırpın, revaninin kabarıklığı buradan gelir. Şerbet soğuk, revani fırından yeni çıkmış ve sıcak olmalı. Kesmeden önce en az bir saat şerbetini çekmesini bekleyin.`,
  },
  'gaziantep-cevizli-sucuk': {
    tr: `Cevizli sucuk, Gaziantep ve çevresinde bağ bozumu mevsiminde evlerde hazırlanan geleneksel bir kış yiyeceği. İpe dizilen ceviz içleri, unla koyulaştırılmış ve baharatlanmış üzüm suyuna (bulama) defalarca batırılıp kurutulur. Ortaya çıkan, sucuk şeklinde, hem tatlı hem de besleyici bir atıştırmalıktır.

Güneydoğu ve Doğu Anadolu'da üzümün pestil, pekmez ve sucuk gibi kışlık yiyeceklere dönüştürülmesi yüzyıllardır süren bir gelenektir. Cevizli sucuk, bu geleneğin en sevilen ürünlerinden biridir ve birkaç ay bozulmadan saklanabilir.

Püf noktası: Bulamayı kısık ateşte ve sürekli karıştırarak koyulaştırın; sulu kalırsa cevizi tutmaz. Her daldırmadan sonra sucuğun yüzeyinin tamamen kurumasını bekleyin, aceleyle yeni kat eklemeyin. Son kattan sonra serin ve havadar bir yerde birkaç gün kurutun.`,
  },
  'giresun-kuymak': {
    tr: `Kuymak, Doğu Karadeniz'in mısır unu ve tereyağıyla yapılan sıcak kahvaltı yemeği. Mısırın bölgeye gelişinden sonra Karadeniz mutfağının temel malzemesi haline gelmesiyle, kuymak da evlerin ve yaylaların vazgeçilmezi olmuştur. Giresun'dan Rize'ye uzanan bölgede adı ve yapılışı biraz değişse de özü aynıdır.

Kuymak ile muhlama sıklıkla karıştırılır. Muhlamada peynir ön plandadır ve peynirin uzaması aranır; kuymakta ise mısır unu ve tereyağı başroldedir, peynir isteğe bağlıdır. Bu tarifte peynir, kuymağa ek bir lezzet olarak eklenebilir.

Püf noktası: Mısır ununu kaynayan suya yağmur gibi yavaş yavaş serpin ve sürekli karıştırın, topaklanmasın. Kısık ateşte sabırla pişirin; kuymak tabandan ayrılmaya başladığında olmuştur. Tereyağını cömert kullanın ve sahandan, sıcakken servis edin.`,
  },
  'konya-hosmerim': {
    tr: `Höşmerim, taze peynir, irmik ve tereyağıyla yapılan, sıcak yenen bir peynir tatlısı. Anadolu'nun pek çok yöresinde bilinen bu tatlının adının, tadına bakanın "hoşuma gitti" demesinden geldiği söylenir. Konya ve İç Anadolu'da da sevilerek yapılır.

Höşmerim az malzemeyle, kısa sürede hazırlanır: tereyağında kavrulan irmiğe ezilmiş taze peynir eklenir, karıştırılarak pişirilir ve şekerle tatlandırılır. Sonuç, hafif tuzlu ve tatlı arasında dengeli, yumuşak dokulu bir tatlıdır.

Püf noktası: Tuzsuz ya da az tuzlu, taze bir peynir kullanın; tuzlu peyniri önceden suda bekletin. Peyniri iyice ezin ki tatlı pürüzsüz olsun. Karışımı tavadan ayrılana kadar sürekli karıştırarak pişirin. Höşmerim soğuyunca sertleşir, sıcakken kaymak ya da balla servis edin.`,
  },
  'kayseri-kadinbudu-kofte': {
    tr: `Kadınbudu köfte, Osmanlı mutfağından gelen ve adı kadar zarif bir köfte. İçinde pirinç bulunan kıymalı harç, oval şekillendirilip önce una sonra yumurtaya bulanarak kızartılır. Böylece dışı ince ve altın sarısı bir kabukla kaplanır, içi yumuşak kalır. Adının köftenin dolgun, oval şeklinden geldiği söylenir.

Kayseri başta olmak üzere pek çok yörede ev sofralarının ve özel günlerin klasik köftesidir. Domates sosunda kısa süre pişirilerek ya da sade olarak, pilav veya patates püresiyle servis edilir.

Püf noktası: Pirinci önceden haşlayıp soğutun ve harca öyle ekleyin. Harcı buzdolabında dinlendirin, köfteler kızarırken dağılmaz. Unu silkeleyip yumurtaya bulayın ve hemen kızgın yağa atın. Yağın çok sıcak olmamasına dikkat edin, köftenin içi de pişmeli.`,
  },
  'izmir-kofte': {
    tr: `İzmir köftesi, Türkiye'nin her evinde pişen, tepsiyle sofraya gelen sevilen bir fırın yemeği. Kızartılmış ya da mühürlenmiş uzun köfteler, patates, domates ve sivri biberle birlikte salçalı bir sosta fırında pişirilir. Tek tepside hem ana yemek hem de garnitür hazır olur.

İzmir köftesinin lezzeti, köftelerin patates ve sebzelerle aynı sosta pişip birbirinin tadını almasından gelir. Patatesler köftenin suyunu ve domates sosunu çekerek yumuşar.

Püf noktası: Köfteleri tepsiye dizmeden önce tavada kısa süre mühürleyin; fırında dağılmazlar ve daha lezzetli olurlar. Patatesleri çok kalın kesmeyin, köftelerle aynı sürede pişsinler. Tepsinin üzerini önce folyoyla örtüp pişirin, son dakikalarda açarak üstünü kızartın.`,
  },
  'kirklareli-kapama': {
    tr: `Kuzu kapama, Trakya'nın ve Kırklareli'nin bahar yemeği. Kuzu etinin, mevsimin ilk taze soğanları, marulu ve dereotuyla birlikte kapalı bir tencerede, kendi buharında yavaş yavaş pişirilmesiyle yapılır. Adı da bu pişirme yönteminden, tencerenin kapalı tutulmasından gelir.

Trakya'da kapama, kuzunun ve bahar sebzelerinin mevsimine denk gelen bir sofra geleneğidir. Az baharatla, etin ve sebzelerin kendi tadıyla pişen yemek, hafif ve kokulu olur.

Püf noktası: Eti pişirmeden önce tereyağında her yüzünü mühürleyin. Marul yapraklarıyla etin üzerini tamamen kapatın; marul hem eti nemli tutar hem de suyunu verir. Kapağı sıkıca kapatın ve pişirme süresince açmayın, kısık ateşte sabırla pişirin. Limonla servis edin.`,
  },
  'aydin-zeytinyagli-enginar': {
    tr: `Zeytinyağlı enginar, Ege mutfağının bahar sofralarının yıldızı. Enginar mevsiminde Aydın'dan İzmir'e kadar pazarlarda enginar satıcıları, enginarları yerinde temizleyip limonlu suya atarak satar. Zeytinyağı, limon ve dereotuyla pişen enginar, Ege'nin hafif ve ferah mutfağını en iyi yansıtan yemeklerdendir.

Bu tarifte enginar çanakları, patates, havuç ve bezelyeyle birlikte zeytinyağında pişirilir. Tüm zeytinyağlılar gibi oda sıcaklığında ya da soğuk servis edilir.

Püf noktası: Enginarları temizledikten hemen sonra limonlu suya atın, havayla temas edince çabuk kararırlar. Pişirirken suyuna da limon ekleyin. Enginarları tencereye çanak tarafı yukarı bakacak şekilde dizin. Pişirme suyunu tamamen çektirmeyin; enginar kendi suyunda soğuyarak lezzetlenir. Dereotunu servis öncesi serpin.`,
  },
  'balikesir-cerkez-tavugu': {
    tr: `Çerkez tavuğu, Kafkasya'dan Anadolu'ya göç eden Çerkeslerin mutfağından Türk mutfağına geçmiş, en sevilen mezelerden biri. Balıkesir ve Manyas çevresi gibi Çerkes topluluklarının yaşadığı bölgelerde nesilden nesile aktarılmıştır. Haşlanmış ve didiklenmiş tavuk, cevizli ve sarımsaklı bir sosla harmanlanır.

Çerkez tavuğunun karakteri ceviz sosundan gelir: dövülmüş ceviz, ıslatılmış ekmek içi, sarımsak ve tavuk suyuyla hazırlanan bu sos, tavuğa yoğun ve kremsi bir lezzet verir. Üzerine gezdirilen kırmızı biberli ceviz yağı ise hem renk hem de koku katar.

Püf noktası: Tavuğu haşlarken suyunu atmayın, sosun kıvamını bu suyla ayarlayacaksınız. Ceviz sosunu kıvamını kontrol ederek, tavuk suyunu azar azar ekleyerek hazırlayın. Tavuğu ince lifler halinde didikleyin ki sos her yere işlesin. Oda sıcaklığında servis edin.`,
  },
  'eskisehir-ciborek': {
    tr: `Çibörek, Kırım Tatarlarının Eskişehir'e taşıdığı ve bugün şehrin simgesi haline gelen bir lezzet. 19. yüzyılda ve sonrasında Kırım'dan göç eden Tatarlar, bu ince hamurlu, kıymalı ve kızartılmış böreği Eskişehir'in sofralarına kazandırmıştır. Şehirde çiböreğe özel lokantalar bulunur.

Çiböreği özel kılan, incecik açılan hamurun içine çiğ kıymalı harcın konup yarım ay şeklinde kapatılması ve kızgın yağda kızartılmasıdır. Kızarırken hamurun içinde biriken buhar, harcı sulu ve yumuşak tutar.

Püf noktası: Hamuru sertçe yoğurup dinlendirin ve olabildiğince ince açın. Harcı çiğ olarak ve ince bir tabaka halinde koyun. Kenarları çok iyi bastırın ki kızarırken açılmasın. Yağ yeterince sıcak olmalı, çiböreği koyduğunuzda köpürmelidir.`,
  },
  'denizli-kabak-tatlisi': {
    tr: `Kabak tatlısı, sonbahar ve kış aylarının en sevilen Türk tatlılarından biri. Bal kabağının kendi şekeri ve suyuyla pişirilmesiyle yapılan bu tatlı, az malzemeyle hazırlanır ama sabır ister. Ege'nin ve Denizli'nin güneşli tarlalarında yetişen bal kabakları, bu tatlıya çok uygundur.

Kabak tatlısının özelliği, kabağın üzerine serpilen şekerin bir gece boyunca kabaktan su çekmesi ve kabağın büyük ölçüde kendi suyunda pişmesidir. Üzerine serpilen ceviz ve tahin ya da kaymak, tatlının klasik eşlikçileridir.

Püf noktası: Kabakları şekerle katlayıp bir gece bekletin; böylece fazla su eklemenize gerek kalmaz ve kabak dağılmaz. Kapağı kapalı, kısık ateşte pişirin. Kabaklar yumuşayınca kapağı açıp şerbeti biraz koyulaştırın. Tamamen soğuduktan sonra servis edin.`,
  },
  'afyon-keskek': {
    tr: `Keşkek, dövme buğday ve etin uzun süre birlikte pişirilip dövülmesiyle yapılan, Anadolu'nun düğün, bayram ve hayır sofralarının yemeği. Keşkek geleneği, 2011 yılında UNESCO İnsanlığın Somut Olmayan Kültürel Mirası listesine alınmıştır. Afyon başta olmak üzere pek çok yörede keşkek, kalabalıklar için büyük kazanlarda pişirilir.

Keşkek pişirmek bir imece işidir: kazanın başında saatlerce tokmakla dövülen buğday ve et, lif lif ayrılan, yoğun ve kremsi bir kıvama ulaşır. Üzerine dökülen pul biberli tereyağı yemeği tamamlar.

Püf noktası: Buğdayı bir gece önceden suya yatırın. Eti ayrı haşlayıp suyunu buğdayı pişirmekte kullanın. Pişirme boyunca sürekli karıştırıp dövün, keşkek dibe tutmaya meyillidir. Kıvam, kaşıkla alındığında yavaşça düşecek kadar yoğun olmalıdır.`,
  },
  'adana-kagit-kebabi': {
    tr: `Kağıt kebabı, etin ve sebzelerin kâğıt bir paketin içinde kendi buharıyla pişirildiği bir fırın yemeği. Kuzu eti, soğan, domates, biber ve sarımsak baharatlarla marine edilip yağlı kâğıda sarılır ve fırına verilir. Paket sofrada açılır ve içinden yükselen buhar yemeğin kokusunu masaya yayar.

Bu pişirme yöntemi, etin suyunu ve aromasını içinde tutar; et yumuşar, sebzeler kendi suyunda pişer. Az yağlı ve hafif bir yemek olmasına rağmen oldukça lezzetlidir.

Püf noktası: Kâğıdın kenarlarını birkaç kez katlayarak sıkıca kapatın, buhar kaçmamalı. Eti marine etmeyi atlamayın. Paketleri fırına koymadan önce tepsiye dizin ve aralarında boşluk bırakın. Paketi sofrada açarken yüzünüzü uzak tutun, içinden çıkan buhar çok sıcaktır.`,
  },
  'diyarbakir-simit-kebabi': {
    tr: `Simit kebabı, Diyarbakır'ın mangal kültürünün sevilen kebaplarından biri. Baharatlı, sarımsaklı kıyma uzun silindirler halinde şişlere sarılır ve közde döndürülerek pişirilir. Diyarbakır'da kebap genellikle közlenmiş domates ve biber, taze soğan, maydanoz ve sumakla, lavaş üzerinde servis edilir.

Diyarbakır mutfağı, Güneydoğu Anadolu'nun bol baharatlı ve et ağırlıklı mutfak geleneğini taşır. Bu kebapta kıymaya katılan yumurta ve galeta unu, köftenin şişte tutunmasını kolaylaştırır.

Püf noktası: Harcı iyice yoğurup buzdolabında dinlendirin. Şişlere sararken ellerinizi ıslatın ve kıymayı şişin üzerinde sıkıca bastırın, pişerken düşmesin. Közün alevsiz olmasını bekleyin ve şişleri sık çevirin. Lavaşı aynı közde birkaç saniye ısıtarak kebabın yağını emdirin.`,
  },
  'kutahya-tas-kebabi': {
    tr: `Tas kebabı, adına rağmen şişte değil tencerede pişen, Türk mutfağının klasik et yemeklerinden biri. Kuşbaşı et, soğan, domates ve biberle birlikte kısık ateşte uzun süre pişirilerek yumuşacık bir yahniye dönüşür. Kütahya ve İç Anadolu'da tas kebabı, bulgur pilavıyla birlikte ev sofralarının ve esnaf lokantalarının sevilen yemeğidir.

Tas kebabının lezzeti, etin önce yüksek ateşte mühürlenmesi ve ardından kendi suyunda, domates ve baharatlarla ağır ağır pişmesinden gelir. Sos koyulaşıp ete işler.

Püf noktası: Eti tencereye az miktarlarda koyarak mühürleyin; kalabalık tencerede et suyunu bırakır ve kızarmaz. Pişirme boyunca kısık ateşi koruyun ve gerektiğinde az sıcak su ekleyin. Et iyice yumuşayıp sos koyulaşınca yemek hazırdır. Bulgur pilavıyla servis edin.`,
  },
  'malatya-kayisili-pilav': {
    tr: `Malatya, dünyanın en önemli kuru kayısı üretim merkezlerinden biri ve kayısı bu şehrin mutfağında tatlıdan pilava kadar her yerde karşınıza çıkar. Kayısılı pilav, tereyağlı pirinç pilavına kuru kayısı, kavrulmuş badem ve hafif baharatlar eklenerek yapılır.

Kuru kayısının tatlı ekşi tadı ile tarçın ve yenibaharın sıcak aroması, pilavı sıradan bir garnitürden çıkarıp özel bir yemeğe dönüştürür. Et yemekleriyle ya da yoğurtla birlikte servis edilir.

Püf noktası: Pirinci yarım saat suda bekletip iyice süzün, pilav tane tane olur. Bademleri ayrı kavurun ve servis sırasında ekleyin ki çıtırlıklarını korusunlar. Kuru kayısıları küçük küpler halinde doğrayın. Pilavı demledikten sonra kapağın altına bir bez koyarak dinlendirin.`,
  },
  'canakkale-midye-dolmasi': {
    tr: `Midye dolması, Türkiye'nin kıyı şehirlerinde, özellikle Marmara ve Ege'de, sokak lezzeti olarak da bilinen bir meze. Midyeler kabuğuyla birlikte, baharatlı pirinç harcıyla doldurulup buharda pişirilir ve limonla yenir. Çanakkale de denizle iç içe yaşayan mutfağıyla midye dolmasının sevildiği şehirlerdendir.

İç pilavdaki çam fıstığı, kuş üzümü, tarçın ve yenibahar, midye dolmasına kendine özgü, hafif tatlı ve baharatlı bir aroma verir. Midyeler soğuduktan sonra servis edilir.

Püf noktası: Midyeleri iyi temizleyin, sakallarını alın ve açık ya da kırık olanları kullanmayın. Kabukları bıçakla açarken iki yarıyı tamamen ayırmayın. İç pilavı yarı pişmiş olarak doldurun ve midyeleri fazla doldurmayın; pirinç pişerken şişer. Midyeleri tencereye sıkıca dizin ki pişerken açılmasınlar.`,
  },
  'van-mucver': {
    tr: `Van mutfağı, zengin kahvaltı kültürü ve otlu peyniriyle tanınır. Van otlu peyniri, yöreye özgü yabani otlarla olgunlaştırılan, kokulu ve tuzlu bir peynirdir. Bu tarif, klasik kabak mücverine Van otlu peyniri ve bol taze ot ekleyerek ona yöresel bir karakter kazandırır.

Rendelenmiş kabak, yumurta, un, dereotu, nane ve taze soğanla karıştırılır, kaşıkla tavaya alınıp kızartılır. Otlu peynir, mücvere hem tuzunu hem de aromasını verir. Yanında sarımsaklı yoğurtla servis edilir.

Püf noktası: Kabakları rendeledikten sonra tuzlayıp bekletin ve suyunu avucunuzla iyice sıkın; suyu alınmayan kabak mücveri dağıtır ve yağ çektirir. Otlu peynir tuzlu olduğu için ek tuzu dikkatli kullanın. Yağı orta-yüksek ısıda tutun ve mücverleri tavaya hafifçe bastırarak koyun.`,
  },
}

export function getRecipeIntro(recipeId, lang = 'tr') {
  return RECIPE_INTROS[recipeId]?.[lang] || null
}
