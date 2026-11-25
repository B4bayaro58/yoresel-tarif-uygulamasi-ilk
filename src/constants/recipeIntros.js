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

  // ── 5. grup (20 tarif) ──
  'maras-dondurma': {
    tr: `Maraş dondurması, uzayan, bıçakla kesilen ve kolay kolay erimeyen dokusuyla dünyada benzeri olmayan bir dondurma. Bu özel dokuyu Kahramanmaraş çevresindeki dağlarda yetişen orkidelerin yumrularından elde edilen salep ve dondurmanın uzun süre dövülmesi verir. Şehirde dondurmacılar, uzun demir küreklerle dondurmayı döverek ve çekerek hazırlar.

Salep dondurmaya esneklik, damla sakızı ise hafif reçinemsi kokusunu kazandırır. Dövme işlemi dondurmanın içindeki havayı azaltır ve onu yoğun, ağır bir kıvama getirir.

Püf noktası: Gerçek salep pahalı ve zor bulunur; mümkünse güvenilir bir yerden alın, hazır salep karışımları aynı dokuyu vermez. Damla sakızını dondurup öyle dövün, aksi halde yapışır. Dondurma donarken belirli aralıklarla çıkarıp kuvvetlice karıştırın ya da dövün; uzayan doku bu adımla oluşur.`,
  },
  'sivas-madımak-yemeği': {
    tr: `Madımak, Sivas ve çevresinde ilkbaharda dağlarda ve tarla kenarlarında kendiliğinden yetişen yabani bir ot. Kısa bir mevsimi olduğu için Sivaslılar için baharın gelişini müjdeler; toplanan madımak hem taze pişirilir hem de kurutularak kışa saklanır. Madımak yemeği, Sivas mutfağının en tanınan lezzetlerindendir.

Bu tarifte madımak önce kısa süre haşlanıp hafif buruk tadından arındırılır, ardından tereyağında kavrulan et, soğan ve salçayla birlikte pişirilir. Yanında sarımsaklı yoğurtla servis edilir.

Püf noktası: Madımağı çok iyi yıkayın, yabani ot olduğu için toprağı bol olabilir. Kalın ve sert saplarını ayıklayın. Haşlama süresini uzatmayın, birkaç dakika yeterlidir; fazla haşlanırsa lezzetini kaybeder. Taze bulamazsanız kurutulmuş madımağı önce ılık suda bekletip kullanabilirsiniz.`,
  },
  'manisa-mesir-macunu': {
    tr: `Mesir macunu, Manisa'nın yaklaşık beş yüz yıllık geleneğinin tatlı simgesi. Anlatılana göre Kanuni Sultan Süleyman'ın annesi Hafsa Sultan'ın hastalığı, Merkez Efendi'nin onlarca baharatla hazırladığı bir macunla iyileşmiş ve bunun üzerine macun her yıl halka dağıtılmaya başlanmıştır. Bugün de her bahar Sultan Camii'nin minarelerinden halka mesir macunu saçılır. Manisa Mesir Macunu Festivali, 2012'de UNESCO Somut Olmayan Kültürel Miras listesine girmiştir.

Mesir macunu, şeker şurubu ve balın onlarca baharatla birleşmesinden oluşur. Zencefil, tarçın, karanfil ve kakule gibi baharatlar ona sıcak ve keskin bir tat verir.

Püf noktası: Şurubu bir şeker termometresiyle takip edin; doğru ısıya ulaşmazsa macun katılaşmaz. Baharatları ateşten aldıktan sonra ekleyin ki aromaları yanmasın. Kesmeden önce macunun yarı katılaşmasını bekleyin.`,
  },
  'ankara-tava': {
    tr: `Ankara tava, başkentin kendi adını taşıyan geleneksel et yemeği. Kemikli kuzu eti, soğan, domates, biber ve sarımsakla birlikte toprak bir tavada, fırında ağır ağır pişirilir. Ankara'nın eski mahallelerinde bu yemek, evde hazırlanıp mahalle fırınına gönderilen yemeklerdendir.

Yemeğin lezzeti, kuzu etinin sebzelerin buharında ve kendi suyunda yumuşaması ve sonunda üstünün kızarmasından gelir. Bazı yörelerde Ankara tavası pirinç ya da arpa şehriye ile de yapılır; bu tarif sebzeli versiyondur.

Püf noktası: Eti pişirmeden önce baharatlarla bir süre bekletin. Toprak tava kullanıyorsanız kabı fırına soğukken koyun ve fırını onunla birlikte ısıtın, ani ısı farkı toprak kabı çatlatabilir. Tavanın üstünü pişirmenin ilk bölümünde kapalı tutun, son yarım saatte açarak kızartın.`,
  },
  'harput-koftesi': {
    tr: `Harput köftesi, adını Elazığ'ın tarihi Harput Kalesi'nden alan ve şehrin düğün ve misafir sofralarında yeri olan bir köfte. Haşlanmış pirinçle yoğrulan kıyma, iri toplar halinde şekillendirilip kızartılır ve ardından salçalı bir sosta fırında pişirilir.

Harput mutfağı, Doğu Anadolu'nun et ağırlıklı ve bol baharatlı geleneğini taşır. Bu köftede yenibahar ve kuru nane, sosun salça tadıyla birleşerek tanıdık ama kendine özgü bir lezzet oluşturur.

Püf noktası: Pirinci önceden haşlayıp tamamen soğutun, sıcak pirinç kıymayı yumuşatır. Harcı iyice yoğurun ki köfteler pişerken dağılmasın. Köfteleri fırına vermeden önce tavada kızartmak hem lezzet hem de şekil açısından önemlidir. Sosun köftelere iyice işlemesi için fırında acele etmeyin.`,
  },
  'corum-leblebisi': {
    tr: `Leblebi, kavrulmuş nohuttan yapılan, Türkiye'nin en sevilen kuruyemişlerinden biri. Çorum ise leblebinin başkenti olarak bilinir; şehirdeki leblebi atölyeleri, nohutu ıslatma, dinlendirme ve defalarca kavurma aşamalarından oluşan, günler süren bir yöntemi kuşaklardır sürdürür.

Leblebinin dışı sert, içi kuru ve çıtırdır. Sade, tuzlu, şekerli ya da baharatlı çeşitleri vardır. Çorum'a gelen ziyaretçilerin leblebi almadan dönmesi neredeyse düşünülemez.

Püf noktası: Evde ustaların yöntemini birebir uygulamak zordur, ancak nohutu iyice ıslatıp haşladıktan sonra tamamen kurutmak en önemli adımdır; nemli nohut çıtır olmaz. Kavururken sık sık karıştırın ki her taraf eşit pişsin. Leblebiyi soğuduktan sonra hava almayan bir kapta saklayın.`,
  },
  'kars-kaz-kavurmasi': {
    tr: `Kaz, Kars mutfağının ve kış hazırlıklarının en önemli parçası. Kars'ta köylerde yetiştirilen kazlar sonbaharda kesilir; etleri kavrulup kışa saklanır ya da tütsülenerek kurutulur. Uzun ve çok soğuk Kars kışında kaz eti, sofraların en kıymetli yiyeceklerinden biridir.

Kaz kavurması, kazın kendi yağında, soğan, sarımsak ve birkaç baharatla uzun süre pişirilmesiyle yapılır. Kaz eti, tavuğa göre daha koyu renkli, yağlı ve lezzetlidir. Kars'ta kaz eti genellikle bulgur pilavıyla birlikte sofraya gelir.

Püf noktası: Kaz etini pişirmeden önce baharatlarla bir gece bekletin. Pişirirken ek yağ kullanmayın; kazın kendi yağı yeterlidir. Kısık ateşte sabırla pişirin, kaz eti sert olabilir ve yumuşaması zaman alır. Et kemikten kolayca ayrıldığında yemek hazırdır.`,
  },
  'kastamonu-etli-ekmek': {
    tr: `Kastamonu etli ekmeği, Kastamonu fırınlarının sabahları hazırladığı, ince ama lahmacundan daha kalın hamurlu, bol kıymalı bir fırın lezzeti. Uzun ve dar şekliyle bilinir; dilimlenerek servis edilir.

Kastamonu mutfağı Batı Karadeniz'in sade ve doyurucu yemekleriyle tanınır. Etli ekmekte harç, kıyma, soğan, domates, biber ve maydanozdan oluşur ve hamura çiğ olarak sürülür.

Püf noktası: Harcın suyunu iyice sıkılmış rendelenmiş soğanla hazırlayın ki hamur ıslanmasın. Harcı hamurun tüm yüzeyine, kenarlara kadar eşit sürün. Fırını iyice ısıtın; etli ekmek yüksek ısıda kısa sürede pişmelidir. Fırından çıkınca hemen dilimleyip sıcak servis edin.`,
  },
  'kilis-tava': {
    tr: `Kilis tavası, Suriye sınırındaki Kilis'in, Gaziantep ve Halep mutfaklarıyla ortak bir geçmişe sahip mutfağından gelen bir fırın yemeği. Kuzu eti, domates, biber, soğan ve sarımsakla birlikte geniş bir tavada fırında pişirilir ve tavadan doğrudan sofraya gelir.

Bu yemekte kimyon ve pul biber, bölgenin baharat sevgisini yansıtır. Fırında sebzeler hafifçe karamelize olur, et ise sebzelerin suyunda yumuşar.

Püf noktası: Eti fırına vermeden önce yüksek ateşte mühürleyin, rengi ve lezzeti artar. Tavanın üstünü pişirmenin büyük bölümünde folyoyla kapalı tutun ki et kurumasın; son on beş dakikada açarak sebzelerin kızarmasını sağlayın. Maydanozu servis öncesi taze serpin.`,
  },
  'mudurnu-tavuk-yemegi': {
    tr: `Bolu'nun Mudurnu ilçesi, tarihi Osmanlı evleri ve uzun bir tavukçuluk geleneğiyle tanınır. Bu tarif, köy tavuğunun soğan, sarımsak ve domatesle birlikte tencerede yavaş yavaş pişirilmesiyle hazırlanan sade bir ev yemeği.

Yemeğin lezzetinin büyük kısmı tavuğun kendisinden gelir. Serbest dolaşan köy tavuğunun eti daha sıkı ve lezzetlidir, bu yüzden daha uzun sürede pişer. Defne yaprağı ve kekik, yemeğe hafif bir koku katar.

Püf noktası: Tavuk parçalarını tencereye az sayıda koyarak, her yüzü altın rengi olana kadar kızartın; kalabalık tencerede tavuk kızarmaz, haşlanır. Köy tavuğu kullanıyorsanız pişirme süresini uzatın ve gerekirse az su ekleyin. Kapağı kapalı, kısık ateşte pişirin.`,
  },
  'samsun-pide': {
    tr: `Samsun pidesi, Karadeniz pidesinin Samsun'a özgü yorumu. Kayık şeklindeki hamurun ortasına çiğ kıymalı harç konur, kenarları içe kıvrılır ama tamamen kapatılmaz; pişmeye yakın ortasına yumurta kırılarak fırına geri verilir. Fırından çıkınca üzerine bol tereyağı sürülür.

Samsun ve çevresinde pide fırınları, kıymalı, kuşbaşılı, peynirli ve yumurtalı pek çok çeşidi taş fırında pişirir. Sarısı akışkan kalan yumurta, pidenin kıymalı harcıyla karışarak ona ayrı bir lezzet verir.

Püf noktası: Yumurtayı pidenin pişmesine birkaç dakika kala kırın, böylece beyazı pişer ama sarısı akışkan kalır. Harcı çiğ olarak koyun ve soğanın suyunu iyice sıkın. Fırını en yüksek ısıya getirin. Tereyağını pide fırından çıkar çıkmaz, sıcakken sürün.`,
  },
  'amasya-elmali-pilav': {
    tr: `Amasya, Yeşilırmak vadisinde yetişen, küçük, kokulu ve hafif ekşi elmasıyla ünlüdür. Amasya elması şehrin mutfağında da yer bulur: elmalı pilav, bu elmanın tereyağlı pirinç pilavı, kıyma ve baharatlarla buluştuğu yöresel bir yemektir.

Elmanın hafif ekşiliği, tarçın ve yenibaharın sıcak aromasıyla birleşerek pilava tatlı ile tuzlu arasında dengeli bir tat verir. Üzerine serpilen kavrulmuş çam fıstığı ise doku katar.

Püf noktası: Elmaları doğradıktan sonra kararmasınlar diye limonlu suya atın. Elmayı pirinçle birlikte uzun süre pişirmeyin; kısa süre kavurmak yeterlidir, aksi halde erir ve pilavı lapalaştırır. Ekşimsi bir elma seçin, çok tatlı elmalar pilavın dengesini bozar.`,
  },
  'osmaniye-yerfistikli-baklava': {
    tr: `Osmaniye, Türkiye'nin en önemli yer fıstığı üretim bölgelerinden biri. Çukurova'nın verimli topraklarında yetişen yer fıstığı, şehrin mutfağında da önemli bir yer tutar. Yer fıstıklı baklava, klasik baklavanın bu yöreye özgü yorumudur.

Antep fıstığı yerine kavrulmuş yer fıstığıyla yapılan bu baklava, daha uygun maliyetli olmasının yanı sıra kendine özgü kavrulmuş bir aromaya sahiptir. Tereyağlı ince yufkalar ve soğuk şerbetle hazırlanır.

Püf noktası: Yer fıstığını önceden kavurun ve zarlarını ayıklayın; kavrulmamış fıstık baklavada çiğ tat bırakır. Yufkaların arasına tereyağını cömertçe sürün. Baklavayı fırına vermeden önce dilimleyin. Fırından çıkar çıkmaz soğuk şerbeti dökün ve birkaç saat dinlendirin.`,
  },
  'ordu-findik-corbasi': {
    tr: `Ordu, Türkiye'nin fındık üretiminde başı çeken şehirlerinden biri; yaz sonunda fındık hasadı tüm şehri hareketlendirir. Fındık, Ordu mutfağında tatlıdan pilava kadar pek çok yemekte kullanılır. Fındık çorbası ise bu yemişin kremsi ve sıcak bir yorumudur.

Kavrulmuş fındıklar et suyu ve sütle birlikte pişirilip pürüzsüz hale getirilir. Ortaya çıkan çorba, fındığın kavrulmuş aromasını taşıyan, kadifemsi ve doyurucu bir lezzettir.

Püf noktası: Fındıkları fırında kavurun ve sıcakken bir bezle ovalayarak zarlarını ayırın; zarlar çorbaya acılık verebilir. Çorbayı blenderdan geçirdikten sonra süzgeçten geçirirseniz daha pürüzsüz olur. Süt ekledikten sonra çorbayı kaynatmayın. Üzerine biraz kavrulmuş fındık kırığı serpin.`,
  },
  'sinop-mantı-corbası': {
    tr: `Sinop mantısı, Karadeniz kıyısındaki bu şehrin sofralarında sevilen bir lezzet. Bu tarifte küçük kıymalı mantılar, Kayseri mantısındaki gibi suda haşlanıp süzülmek yerine doğrudan et suyunda pişirilir ve çorba olarak servis edilir. Üzerine sarımsaklı yoğurt ve kızgın tereyağı eklenir.

Mantının çorba olarak sunulması, yemeği hem daha hafif hem de kış günleri için daha sıcak ve doyurucu kılar. Salçalı et suyu, yoğurt ve naneli tereyağı birlikte zengin bir tat oluşturur.

Püf noktası: Hamuru sert yoğurup dinlendirin ve ince açın. Mantıları sıkıca kapatın ki et suyunda pişerken açılmasın. Mantıları kaynayan et suyuna atın ve pişince hemen servis edin; bekledikçe hamur suyu çeker. Yoğurdu oda sıcaklığında kullanın.`,
  },
  'erzincan-tulum-gozlemesi': {
    tr: `Erzincan tulum peyniri, keçi ya da koyun derisinden yapılan tulumlarda olgunlaştırılan, keskin ve kendine özgü tadıyla ünlü, coğrafi işaretli bir peynir. Bu peynirle yapılan gözleme, Erzincan'ın ve Doğu Anadolu'nun sevilen hamur işlerinden biridir.

İncecik açılan hamurun arasına ufalanmış tulum peyniri ve nane konur, sacda ya da tavada pişirilir. Pişerken eriyen tulum peyniri gözlemeye yoğun ve tuzlu bir lezzet verir.

Püf noktası: Hamuru yumuşak yoğurup dinlendirin ve olabildiğince ince açın. Tulum peyniri tuzlu olduğu için hamura ve harca ekstra tuz eklemeyin. Sacı ya da tavayı önceden iyice ısıtın. Gözlemenin her iki yüzü pişince tereyağı sürün ve sıcak servis edin.`,
  },
  'bayburt-tutmac': {
    tr: `Tutmaç, Orta Asya'dan Anadolu'ya uzanan çok eski bir Türk yemeği. Adına 11. yüzyılda yazılan Kaşgarlı Mahmud'un Divânu Lugâti't-Türk'ünde rastlandığı bilinir. Bayburt'ta tutmaç, ince açılıp küçük kareler halinde kesilen hamurun et suyunda pişirilip yoğurt ve nohutla birleştirilmesiyle yapılan bir çorbadır.

Tutmaç, Doğu Anadolu'nun soğuk kışlarında sofraların sıcak ve doyurucu yemeğidir. Üzerine gezdirilen naneli ve pul biberli tereyağı, çorbaya hem renk hem de koku katar.

Püf noktası: Hamuru sert yoğurun ve kestiğiniz parçaları biraz kurutun ki pişerken dağılmasınlar. Yoğurdu çorbaya doğrudan eklemeyin, önce birkaç kepçe sıcak suyla ılıştırın. Yoğurt ekledikten sonra çorbayı kaynatmadan, kısık ateşte karıştırarak pişirin.`,
  },
  'tatvan-inci-kefali': {
    tr: `İnci kefali, dünyada yalnızca Van Gölü havzasında yaşayan bir balık. Van Gölü'nün sodalı suyuna uyum sağlamış bu balık, her ilkbaharda üremek için göle dökülen tatlı su derelerine göç eder. Göl kıyısındaki Tatvan, inci kefalinin en çok tüketildiği yerlerden biridir.

İnci kefali küçük bir balıktır ve genellikle bütün olarak, mısır ununa bulanıp kızartılır. Eti yumuşak ve hafiftir. Yanında soğan, maydanoz ve limonla servis edilir.

Püf noktası: Balıkları tuzlayıp kısa süre bekletin, ardından mısır ununa bulayıp fazlasını silkeleyin. Yağı iyice ısıtın ve balıkları tavaya kalabalık etmeden koyun ki çıtır kızarsınlar. Küçük balıklar çabuk pişer; her yüzünü birkaç dakika kızartmak yeterlidir.`,
  },
  'mugla-zeytinyagli-semizotu': {
    tr: `Semizotu, yazın bahçelerde ve tarla kenarlarında kendiliğinden yetişen, etli yapraklı bir ot. Muğla ve Ege mutfağında hem salatası hem de zeytinyağlısı yapılır. Hafif ekşimsi ve ferah tadıyla sıcak yaz günlerinin hafif yemeklerinden biridir.

Zeytinyağlı semizotu, soğan, sarımsak ve domatesle zeytinyağında pişirilir ve limonla tatlandırılır. Tüm zeytinyağlılar gibi soğuk ya da oda sıcaklığında, yanında yoğurt ve ekmekle servis edilir.

Püf noktası: Semizotunu çok iyi yıkayın, toprak ve kum barındırabilir. Kalın saplarını ayıklayın. Semizotu kendi suyunu bırakır, bu yüzden ek su eklemeyin. Fazla pişirmeyin; yapraklar dağılmadan, hafif diriliğini koruyacak kadar pişirin. Limonu en son ekleyin.`,
  },
  'gumushane-pestil': {
    tr: `Pestil, üzüm ya da dut gibi meyvelerin suyunun nişasta veya unla koyulaştırılıp ince tabaka halinde kurutulmasıyla yapılan geleneksel bir kış yiyeceği. Gümüşhane, pestil ve köme gibi meyve ürünleriyle ünlüdür; şehirde bağ bozumu mevsimi aynı zamanda pestil yapma mevsimidir.

Kurutulan pestil rulo yapılarak ya da katlanarak saklanır ve aylarca bozulmadan dayanır. Eskiden kış aylarında şeker yerine tüketilen besleyici bir atıştırmalıktı; bugün de kuruyemişlerle birlikte sevilerek yenir.

Püf noktası: Üzüm suyunu süzüp berraklaştırın ve köpüğünü alın. Nişastayı soğuk suyla eritip ekleyin ve karışımı sürekli karıştırarak koyulaştırın. Pestili ince ve eşit kalınlıkta yayın, kalın yerler kurumaz. Kurutma için güneşli ve havadar bir yer seçin.`,
  },

  // ── 6. grup (10 tarif) ──
  'beypazari-kurusu': {
    tr: `Beypazarı kurusu, Ankara'nın tarihi ilçesi Beypazarı'nın en bilinen lezzeti. Zeytinyağı ve sütle yoğrulan hamur, ince uzun çubuklar halinde açılıp susam ve çörekotuna bulanır ve fırında kurutulurcasına pişirilir. Sonuç, sert, çıtır ve uzun süre bozulmayan bir atıştırmalıktır.

Beypazarı'nda kurular eskiden fırınlarda ekmekle birlikte pişirilir, kışlık olarak saklanırdı. Bugün tarihi konaklarıyla ziyaretçi çeken ilçenin çarşısında, havuç lokumu ve kurutulmuş meyvelerle birlikte en çok satılan ürünlerdendir. Çayın yanında, özellikle kahvaltıda ve akşam sohbetlerinde sevilerek yenir.

Püf noktası: Zeytinyağını una parmak uçlarınızla iyice yedirin ki hamur kum gibi olsun; kurunun gevrekliği buradan gelir. Çubukları eşit kalınlıkta açın ki aynı sürede pişsinler. Fırında acele etmeyin, orta ısıda kuruyarak pişmelidir. Tamamen soğuduktan sonra kapalı kavanozda saklayın.`,
  },
  'sakarya-islama-kebabi': {
    tr: `Islama köfte, Adapazarı'nın ve Sakarya'nın simge lezzeti. Izgarada pişen köftelerin yanında servis edilen ekmek, köftelerin pişirildiği et suyuna batırılarak "ıslatılır"; yemek de adını buradan alır. Adapazarı'nda ıslama köfteciler genellikle yalnızca köfte ve ıslanmış ekmek, yanında da piyaz ve közlenmiş biber sunar.

Bu tarif, ıslama ekmeğe sarımsaklı yoğurt ve pul biberli tereyağı da ekleyerek onu doyurucu bir kebap tabağına dönüştürür. Ekmeğin et suyunu çekip yumuşaması ama dağılmaması, ıslamanın en önemli inceliğidir.

Püf noktası: Ekmeği önce kızartın ya da ızgarada hafifçe kurutun; böylece et suyunu çeker ama hamurlaşmaz. Et suyunu ekmeğe servis anında, sıcak olarak dökün. Köfteleri ızgarada yüksek ateşte kısa sürede pişirin ki suyunu kaybetmesin.`,
  },
  'sivas-kangal-köftesi': {
    tr: `Kangal, Sivas'ın hem dünyaca tanınan çoban köpeği ırkına hem de kaplıcalarına adını veren ilçesi. Kangal köftesi, bu bölgenin adını taşıyan, kimyonlu ve pul biberli, silindir şeklinde bir köfte. Domates sosu, biber ve domatesle birlikte pişirilerek sulu bir yemek olarak servis edilir.

Kıymaya katılan ıslatılmış ekmek ve yumurta, köfteyi yumuşak tutar; kimyon ve yenibahar ise Orta Anadolu mutfağının sevdiği sıcak baharat tadını verir. Yanında pilav ve cacıkla tam bir öğün olur.

Püf noktası: Ekmek içini ıslattıktan sonra suyunu çok iyi sıkın, fazla su köfteyi dağıtır. Harcı uzun süre yoğurup dinlendirin. Köfteleri sosa koymadan önce tavada her yüzünü mühürleyin. Sosta pişirirken köfteleri çok karıştırmayın, tencereyi sallamak yeterlidir.`,
  },
  'bolu-dugun-corbasi': {
    tr: `Bolu, Türkiye'nin aşçılarıyla ünlü şehridir; özellikle Mengen ilçesi, Osmanlı saray mutfağından bugünün otellerine kadar yetiştirdiği ustalarla tanınır. Bolu düğün çorbası, bu zengin mutfak geleneğinin düğün sofralarındaki temsilcisidir ve geleneksel olarak sofranın açılış yemeğidir.

Kuzu etinin suyuyla hazırlanan çorba, kavrulmuş un ve yumurta sarısı ile limondan oluşan bir terbiyeyle koyulaştırılır. Didiklenmiş et, çorbayı doyurucu yapar; üzerine gezdirilen naneli ve pul biberli tereyağı ise kokusunu tamamlar.

Püf noktası: Unu tereyağında kokusu çıkana kadar kavurun, çiğ un tadı kalmasın. Terbiyeyi çorbaya eklemeden önce birkaç kaşık sıcak çorbayla ılıştırın; yoksa yumurta pişip topaklanır. Terbiyeyi ekledikten sonra çorbayı kaynatmayın.`,
  },
  'duzce-findikli-pilav': {
    tr: `Düzce, Batı Karadeniz'in fındık bahçeleriyle çevrili şehirlerinden biri. Fındık, bölgede yalnızca bir tarım ürünü değil, mutfağın da temel malzemelerindendir. Fındıklı pilav, tereyağında kavrulmuş fındık ve didiklenmiş tavukla zenginleştirilmiş bir pirinç pilavıdır.

Kavrulmuş fındık, pilava hem çıtır bir doku hem de hafif tatlı ve kavrulmuş bir aroma katar. Tavuk suyuyla pişen pilav, misafir sofraları için hem kolay hem de gösterişli bir seçenektir.

Püf noktası: Fındıkları tereyağında altın rengine kadar kavurun ve kenara alın; pilavla birlikte pişirirseniz yumuşar ve çıtırlığını kaybeder. Servis sırasında üzerine serpin. Pirinci önceden ıslatıp süzün ve suyu sıcak olarak ekleyin. Pilavı demlerken kapağın altına kâğıt havlu koyun.`,
  },
  'kirsehir-ciger-sarma': {
    tr: `Ciğer sarma, Orta Anadolu'nun sakatat ağırlıklı mangal kültürünün sevilen lezzetlerinden biri. Baharatlarla marine edilen ince kuzu ciğeri dilimleri ince bir zarla sarılıp şişe geçirilir ve közde pişirilir. Kırşehir'de bu lezzet genellikle lavaş, soğan, maydanoz ve sumakla birlikte servis edilir.

Ciğeri saran zar, közde pişerken çıtırlaşır ve ciğerin kurumasını önleyerek suyunu içinde tutar. Böylece ciğer dışta çıtır, içte yumuşak ve sulu kalır.

Püf noktası: Ciğeri ince ve eşit kalınlıkta dilimleyin. Zarı soğuk suda iyice yıkayın ve ciğeri sıkıca sarın. Közün alevsiz olmasını bekleyin ve şişleri sık çevirin. Ciğeri fazla pişirmeyin; aşırı pişen ciğer sertleşir. Zar kızarıp çıtırlaştığında genellikle ciğer de hazırdır.`,
  },
  'sirnak-cizre-köftesi': {
    tr: `Cizre köftesi, Şırnak'ın Dicle kıyısındaki tarihi ilçesi Cizre'nin adını taşıyan bir ızgara köftesi. Güneydoğu Anadolu mutfağının et ve bulguru bir araya getiren geleneğini yansıtır: kuzu ve dana kıymasına iri bulgur katılarak yoğrulur ve közde pişirilir.

İri bulgur, köfteye hem bağlayıcılık hem de dişte hissedilen bir doku verir. Kimyon ve pul biber ise bölgenin baharatlı damak tadını taşır. Köfte genellikle lavaş, soğan salatası ve közlenmiş sebzelerle servis edilir.

Püf noktası: Bulguru ıslattıktan sonra suyunu çok iyi sıkın, fazla su köfteyi dağıtır. Harcı uzun süre yoğurun ki bulgur kıymayla iyice kaynaşsın, ardından buzdolabında dinlendirin. Köfteleri ıslak elle şekillendirin ve alevsiz közde pişirin.`,
  },
  'zonguldak-misir-corbasi': {
    tr: `Zonguldak, Türkiye'nin taş kömürü madenciliğinin merkezi. Uzun ve ağır vardiyalardan dönen maden işçilerinin sofrasında sıcak ve tok tutan yemekler her zaman önemli olmuştur. Zonguldak mısır çorbası, kurutulmuş mısır taneleri, kuru fasulye ve etle hazırlanan bu türden doyurucu bir kış çorbasıdır.

Batı Karadeniz mutfağında mısır temel bir malzemedir. Kurutulmuş mısır, uzun pişirme sonunda yumuşar ve çorbaya hem kıvam hem de hafif tatlı bir lezzet verir. Yanında mısır ekmeği ile servis edilir.

Püf noktası: Kurutulmuş mısırı ve fasulyeyi bir gece önceden suya yatırın, aksi halde pişmeleri çok uzun sürer. Düdüklü tencere süreyi kısaltır. Tuzu, mısır ve fasulye yumuşadıktan sonra ekleyin. Çorba bekledikçe koyulaşır; ısıtırken biraz sıcak su ekleyin.`,
  },
  'yalova-zeytinli-ekmek': {
    tr: `Yalova'nın Armutlu ve Çınarcık çevresi, Marmara'nın zeytin yetiştirilen bölgelerinden biri. Bölgede zeytin, kahvaltı sofralarından ekmeğin içine kadar her yerdedir. Zeytinli ekmek, mayalı hamura iri kıyılmış siyah zeytin, kekik ve biberiye katılarak fırında pişirilen kokulu bir ekmektir.

Zeytin hamura hem tuzunu hem de yağlı, meyvemsi aromasını verir. Kekik ve biberiye ise ekmeğe Akdeniz'in tanıdık otsu kokusunu katar. Kahvaltıda peynir ve domatesle ya da çorbanın yanında çok yakışır.

Püf noktası: Zeytinleri hamura ilk mayalanmadan sonra, yumruk yapıp söndürdüğünüzde ekleyin; baştan eklenirse hamurun gelişmesini zorlaştırır. Zeytin tuzlu olduğu için hamurdaki tuzu azaltabilirsiniz. Ekmeği fırından çıkınca tel ızgarada soğutun, alt kısmı nemlenmez.`,
  },
  'manisa-kebabi': {
    tr: `Manisa kebabı, Ege'nin bu tarihi şehrinin kendi adını taşıyan kebabı. İnce, yassı kuzu köfteleri, domates sosuyla ıslatılmış küp küp pide üzerine dizilir, yanına sarımsaklı yoğurt konur ve en son üzerine kızgın tereyağı dökülür. Görünüşüyle İskender'i hatırlatsa da döner yerine köfteyle yapılır.

Manisa kebabını özel kılan, köftelerin ince ve yassı olması ve tabağın her katmanının ayrı ayrı hazırlanmasıdır: domates sosunu emmiş pide, sıcak köfteler, serin yoğurt ve cızırdayan tereyağı.

Püf noktası: Köfte harcını dinlendirdikten sonra ince ve eşit kalınlıkta şekillendirin ki çabuk ve eşit pişsinler. Domates sosunu pideye servis anında, sıcakken dökün. Yoğurdu oda sıcaklığında kullanın. Tereyağını sofraya getirmeden hemen önce köpürtüp dökün.`,
  },
  'cig-kofte': {
    tr: `Çiğ köfte, Güneydoğu Anadolu'nun, özellikle Adıyaman ve Şanlıurfa'nın simge lezzetlerinden biri. Geleneksel tarifte çiğ et, ince bulgur ve isotla uzun uzun yoğrulur. Bugün yaygın olarak tüketilen etsiz versiyon ise Adıyaman'da bir esnaf geleneğine dönüşmüş ve ülkenin dört bir yanına buradan yayılmıştır.

Çiğ köftenin lezzeti malzemeden çok emekten gelir. Bulgur, salçalar ve baharatlarla uzun süre yoğruldukça yumuşar, birbirine kaynaşır ve köfteye o tanıdık parlak, yapışkan dokusunu verir. Marul, limon ve nar ekşisi ise baharatın acısını dengeler.

Püf noktası: Bulguru ıslatırken suyu fazla koymayın; bulgur yalnızca emebileceği kadar su almalı. Yoğurma süresinden kısmayın, isterseniz eldiven giyerek çalışın. Soğanın suyunu iyice sıkın, aksi halde köfte cıvıklaşır. Hazırladığınız gün tüketin.`,
  },
  'konya-etli-ekmegi': {
    tr: `Konya etli ekmeği, şehrin coğrafi işaretle tescilli ve en çok bilinen lezzeti. İnce açılmış, upuzun bir hamurun üzerine yayılan kıymalı harç, taş fırında birkaç dakikada pişer. Konya'da etli ekmek bir öğle yemeğinden çok bir sofra kültürüdür; fırından çıkar çıkmaz, kenarı kıtırken kesilip yenir.

Etli ekmeği pideden ayıran şey, hamurun ince ve uzun, harcın da hamurun tamamına ince bir tabaka halinde yayılmasıdır. Harçtaki kıyma, soğan, domates ve biberin dengesi, fırında etin kendi suyuyla pişmesini sağlar.

Püf noktası: Harcı hamura ince yayın; kalın harç hamurun pişmesini engeller ve etli ekmeği ıslatır. Fırını mümkün olan en yüksek sıcaklıkta önceden iyice ısıtın, varsa pizza taşı kullanın. Etli ekmek beklemeye gelmez; fırından çıktığı anda maydanozla servis edin.`,
  },
  'konya-tandir-kebabi': {
    tr: `Tandır, Orta Anadolu'nun en eski pişirme yöntemlerinden biri. Konya ve çevresinde kuzu, toprağa gömülü kuyu tandırlarda saatlerce, kendi yağı ve buharıyla pişirilir. Sonuç, kemikten kendiliğinden ayrılan, yumuşacık ve kokulu bir ettir. Konya mutfağında tandır ve fırın kebabı, düğünlerin ve bayram sofralarının baş köşesinde yer alır.

Evde kuyu tandırı olmasa da aynı sonuca yakın bir lezzet elde etmek mümkün: sıkıca kapatılmış bir güveç ve düşük fırın ısısı, tandırın kapalı ortamını taklit eder. Et kendi buharında pişerken sarımsak ve baharatlar etin içine işler.

Püf noktası: Güvecin ağzını folyoyla hava almayacak şekilde kapatın ve pişirme boyunca açmayın; buhar kaçarsa et kurur. Kemikli parça tercih edin, kemik hem lezzet verir hem eti dağılmaktan korur. Son kızartma aşamasını atlamayın, etin üzerine renk ve hafif bir kabuk kazandırır.`,
  },
  'malatya-kayisi-dolmasi': {
    tr: `Malatya, dünyanın en önemli kuru kayısı üretim merkezlerinden biri ve kayısı bu şehrin mutfağında tatlılarla sınırlı kalmaz. Kuru kayısı dolması, kayısının tatlı ekşiliğini kıymalı iç harçla buluşturan, Malatya'ya özgü bir ana yemektir.

Bu yemeği ilginç kılan tatlı ile tuzlunun dengesidir. Kayısı pişerken yumuşar, şeffaflaşır ve etin lezzetini emer. Yenibahar ve tarçın ise hafif tatlı, sıcak bir koku katar. Yanında yoğurtla servis edildiğinde bu denge daha da belirginleşir.

Püf noktası: Kayısıları fazla bekletmeyin; şeklini kaybedecek kadar yumuşarsa doldururken yırtılır. Pirinç pişerken şişeceği için harcı az koyun. Dolmaları tencereye sıkı dizin ki pişerken açılmasınlar. Kükürtsüz, iri ve yumuşak kayısılar en iyi sonucu verir.`,
  },
  'mardin-sembusek': {
    tr: `Sembusek, Mardin mutfağının yarım ay şeklindeki kıymalı hamur işi. Adı, Orta Doğu mutfaklarında yaygın olan "sambusek" ile akrabadır. Mardin'de sembusek geleneksel olarak fırında pişirilir; bu tarifte ise evde daha kolay uygulanabilecek kızartma yöntemi kullanılıyor.

Sembuseki benzerlerinden ayıran, iç harçtaki ceviz ve sumaktır. Ceviz harca dolgunluk, sumak ise hafif ekşi ve ferah bir tat verir. Yenibahar ve tarçın Mardin mutfağının tanıdık baharatlarıdır.

Püf noktası: İç harcı hamura koymadan önce tamamen soğutun; sıcak harç hamuru yumuşatır ve kapatırken yırtılmasına yol açar. Kenarları iyice bastırın ki kızarırken açılmasın. Yağın sıcaklığına dikkat edin: fazla sıcak yağda dışı yanar, içi çiğ kalır. Fırında pişirmek isterseniz üzerine yumurta sarısı sürün.`,
  },
  'afyon-kaymakli-kadayif': {
    tr: `Afyonkarahisar kaymağıyla ünlü bir şehir ve Afyon kaymağı coğrafi işaretle tescillidir. Kaymaklı ekmek kadayıfı da bu şehrin adıyla anılan tatlıların başında gelir: şerbeti emmiş, tereyağında kızarmış ekmek ve üzerine bolca kaymak.

Geleneksel ekmek kadayıfı, bu tatlı için özel olarak pişirilip kurutulan yuvarlak bir ekmekle yapılır ve hazır olarak da satılır. Bu tarif ise evdeki bayat somun ekmekle hazırlanan pratik bir versiyon. Sonuç yine şerbetini çekmiş, yumuşak ama dağılmayan bir tatlıdır.

Püf noktası: Şerbetle ekmeğin sıcaklıkları birbirine zıt olmalı; sıcak ekmeğe soğuk şerbet dökülür ki ekmek şerbeti emsin ama hamurlaşmasın. Kaymağı servis anında, şerbet tamamen emildikten sonra koyun. Kaymak bulamazsanız süzme yoğurt ya da mascarpone ile hafif bir alternatif yapabilirsiniz.`,
  },
  'adana-bici-bici': {
    tr: `Bici bici, Adana'nın kavurucu yazlarının serinletici tatlısı. Şehirde sokak arabalarından ve tatlıcılardan satılan bu tatlı, nişastayla pişirilip soğutulan şeffaf bir peltenin dövülmüş buz ve şerbetle buluşmasından oluşur. Adının nereden geldiğine dair farklı hikayeler anlatılır.

Bici biciyi özel kılan, farklı dokuların bir arada olmasıdır: yumuşacık pelte, kırılmış buz ve üzerine gezdirilen gül şerbeti. Hem bir tatlı hem de sıcak havada bir serinlik kaynağıdır.

Püf noktası: Nişastayı soğuk suda tamamen eritmeden ateşe almayın, aksi halde topaklanır. Pişirirken ocağın başından ayrılmayın ve sürekli karıştırın. Peltenin buzdolabında iyice sertleşmesini bekleyin. Buzu servis anında dövün ve tatlıyı hemen sunun; beklerse buz eriyip tatlı sulanır.`,
  },
  'adana-patlican-kebabi': {
    tr: `Patlıcan kebabı, Adana ve Gaziantep başta olmak üzere Güneydoğu'nun yaz sofralarının vazgeçilmezi. Patlıcan mevsiminde mangal başında hazırlanan bu kebapta isotlu kıyma ile patlıcan aynı közde pişer; patlıcan közün aromasını, kıyma da kendi yağını tabağa taşır.

Bölgede patlıcan kebabının farklı yapılış biçimleri vardır: kimi yerde patlıcan ve köfte aynı şişe sırayla dizilir, kimi yerde ayrı şişlerde pişirilip tabakta birleştirilir. Bu tarif ikinci yolu izliyor; böylece her ikisi de tam kıvamında pişirilebilir.

Püf noktası: Patlıcanları alacalı soymak, közde daha eşit pişmelerini sağlar. Kıymayı yağlı seçin, yağsız kıyma közde kurur. Şişleri sık sık çevirin. Kızgın tereyağını servis anında dökün; lavaşı kebabın altına sererek yağını emdirmeyi unutmayın.`,
  },
  'ayvalik-tostu': {
    tr: `Ayvalık tostu, Balıkesir'in bu sahil ilçesinin adını tüm Türkiye'ye duyuran sokak lezzeti. Sıradan bir kaşarlı tosttan çok farklıdır: kalın somun ekmeğinin arasına kaşar ve sucuğun yanında domates, turşu, biber ve sos konur, tost makinesinde bastırılarak kıtır kıtır pişirilir.

Ayvalık tostunun cazibesi, malzemelerin bolluğu ve tuzlu, ekşi, acı tatların bir arada olmasıdır. Turşu ve sos, kaşarla sucuğun ağırlığını hafifletir. Ayvalık'ta her tostçunun kendi içerik kombinasyonu ve sos tarifi olduğu için iki tost birbirinin aynısı olmayabilir.

Püf noktası: Ekmeği kalın kesin, ince ekmek bu kadar malzemeyi taşıyamaz. Kaşarı ekmeğe en yakın katmana koyun, eriyince diğer malzemeleri bir arada tutar. Turşu ve domatesin suyunu kağıt havluyla alın ki tost ıslanmasın. Tost makinesini iyice ısıttıktan sonra tostu yerleştirin.`,
  },
  'artvin-karalahana-corbasi': {
    tr: `Karalahana, Doğu Karadeniz mutfağının temel sebzesi. Artvin'den Rize'ye kadar bölgenin bahçelerinde yetişen bu koyu yeşil, sert yapraklı lahana kışın soğuğuna dayanır ve sofralardan eksik olmaz. Karalahana çorbası da yörenin en bilinen kış yemeklerinden biridir.

Bu çorbada karalahananın hafif buruk tadı, kuru fasulyenin doyuruculuğu ve mısır ununun verdiği kıvam bir araya gelir. Mısır unu Karadeniz mutfağının vazgeçilmez malzemesidir ve çorbaya hem yoğunluk hem de hafif tatlı bir lezzet katar.

Püf noktası: Yaprakların sert orta damarlarını mutlaka ayıklayın, pişse de lifli kalır. Mısır ununu çorbaya eklemeden önce az soğuk suyla açın ki topaklanmasın. Çorba bekledikçe koyulaşır; ısıtırken biraz sıcak su ekleyin. Yanında mısır ekmeğiyle servis edin.`,
  },
  'artvin-mihlamasi': {
    tr: `Mıhlama, Doğu Karadeniz'in kahvaltı sofralarının yıldızı. Trabzon'da kuymak, Rize ve Artvin'de mıhlama olarak bilinen bu yemek; mısır unu, tereyağı ve peynirin sahanda buluşmasından oluşan sade ama doyurucu bir lezzettir. Yayla tereyağının ve peynirin kalitesi mıhlamanın lezzetini doğrudan belirler.

İyi bir mıhlamanın ölçüsü, kaşıkla alındığında peynirin tel tel uzamasıdır. Bunun için mısır unu tam kıvamında pişmeli, peynir ise en sonda eklenmelidir. Mıhlama genellikle ortaya konan sahandan, herkes ekmeğini banarak yenir.

Püf noktası: Mısır ununu kaynar suya yavaş yavaş ekleyin ve sürekli karıştırın. Tereyağından kısmayın; mıhlamayı mıhlama yapan odur. Peynir tuzlu ise ayrıca tuz eklemeyin. Mıhlama soğudukça katılaşır; ocaktan alır almaz sofraya getirin.`,
  },
  'hopa-hamsi-tava': {
    tr: `Hamsi Karadeniz'in balığıdır ve kış aylarında bölgede adeta bir mevsim kutlamasına dönüşür. Gürcistan sınırına yakın Hopa, Artvin'in denize açılan ilçelerinden biridir. Hamsi tava ise bu balığı pişirmenin en sevilen ve en yalın yoludur.

Karadeniz usulü hamsi tavada balık buğday unu yerine mısır ununa bulanır. Mısır unu hamsinin dışında ince, kıtır bir kabuk oluştururken içini sulu bırakır. Bölgede hamsi tavanın yanında mısır ekmeği, soğan ve bolca limon olur.

Püf noktası: Hamsiyi pişirmeden hemen önce una bulayın; beklerse un nemlenir ve kabuk kıtır olmaz. Yağı iyice kızdırın ve tavaya az balık koyun; kalabalık tavada yağ soğur, hamsi yağ çeker. Taze hamsinin gözleri parlak, solungaçları kırmızı olur.`,
  },
  'maras-tarhana-corbasi': {
    tr: `Maraş tarhanası, Türkiye'nin bilinen tarhanalarından oldukça farklıdır. Yoğurt ve buğdayla hazırlanan hamur ince yapraklar halinde serilip güneşte kurutulur. Kahramanmaraş'ta bu tarhana yalnızca çorbada kullanılmaz, kuru haliyle çerez gibi de yenir. Çorbası ise kış aylarında yörenin en çok pişirilen yemeklerinden biridir.

Tarhana, yazın bolluğunu kışa saklamanın eski bir yoludur. Yoğurdun ekşiliği ve kurutma sırasında gelişen aroma, çorbaya kendine özgü, hafif ekşi bir lezzet verir. Üzerine gezdirilen Maraş biberli tereyağı ise yörenin imzasıdır.

Püf noktası: Yaprak tarhanayı ufalayıp önceden ıslatın, böylece daha kısa sürede ve pürüzsüz bir kıvamda pişer. Çorbayı kısık ateşte sık sık karıştırarak pişirin, tarhana tencerenin dibini kolayca tutar. Maraş biberini yakmadan kızdırın; yanan biber acılaşır.`,
  },
  'coban-salatasi': {
    tr: `Çoban salatası, Anadolu'nun hemen her sofrasında karşınıza çıkan, en sade ve en tanıdık salatalardan biri. Adının, kırda sürüsünü güden çobanların yanlarında taşıdıkları birkaç basit sebzeyi doğrayıp karıştırmasından geldiği anlatılır. Kebapların, ızgaraların ve kuru fasulyenin yanında olmazsa olmazdır.

Bu salatanın lezzeti tamamen malzemenin tazeliğine bağlıdır. Yaz mevsiminde olgunlaşmış domates, çıtır salatalık ve hafif acı sivri biber, bir tutam soğan ve iyi bir zeytinyağıyla birleştiğinde başka bir şeye ihtiyaç duymaz.

Püf noktası: Sebzeleri küçük ve eşit boyda doğrayın ki her lokmada hepsinin tadı gelsin. Soğanı biraz tuzla ovup yıkarsanız keskinliği azalır. Tuzu ve sosu servis anında ekleyin; erken eklenen tuz domatesin ve salatalığın suyunu salar, salata sulanır.`,
  },
  'beypazari-guveci': {
    tr: `Beypazarı, Ankara'nın tarihi evleri, kurusu ve mutfak kültürüyle tanınan ilçesi. Yörede yemekleri toprak güveçte, fırının yavaş ısısında pişirmek köklü bir alışkanlıktır. Beypazarı güveci de kuzu etinin sebzeler ve nohutla birlikte kendi suyunda piştiği doyurucu bir sofra yemeğidir.

Toprak güveç ısıyı yavaş ve eşit dağıtır; bu sayede et sertleşmeden yumuşar, sebzeler etin suyunu çeker. Kapağın kapalı tutulması buharın içeride kalmasını, malzemelerin birbirinin lezzetini almasını sağlar.

Püf noktası: Toprak güveci ilk kullanımdan önce suda bekletin ve soğuk fırına koyup fırınla birlikte ısıtın; ani sıcaklık değişimi güveci çatlatabilir. Eti soğanların üzerine yerleştirin ki dibi tutmasın. Son on beş dakikada kapağı açıp üstünün kızarmasına izin verin.`,
  },
  'konya-tirit': {
    tr: `Tirit, Konya mutfağının en eski ve en sevilen yemeklerinden biri. Haşlanmış kuzu etinin suyuyla ıslatılmış ekmek; sarımsaklı yoğurt ve kızgın tereyağıyla buluşur. Bayatlayan ekmeği değerlendirmenin lezzetli bir yolu olan tirit, Anadolu'nun israfı sevmeyen mutfak anlayışının güzel bir örneğidir.

Tiriti başarılı kılan, ekmeğin et suyunu tam kıvamında emmesidir: ne kuru kalmalı ne de lapa olmalı. Üzerine konan yumuşacık kuzu eti, serin yoğurt ve cızırdayan pul biberli tereyağı, sıcak ve soğuğu tek tabakta buluşturur.

Püf noktası: Et suyunu ekmeğe tek seferde değil, kepçe kepçe dökün ve her seferinde ekmeğin suyu emmesini bekleyin. Ekmek olarak bayat pide ya da kuru yufka en iyi sonucu verir. Yoğurdu oda sıcaklığında kullanın ve tereyağını servis anında dökün.`,
  },
  'malatya-icli-kofte': {
    tr: `Malatya köfte çeşitliliğiyle bilinen bir şehir; yöre mutfağında onlarca farklı köfte türünden söz edilir. İçli köfte bunların en zahmetli ama en ödüllendirici olanlarından biridir. İnce bulgurdan hazırlanan kabuk, cevizli ve kıymalı bir harcı sarar ve kızgın yağda altın rengine bürünür.

İyi bir içli köftenin sırrı, kabuğun ince ama sağlam olmasıdır. Bulgura bir miktar kıyma ve un eklenip uzun süre yoğrulması hamurun esnekliğini artırır; böylece köfte şekillendirilirken çatlamaz, kızarırken açılmaz.

Püf noktası: Hamuru şekillendirirken ellerinizi sık sık ıslatın. Kabuğu başparmağınızla döndürerek inceltin, ama dibini delmemeye dikkat edin. İç harcı tamamen soğuduktan sonra kullanın. Köfteleri kızartmadan önce birkaç dakika buzdolabında bekletirseniz şekillerini daha iyi korurlar.`,
  },
  'maras-yuksuk-corbasi': {
    tr: `Yüksük çorbası, Kahramanmaraş ve çevresinde pişirilen, adını içindeki küçük hamur parçalarının biçiminden alan yoğurtlu bir çorba. Parmak ucuyla tek tek şekillendirilen bu minik hamurlar dikiş yüksüğüne benzediği için bu adla anılır. Yapımı sabır ister ve çoğu zaman evde birkaç kişi bir araya gelerek hazırlanır.

Çorbanın tabanı et suyu ve yoğurttur. Yoğurdun ekşiliği, hamurun yumuşaklığı ve Maraş biberli tereyağı bir araya gelince hem doyurucu hem de ferah bir lezzet ortaya çıkar.

Püf noktası: Yoğurdu doğrudan kaynayan çorbaya eklemeyin; önce yumurtayla çırpıp sıcak suyla yavaş yavaş ılıtın, aksi halde kesilir. Yoğurt eklendikten sonra çorbayı hep aynı yönde karıştırın. Yüksükleri kurumadan haşlayın ve çorbayı fazla bekletmeyin; hamurlar suyu çekip şişer.`,
  },
  'artvin-misir-ekmegi': {
    tr: `Mısır ekmeği Karadeniz mutfağının temel taşı. Buğdayın yetişmesinin zor olduğu dik ve yağışlı yamaçlarda mısır, uzun zamandır bölgenin en önemli tahılıdır. Artvin'de mısır ekmeği; mıhlamanın, karalahana çorbasının ve hamsinin yanında sofraya konan günlük ekmektir.

Bu ekmek mayasızdır ve yalnızca mısır unu, su ve tuzla yapılır. Kaynar suyla haşlanan mısır unu yoğrulabilir bir hamura dönüşür. Sacda ya da döküm tavada pişen ekmeğin dışı sert ve hafif kızarık, içi ise yoğun ve hafif tatlıdır.

Püf noktası: Suyun mutlaka kaynar olması gerekir; ılık su mısır ununu bağlamaz, hamur dağılır. Hamuru ellerinizi ıslatarak şekillendirin. Sacı ya da tavayı önceden iyice ısıtın ve ekmeği altı sertleşmeden çevirmeyin. Sıcakken, üzerine tereyağı sürülerek yenir.`,
  },
  'adana-papara': {
    tr: `Papara, Güneydoğu Anadolu ve Çukurova mutfağında bayat ekmeği değerlendirmenin geleneksel yollarından biri. Haşlanmış kuzu etinin suyuyla ıslatılan ekmek, salçalı ve baharatlı tereyağıyla buluşur, üzerine de etler dizilir. Özellikle Kurban Bayramı sofralarında sıkça pişirilen bir yemektir.

Paparanın lezzeti, et suyunun kalitesinden ve ekmeğin bu suyu ne kadar iyi emdiğinden gelir. Kimyon ve pul biber yemeğe bölgenin baharatlı tadını, salça ise rengini ve derinliğini verir. Tirite benzese de yoğurt yerine salçalı bir tabanla hazırlanır.

Püf noktası: Kemikli et kullanın; kemik et suyuna lezzet ve kıvam verir. Ekmeği kalın dilimler halinde ve bayat kullanın, taze ekmek et suyunda hemen dağılır. Et suyunu ekmeğin üzerine azar azar ekleyin. Kızgın tereyağını servis anında gezdirin.`,
  },
  'kuzu-tandir': {
    tr: `Tandır, Anadolu'da toprağa gömülü kuyu fırınlarda saatlerce pişen etin genel adıdır. Afyon başta olmak üzere İç Anadolu'nun pek çok yerinde kuzu, bu yavaş pişirme sayesinde kemikten kendiliğinden ayrılacak kadar yumuşar. Evde tandır kuyusu olmasa da kapağı sıkıca kapatılmış bir güveç ve düşük fırın ısısı aynı etkiyi büyük ölçüde verir.

Bu tarifte kuzu kol, soğan yatağının üzerinde patates, havuç ve domatesle birlikte kendi buharında pişer. Sebzeler etin suyunu çeker; ayrı bir garnitüre gerek kalmaz.

Püf noktası: Folyoyu kabın kenarlarına iyice bastırın; buhar kaçarsa et kurur. Fırın ısısını yükseltip süreyi kısaltmaya çalışmayın, tandırın sırrı sabırdır. Folyoyu yalnızca son yarım saatte açın ve eti servis etmeden önce kendi suyunda birkaç dakika dinlendirin.`,
  },
  'cine-cokertme-kebabi': {
    tr: `Çökertme kebabı, Ege'nin güneyinde, Aydın ve Muğla çevresinde sevilen, katmanlı yapısıyla tanınan bir et yemeği. Tabağın en altında kibrit çöpü gibi ince kızartılmış patates, üzerinde sarımsaklı yoğurt, onun üstünde domatesle sotelenmiş ince et dilimleri ve en tepede pul biberli tereyağı bulunur.

Yemeğin keyfi, her çatalda çıtır patatesle yumuşak eti ve serin yoğurdu bir arada almaktan gelir. Bu yüzden katmanlar karıştırılmadan, hazırlanır hazırlanmaz sofraya konur.

Püf noktası: Patatesleri servise en yakın zamanda kızartın; bekleyen patates yoğurdun altında hemen yumuşar. Eti tavaya az az atın ve yüksek ateşte kısa sürede kavurun, kalabalık tavada et su salıp haşlanır. Yoğurdu oda sıcaklığında kullanın ki sıcak eti soğutmasın.`,
  },
  'malatya-kayisili-et': {
    tr: `Malatya, dünyanın en önemli kuru kayısı üretim merkezlerinden biri; kayısı bu şehirde yalnızca tatlıda değil, et yemeklerinde de kullanılır. Kayısılı et yahnisi, etin tuzlu lezzetiyle meyvenin tatlı ekşiliğini buluşturan, Anadolu'daki meyveli et yemekleri geleneğinin güzel bir örneğidir.

Tarçın ve yenibahar yemeğe hafif sıcak bir koku verir, salça ise sosa renk katar. Uzun süre kısık ateşte pişen kuzu eti yumuşarken kayısılar sosu hafifçe koyulaştırır ve parlak bir görünüm kazandırır.

Püf noktası: Kayısıları en başta eklemeyin; et neredeyse piştikten sonra eklenirse şekillerini korurlar. Kükürtsüz, koyu renkli gün kurusu kayısı daha yoğun bir aroma verir. Bademleri ayrı bir tavada kavurup servis anında serpin ki çıtırlığını kaybetmesin. Yanına sade pirinç pilavı çok yakışır.`,
  },
  'malatya-patlican-kebabi': {
    tr: `Malatya mutfağı köfte ve patlıcan yemekleriyle ünlüdür; patlıcan kebabı da bu iki sevgiyi bir araya getirir. Bu tarifte kalın patlıcan dilimlerinin üzerine baharatlı kuzu kıyma yerleştirilir ve hepsi domates ile biberle birlikte salçalı bir sosun içinde fırında pişer.

Pişerken kıymanın yağı patlıcana işler, patlıcan da sosu emerek ağızda dağılacak kadar yumuşar. Sonuç, bir tepside hazırlanan, kalabalık sofralar için pratik ve doyurucu bir yemektir.

Püf noktası: Patlıcanları tuzlu suda bekletmek acılığını alır ve daha az yağ çekmelerini sağlar; ardından iyice kurulayın. Fırına vermeden önce patlıcanları ön pişirme ile biraz yumuşatmak, dilimlerin kıymayla aynı anda pişmesini sağlar. Kıyma için hafif yağlı et seçin, yağsız kıyma fırında kurur. Bulgur pilavıyla servis edin.`,
  },
  'antalya-piyazi': {
    tr: `Antalya piyazı, Türkiye'nin dört bir yanında yapılan piyazdan tek bir malzemeyle ayrılır: tahin. Fasulye, tahin, sirke ve zeytinyağından oluşan kremamsı bir sosla harmanlanır. Antalya'da şiş köfteyle birlikte sofraya gelir ve bu ikili şehrin en tanınan lezzetleri arasında sayılır.

Haşlanmış yumurta ve siyah zeytin hem görünüşü zenginleştirir hem de tahinin yoğunluğunu dengeler. Soğanın acısı alınıp maydanozla birleşince piyaz tok tutan ama ferah bir mezeye dönüşür.

Püf noktası: Fasulyeyi ezilmeden, tanesi bütün kalacak şekilde haşlayın; dağılan fasulye sosla karışıp lapa olur. Tahin sosunu çırparken kıvamı koyu gelirse birkaç kaşık su ekleyin, kremamsı ve akışkan olmalı. Piyazı buzdolabından çıkarıp oda sıcaklığında servis edin, tahinin aroması böyle daha iyi ortaya çıkar.`,
  },
  'erdek-midye-dolmasi': {
    tr: `Midye dolması, Marmara ve Ege kıyılarının, özellikle de İstanbul sokaklarının simgesi haline gelmiş bir lezzet. Marmara'nın güney kıyısındaki Erdek ve Kapıdağ Yarımadası çevresinde de deniz ürünleri mutfağın önemli bir parçasıdır. Midyenin içi baharatlı, çam fıstıklı ve kuş üzümlü bir pirinç harcıyla doldurulup buharda pişirilir.

İyi bir midye dolmasında pirinç tane tane, harç hafif tatlı ve baharatlıdır; tarçın ve yenibahar bu tadın imzasıdır. Limon sıkılarak, kabuğun kapağı kaşık gibi kullanılarak yenir.

Püf noktası: Kabuğu sıkıca kapalı, ağır ve canlı midyeleri seçin; kabuğu açık kalanları kullanmayın. İç harcı yarı pişmiş bırakın, pirinç midyenin içinde pişmeye devam eder. Midyeleri tencereye sık dizin ki pişerken açılmasınlar. Soğuyunca daha lezzetli olur.`,
  },
  'adiyaman-lebeniye': {
    tr: `Lebeniye, adını Arapçada yoğurt anlamına gelen "leben" kelimesinden alan, Gaziantep mutfağının yoğurtlu çorbalarından biri. Antep'te yoğurt pek çok sıcak yemeğin temelidir ve lebeniye de kuzu eti, nohut ve pirinçle zenginleştirilmiş doyurucu bir çorba olarak sofraya gelir.

Çorbanın lezzeti, yoğurdun ekşiliği ile et suyunun derinliği arasındaki dengeden doğar. Üzerine gezdirilen naneli ve pul biberli tereyağı hem renk hem koku katar.

Püf noktası: Yoğurdu yumurtayla iyice çırpın; yumurta, yoğurdun ısınırken kesilmesini önler. Karışımı tencereye eklerken ateşi kısın ve hep aynı yöne karıştırın. Yoğurt eklendikten sonra çorbayı fazla kaynatmayın. Eti önceden iyice yumuşatın, çünkü yoğurt eklendikten sonra pişme süresi kısadır.`,
  },
  'adiyaman-kaburga-dolmasi': {
    tr: `Kaburga dolması, Güneydoğu Anadolu'nun bayram ve misafir sofralarının baş tacı. Adıyaman, Diyarbakır ve Mardin çevresinde kuzunun kaburgası kasaba cep şeklinde açtırılır, içine baharatlı pirinç ve kıyma harcı doldurulup ağzı dikilir. Önce haşlanan, ardından fırında kızartılan kaburga, uzun ve özenli bir hazırlığın ürünüdür.

Pişerken pirinç, kaburganın yağını ve et suyunu emer; çam fıstığı, tarçın ve yenibahar harca hafif bir tatlılık ve koku verir. Dilimlenip sofraya getirildiğinde hem et hem pilav bir arada sunulmuş olur.

Püf noktası: Harcı cebe sıkıştırmadan, gevşekçe doldurun; pirinç pişerken şişer ve sıkı doldurulan kaburga patlayabilir. Ağzını sağlam bir iple dikin. Haşlama suyunu kısık ateşte tutun. Fırında üzerini kızartırken kurumasın diye arada kendi suyuyla yağlayın.`,
  },
  'mardin-oruk': {
    tr: `Oruk, Mardin ve çevresinde yapılan, içli köftenin uzun ve oval bir türü. Bulgur ve az miktarda kıymayla hazırlanan ince bir kabuğun içine cevizli, baharatlı kıyma harcı doldurulur. Mardin'de orukun hem kızartılan hem de fırında pişirilen çeşitleri vardır; bu tarif kızartma usulüdür.

Orukun başarısı kabuğun inceliğine bağlıdır. İyi yoğrulmuş hamur, ince açıldığı halde kızarırken çatlamaz; dışı çıtır, içi sulu kalır. Süzme yoğurt ve taze domatesle birlikte sıcak servis edilir.

Püf noktası: Bulgur hamurunu sabırla, en az on dakika yoğurun; ele yapışmayan, esnek bir kıvam gelmeli. Şekillendirirken ellerinizi sık sık ıslatın. İç harcın tamamen soğumuş olması gerekir; sıcak harç kabuğu yumuşatır. Yağın sıcaklığını koruyun, soğuk yağda kızartılan oruk yağ çeker.`,
  },
  'maras-zerde': {
    tr: `Zerde, adını Farsçada sarı anlamına gelen "zerd" kelimesinden alan, safranla renklendirilmiş bir pirinç tatlısı. Osmanlı mutfağından bu yana düğün, mevlit ve özel günlerin tatlısı olarak Anadolu'nun birçok yerinde yapılır; Kahramanmaraş'ta da sofralarda yer bulur.

Zerdeyi farklı kılan altın sarısı rengi ve gül suyunun hafif kokusudur. Üzerine serpilen çam fıstığı, nar taneleri ve tarçın hem görüntüyü zenginleştirir hem de tatlıya doku katar. Soğuk servis edilir, bu yüzden yaz aylarında da hafif bir seçenektir.

Püf noktası: Safranı önceden sıcak suda bekletip rengini iyice çıkarın; bu tarifte renk hem safrandan hem de az miktarda zerdeçaldan gelir. Nişastalı suyu ince bir akışla ve sürekli karıştırarak ekleyin, yoksa topaklanır. Gül suyunu fazla kaçırmayın, kokusu çabuk baskın gelir.`,
  },
  'afyon-sucuklu-kavurma': {
    tr: `Afyonkarahisar sucuğu, coğrafi işaretle tescilli, Türkiye'nin en bilinen sucuklarından biri. Afyon'da kahvaltı çoğu zaman tavada pişen sucuk ve yumurtayla başlar. Bu tarifte sucuğa biber ve domates eklenerek daha doyurucu, sofrayı paylaşmaya uygun bir kahvaltılık hazırlanır.

Sucuğun bıraktığı baharatlı yağ, biber ve domatesin pişmesi için yeterlidir; yumurtalar da bu yağın tadını alır. Tavadan doğrudan, taze ekmekle yenmesi geleneğin bir parçasıdır.

Püf noktası: Sucuğu yağsız, kuru tavada ve orta ateşte pişirin; yüksek ateşte dışı yanar, yağını bırakmaz. Sucuk dilimlerini kâğıt gibi ince kesmeyin, aksi halde kurur. Domatesi kısa süre pişirin ki suyunu tamamen kaybetmesin. Yumurtaları ekledikten sonra ocağı kısın, kenarları kurumadan servis edin.`,
  },
  'aydin-incir-dolmasi': {
    tr: `Aydın, Büyük Menderes ovasında yetişen incirleriyle tanınır; bölgenin kurutulmuş incirleri "Sultani" adıyla bilinir ve Türkiye'nin kuru incir ihracatında önemli bir yer tutar. Cevizli incir dolması, bu incirleri şekerli ve baharatlı bir şerbette pişirerek yapılan sade ama etkileyici bir tatlı.

İncirin doğal tatlılığı, cevizin hafif buruk tadıyla dengelenir; tarçın ve karanfil şerbete sıcak bir koku verir. Kaymak ya da dondurmayla servis edildiğinde hem hafif hem de şık bir son tatlı olur.

Püf noktası: İncirleri tamamen ikiye bölmeyin, yarıya kadar kesin ki ceviz içeride kalsın. Pişirme sırasında kısık ateşi koruyun; incir kaynayan şerbette dağılabilir. Şerbeti fazla koyulaştırmayın, soğurken zaten kıvam alır. Tatlıyı bir gece dinlendirirseniz şerbet incirin içine daha iyi işler.`,
  },
  'artvin-karalahana-sarmasi': {
    tr: `Karalahana, Doğu Karadeniz mutfağının temel sebzesidir; çorbası, kavurması ve sarması yapılır. Artvin usulü karalahana sarmasını diğerlerinden ayıran şey, harca eklenen mısır unudur. Mısır unu iç harca hafif bir tatlılık ve sıkı bir kıvam verir, Karadeniz mutfağındaki mısır sevgisini de yansıtır.

Kıyma, pirinç ve mısır ununun birleştiği harç, karalahananın hafif acımsı tadıyla iyi bir denge kurar. Bölgede düğün ve misafir sofralarında sıkça yer alır, sarımsaklı yoğurtla servis edilir.

Püf noktası: Yaprakları kısa süre haşlayıp hemen soğuk suya alın; fazla haşlanan yaprak sararken yırtılır. Kalın orta damarları kesip inceltin. Sarmaları tencereye sık dizin ve üzerine ters bir tabak kapatın ki pişerken açılmasınlar. Tencerenin dibine serilen lahana parçaları sarmaların yanmasını önler.`,
  },
  'adiyaman-shirden': {
    tr: `Şirden dolması, Konya ve İç Anadolu'nun sakatat geleneğinin bilinen yemeklerinden biri. Şirden, koyunun dördüncü midesidir. İyice temizlendikten sonra içine pirinç ve kıymalı, baharatlı bir harç doldurulur, ağzı dikilir ve uzun süre haşlanır. Konya'da özellikle soğuk kış günlerinde ve kurban zamanında sevilerek yenir.

Pişerken pirinç, şirdenin içinde et suyunu emerek yumuşak ve lezzetli bir dolguya dönüşür. Dilimlenerek yoğurt ve pul biberli tereyağıyla servis edilir.

Püf noktası: Şirdenin temizliği yemeğin kalitesini belirler. Sirkeli ve tuzlu suyla defalarca yıkayın, iç yüzeyini iyice kazıyın. Harcı şirdenin yalnızca üçte ikisine doldurun; pirinç şişer ve fazla dolu şirden haşlanırken patlar. Kaynamaya başladığında köpüğünü alın ve sonra ateşi kısın.`,
  },
  'konya-bamya-corbasi': {
    tr: `Konya bamya çorbası, şehrin düğün ve davet sofralarının geleneksel başlangıcıdır. Konya'da bu çorba için küçük taneli bamyalar ipe dizilip kurutulur, kışın et suyunda pişirilerek ekşili bir çorbaya dönüştürülür.

Limonun ekşiliği, kuzu et suyunun yoğun lezzeti ve bamyanın kendine özgü dokusu bu çorbanın karakterini oluşturur. Konya'da düğün yemekleri sırayla gelir ve bamya çorbası çoğu zaman bu sıralamanın ilk tabağıdır.

Püf noktası: Kurutulmuş bamyayı bir gece önceden ıslatın. Limon suyunu pişirmenin sonuna doğru ekleyin; limon hem tadı tamamlar hem de bamyanın salyasını azaltır. Ev yapımı kemik suyu kullanırsanız çorbanın lezzeti belirgin şekilde artar. Bamyaları pişirirken çok sık karıştırmayın, dağılabilirler.`,
  },
  'bitlis-tandir-eti': {
    tr: `Bitlis, kuzu etinin tandır kuyusunda pişirildiği büryan geleneğiyle tanınır. Geleneksel yöntemde kuzu, toprağa gömülü tandırın içine asılır, ağzı kapatılır ve saatlerce kendi buharında pişer. Bitlis'te tandır eti düğünlerin ve bayramların vazgeçilmez yemeğidir.

Bu tarif, aynı yavaş pişirme mantığını ev fırınına uyarlar. Kimyon ve kekikle ovulan kuzu, soğan ve defne yaprağı yatağında, sıkıca kapatılmış bir kapta saatlerce pişer ve kemikten kendiliğinden ayrılacak kadar yumuşar.

Püf noktası: Baharatları ete pişirmeden birkaç saat önce sürerseniz lezzet daha derine işler. Kabı folyoyla sıkıca kapatın, buhar kaçmamalı. Düşük ısıda sabırla pişirin; yüksek ısı eti kurutur. Pişen eti kendi suyuyla birlikte, sıcak lavaş ya da pideyle servis edin.`,
  },
  'beypazari-havuclu-corba': {
    tr: `Ankara'nın Beypazarı ilçesi, Türkiye'nin havuç üretiminde önemli bir paya sahiptir ve havuç ilçenin simgelerinden biri haline gelmiştir. Beypazarı'nda havuç; reçelden lokuma, çorbadan tatlıya kadar pek çok lezzette kullanılır. Havuçlu çorba da bu bereketin en sade ve sıcak örneğidir.

Havucun doğal tatlılığı tereyağında kavrulan soğanla birleşir, süt ise çorbaya kadifemsi bir kıvam verir. Zerdeçal hem rengi canlandırır hem de hafif bir aroma katar.

Püf noktası: Havuçları tamamen yumuşayana kadar pişirin; az pişen havuç blenderdan geçse de lifli kalır. Sütü çorba pürüzsüz hale geldikten sonra ekleyin ve kaynatmadan ısıtın, aksi halde kesilebilir. Kıvamı koyu gelirse birkaç kaşık sıcak et suyuyla açın. Üzerine taze maydanoz serperek servis edin.`,
  },
  'karamursel-keskegi': {
    tr: `Keşkek, dövme buğday ve etin saatlerce birlikte pişirilip dövülmesiyle yapılan, Anadolu'nun en köklü düğün yemeklerinden biri. Keşkek geleneği 2011'de UNESCO İnsanlığın Somut Olmayan Kültürel Mirası Listesi'ne alınmıştır. Marmara'da, Karamürsel ve çevresinde de keşkek düğün ve hayır yemeklerinde kazanlarda pişirilir.

Keşkeğin özelliği kıvamıdır: buğday ve et o kadar uzun pişirilir ve dövülür ki taneler kaybolur, ortaya kaşıktan uzayan, pürüzsüz bir lapa çıkar. Üzerine gezdirilen pul biberli tereyağı bu sade yemeğe renk ve koku verir.

Püf noktası: Dövme buğdayı mutlaka bir gece önceden ıslatın. Eti tamamen dağılana kadar pişirin. Dövme aşamasında sabırlı olun; kaşığı kaldırdığınızda keşkek ip gibi uzuyorsa kıvamı tamamdır. Keşkek bekledikçe katılaşır, pişer pişmez sıcak servis edin.`,
  },
  'konya-dugun-pilavi': {
    tr: `Konya'da düğün sofrası belirli bir sırayla kurulur ve etli, nohutlu pilav bu sofranın vazgeçilmez yemeklerindendir. Kuzu eti ve nohutla zenginleşen, safranla hafif sarıya boyanan bu pilav kazanlarda pişirilip kalabalık misafirlere ikram edilir.

Tarçın ve yenibahar pilava hafif sıcak bir koku verir, en üste serpilen kavrulmuş bademler ise hem görünüşü güzelleştirir hem de çıtırlık katar. Et suyunda pişen pirinç tane tane ve parlak olmalıdır.

Püf noktası: Pirinci suda bekletip nişastasını iyice yıkayın; tane tane pilavın sırrı budur. Et suyunu sıcak ekleyin, soğuk su pirinci yapıştırır. Pilav pişince kapağın altına temiz bir bez koyup dinlendirin; bez buharı emer ve pirinç tanelerini açar. Bademleri ayrı bir tavada kavurup servis anında ekleyin.`,
  },
  'malatya-eksili-kofte-corbasi': {
    tr: `Malatya, köfte çeşitlerinin bolluğuyla bilinen bir şehir ve bu köftelerin önemli bir kısmı bulgurla yapılır. Ekşili köfte çorbası da bulgurlu küçük köftelerin domatesli et suyunda pişirildiği, limon ve nar ekşisiyle tatlandırılan bir kış çorbasıdır.

Bulgur, kıyma ve soğandan yoğrulan minik köfteler çorbanın suyunu çekerek yumuşar. Limon ile nar ekşisi birlikte çorbaya Doğu ve Güneydoğu Anadolu mutfağının sevilen ekşi-tuzlu dengesini verir. Üzerine nane ve pul biberli tereyağı gezdirilir.

Püf noktası: Köfte hamurunu iyice yoğurun ki pişerken dağılmasın. Köfteleri küçük yapın; büyük köftenin ortası geç pişer. Köfteleri suya kaynarken ekleyin ve sonra ateşi kısın. Ekşiyi pişirmenin sonunda ekleyip tadına bakarak ayarlayın, çünkü nar ekşilerinin ekşiliği birbirinden farklıdır.`,
  },
  'edirne-badem-ezmesi': {
    tr: `Badem ezmesi, Edirne'nin Osmanlı döneminden bu yana süregelen şekerleme geleneğinin en bilinen ürünü. Öğütülmüş badem, şeker şerbeti ve gül suyuyla pişirilip yoğrulan bu ezme, Edirne'de meyve ve çiçek biçimlerinde şekillendirilip hediye kutularında sunulur. Şehre gelenlerin dönüşte yanında götürdüğü başlıca hediyelerden biridir.

Badem ezmesinin kalitesi doğrudan bademe bağlıdır. Yağlı ve aromalı bademler ezmeye hem yumuşak bir doku hem de kendine özgü bir tat verir; gül suyu ise bu tadı hafifçe tamamlar.

Püf noktası: Bademi haşlayıp kabuğunu soyduktan sonra iyice kurulayın; nemli badem öğütülürken hamurlaşır. Şerbetin kıvamı her şeyi belirler, bu yüzden bir şeker termometresi kullanmak işinizi çok kolaylaştırır. Ezmeyi yoğururken pudra şekerini azar azar ekleyin. Hava almayan bir kutuda saklarsanız uzun süre taze kalır.`,
  },
  'diyarbakir-ciger-kebabi': {
    tr: `Ciğer kebabı, Diyarbakır'ın sokak lezzetlerinin başında gelir. Şehirde ciğer yalnızca öğle ve akşam değil, sabahın erken saatlerinde kahvaltı olarak da yenir. Küçük parçalar halinde kesilen kuzu ciğeri, aralarına kuyruk yağı dizilerek şişe geçirilir ve közde birkaç dakikada pişirilir.

Bu kebabın sırrı kuyruk yağıdır: közde eriyen yağ ciğere işler, onu hem yumuşatır hem de lezzetlendirir. Pişen şişler lavaşa alınır, yanında sumaklı soğan ve maydanozla servis edilir. Hafifçe ezilmiş kişniş tanesi ise bu tarife kendine özgü bir koku katar.

Püf noktası: Ciğerin taze olması şarttır. Közün çok kuvvetli ve şişlerin ateşe yakın olması gerekir; ciğer kısa sürede pişmeli, uzun pişen ciğer sertleşir. Tuzu pişirmeden hemen önce ya da pişirdikten sonra ekleyin. Ciğer kebabı beklemez, şişten alınır alınmaz yenmelidir.`,
  },
  'erzurum-ketesi': {
    tr: `Kete, Doğu Anadolu ve Kafkasya mutfağının sevilen mayalı çöreği. Erzurum'da ketenin en bilinen hali, içine tereyağında kavrulmuş un ve şekerden yapılan "iç" konan sürümüdür. Hamurun içine kapatılan bu iç, fırında pişerken hafifçe karamelleşir ve kete her ısırıkta yumuşak hamurla tatlı, kumsu bir dolguyu bir arada sunar.

Erzurum'da kete, kahvaltıda ve çay saatinde ikram edilen, misafir sofralarının vazgeçilmez hamur işlerindendir. Uzun süre bayatlamadığı için yolculuklarda da yanınıza alabileceğiniz bir çörektir.

Püf noktası: Unu tereyağında kısık ateşte, sürekli karıştırarak kavurun; acele ederseniz dibi yanar ve iç acılaşır. Kavrulan unun rengi açık kahve olmalı. İç harcını hamura koymadan önce soğutun. Hamuru kapatıp tekrar açarken nazik olun, aksi halde iç dışarı taşar.`,
  },
  'gaziantep-sobiyet': {
    tr: `Şöbiyet, Gaziantep'in baklava ustalarının ustalığını gösteren şerbetli tatlılardan biri. İnce yufkaların arasına kaymak ve bol Antep fıstığı konarak hazırlanır, tereyağıyla fırında pişirilip soğuk şerbetle tatlandırılır. Antep'te baklava ile birlikte en çok tercih edilen tatlılar arasındadır.

Şöbiyeti baklavadan ayıran, içindeki kaymaktır. Kaymak fırında yumuşak bir kıvam alır ve fıstıkla birleşerek her lokmada kremamsı bir dolgu oluşturur. Bu yüzden şöbiyet baklavaya göre daha yumuşak ve doyurucudur.

Püf noktası: Yufkaların arasına tereyağını cömertçe sürün, kuru kalan katlar kızarmaz. Kaymağı çok kalın sürmeyin; pişerken kenarlardan taşabilir. Şerbetin soğuk, tatlının sıcak olması gerekir, böylece yufka çıtırlığını korur. Şöbiyeti servis etmeden önce şerbetini iyice çekmesi için bekletin.`,
  },
  'gaziantep-bulbuluvasi': {
    tr: `Bülbül yuvası, adını yuvaya benzeyen görünüşünden alan, Gaziantep'in fıstıklı şerbetli tatlılarından biri. İnce yufka bir çubuğa sarılıp büzülerek halka biçimi verilir, ortasındaki çukura bol miktarda Antep fıstığı konur. Tereyağıyla fırında pişirilir ve soğuk şerbetle tatlandırılır.

Bu tatlının görselliği kadar dokusu da önemlidir. Büzülen yufka katmanları fırında çıtırlaşır, ortadaki fıstık ise şerbetle birleşerek yoğun bir lezzet oluşturur. Antep'te bayram ve özel gün sofralarında baklavanın yanında sıkça yer alır.

Püf noktası: Yufkayı çubuğa sararken çok sıkmayın; büzme sırasında yırtılabilir. Fıstığı çok ince çekmek yerine iri dövün, böylece doku daha belirgin olur. Tereyağını her yuvaya iyice sürün ki katlar eşit kızarsın. Şerbeti tatlı fırından çıkar çıkmaz, sıcakken dökün.`,
  },
  'hatay-muhammara': {
    tr: `Muhammara, Hatay mutfağının en sevilen mezelerinden biri ve Halep mutfağıyla ortak bir mirasın parçası. Adı Arapçada "kızartılmış, kızıla boyanmış" anlamına gelen bir kelimeden gelir; rengini de közlenmiş kırmızı biberden alır. Ceviz, nar ekşisi, sarımsak ve baharatlarla birleşen biber, yoğun ve hafif ekşi bir ezmeye dönüşür.

Hatay sofralarında muhammara, humus ve diğer mezelerle birlikte servis edilir ve ekmekle yenir. Közlenmiş biberin dumanlı tadı, cevizin dolgunluğu ve nar ekşisinin ekşiliği bu mezenin dengesini kurar.

Püf noktası: Biberleri kabukları kararana kadar közleyin ve bir kapta ya da poşette dinlendirin; kabukları kolayca soyulur. Cevizi hafifçe kavurursanız aroması belirginleşir. Mutfak robotunda tamamen pürüzsüz bir ezme yerine hafif dokulu bir kıvam bırakmak daha geleneksel bir sonuç verir.`,
  },
  'hatay-haytali': {
    tr: `Haytalı, Adana, Mersin ve Hatay'da yaz aylarının serinletici sokak tatlısı. Nişastayla pişirilip soğutulan, gül suyu kokulu muhallebi küçük parçalar halinde kesilir, dövülmüş buzun üzerine konur ve tatlandırılarak servis edilir. Sıcak Çukurova ve Hatay yazlarında özellikle akşamüstleri ve Ramazan iftarlarından sonra sevilerek yenir.

Haytalının özelliği hafifliğidir: yumurta ve süt içermediği için ağır bir tatlı değildir. Gül suyunun kokusu, buzun serinliği ve üzerine eklenen tatlandırıcının uyumu basit malzemelerden etkileyici bir tatlı ortaya çıkarır.

Püf noktası: Nişastayı mutlaka soğuk suyla açın, sıcak suya doğrudan eklenen nişasta topaklanır. Karışım saydamlaşıp koyulaşana kadar pişirin; az pişen nişasta un tadı verir. Kalıbı soğuk suyla ıslatırsanız soğuyan muhallebi kolay çıkar. Buzu servis anında ekleyin.`,
  },
  'isparta-gul-receli': {
    tr: `Isparta, yağ gülünün Türkiye'deki merkezi ve dünyanın en önemli gül yağı üretim bölgelerinden biri. Mayıs ve haziran aylarında gül bahçelerinde hasat başlar; çiçekler kokusunu en çok koruduğu sabahın erken saatlerinde toplanır. Bu güllerin yaprakları gül yağı ve gül suyunun yanı sıra kendine özgü kokusuyla gül reçeline de dönüşür.

Gül reçeli, hem tadı hem de kokusuyla diğer reçellerden ayrılır. Yaprakların şekerle bir gece bekletilmesi kokuyu ve rengi açığa çıkarır; limon ise hem rengi canlı tutar hem de tatlılığı dengeler.

Püf noktası: Yalnızca ilaçlanmamış, kokulu gül yapraklarını kullanın. Yaprakların beyaz dip kısımlarını mutlaka kesin, acılık verir. Şekerle ovarken yaprakları ezmeden, hafifçe bastırın. Gül suyunu ocaktan aldıktan sonra ekleyin; pişirilirse kokusu uçar.`,
  },
  'mersin-cezerye': {
    tr: `Cezerye, Mersin'in simgesi haline gelmiş, havuçla yapılan bir şekerleme. Adını Arapçada havuç anlamına gelen "cezer" kelimesinden alır. Havuç şekerle uzun süre pişirilerek koyulaştırılır, içine ceviz eklenir, kesilen parçalar da hindistancevizine bulanır. Mersin'e gelenlerin dönüşte yanında götürdüğü başlıca hediyelerdendir.

Cezeryenin tadı havucun doğal tatlılığından ve uzun pişirme sırasında oluşan hafif karamel notasından gelir. Ceviz doku katar, hindistancevizi ise parçaların birbirine yapışmasını önler.

Püf noktası: Havuçlar suyunu tamamen çekene kadar sabırla karıştırarak pişirin; erken alınan karışım kesildiğinde dağılır. Tencerenin dibi kolay yandığı için ateşi kısık tutun. Karışımı kalıba döküp iyice soğuyup sertleşmesini bekleyin, ondan sonra kesin. Kuru ve serin bir yerde saklayın.`,
  },
  'izmir-kumru': {
    tr: `Kumru, İzmir'in ve özellikle Çeşme'nin simgesi haline gelmiş sıcak bir sandviç. Ona adını veren, kendine özgü oval ve susamlı kumru ekmeğidir; bu ekmek geleneksel olarak nohut mayasıyla yapılır. Ekmeğin içine kaşar peyniri, sucuk, salam ya da sosis ve domates konur, tost makinesinde bastırılarak pişirilir.

Kumru ayaküstü bir atıştırmalık gibi görünse de İzmir'de neredeyse bir kültürdür. Çeşme'ye yolu düşen birçok kişi, plaj dönüşü kumrucularda mola verir.

Püf noktası: Ekmeğin içini hafifçe yağlayıp sıcak sac ya da tost makinesinde bastırarak pişirin; dışı çıtırlaşırken peynir erimeli. Sucuk ve sosisi önceden ızgarada kısa süre pişirmek lezzetini artırır. Kumru ekmeği bulamazsanız sıkı dokulu, susamlı bir sandviç ekmeği en yakın sonucu verir.`,
  },
  'izmir-gevrek': {
    tr: `İzmir'de simide simit değil, gevrek denir. İzmir gevreği İstanbul simidine göre genellikle daha ince, daha çıtır ve daha bol susamlıdır. Sabah erken saatlerde fırından çıkan gevrek, boyoz ve haşlanmış yumurtayla birlikte İzmir'in ayaküstü kahvaltısının vazgeçilmez parçasıdır.

Gevreğin rengini ve hafif tatlı kabuğunu, susama bulanmadan önce batırıldığı sulandırılmış pekmez verir. Fırında yüksek ısıda pişen gevrek kızıl bir renk alır ve dışı çıtır çıtır olur.

Püf noktası: Hamuru iyi yoğurun ve dinlendirin; esnek hamur ince ve uzun şekilde açılabilir. Halkaları büktükten sonra pekmezli suya kısa süre batırın, fazlasını süzün. Susamı bol kullanın ve her tarafı kaplayın. Fırını iyice ısıtın; düşük ısıda pişen gevrek çıtırlaşmaz, yumuşak kalır.`,
  },
  'nevsehir-testi-kebabi': {
    tr: `Testi kebabı, Kapadokya'nın en tanınan yemeği. Et ve sebzeler toprak bir testinin içine yerleştirilir, testinin ağzı kapatılır ve saatlerce fırında pişirilir. Pişen testi sofrada kırılarak açılır ve bu gösteri yemeğin bir parçası haline gelir. Kızılırmak'ın kiliyle yapılan çömleklerle ünlü Avanos, bu geleneğin bölgedeki köklerini de hatırlatır.

Kapalı testide pişen et, sebzelerin ve kendi suyunun içinde yavaş yavaş yumuşar. Buhar dışarı çıkamadığı için tüm aroma testinin içinde kalır.

Püf noktası: Testiyi kullanmadan önce suda bekletin; ıslak toprak kap fırında çatlamaya karşı daha dayanıklıdır. Testiyi soğuk fırına koyup fırınla birlikte ısıtın, ani ısı değişimi testiyi çatlatabilir. Ağzını hamur ya da folyoyla iyice kapatın. Testiyi kırarken bir bezle tutun ve parçalara dikkat edin.`,
  },
  'buryan-kebabi-siirt': {
    tr: `Büryan, Siirt ve Bitlis'in en ünlü kuzu yemeği. Geleneksel yöntemde kuzu, toprağa açılmış derin tandır kuyusuna asılır, kuyunun ağzı kapatılır ve et saatlerce kendi buharında pişer. Siirt'te büryan çoğu zaman sabahın erken saatlerinde, tandırdan yeni çıkmışken yenir.

Uzun ve yavaş pişirme, etin bağ dokusunu eritir ve kuzu kemikten kendiliğinden ayrılacak kadar yumuşar. Bu tarif, aynı etkiyi ev fırınında, sıkıca kapatılmış bir güveçte düşük ısıyla uzun süre pişirerek yakalar.

Püf noktası: Eti pişirmeden önce baharatla ovup bir süre dinlendirin. Güveci folyoyla ve kapağıyla sıkıca kapatın; buhar kaçarsa et kurur. Isıyı düşük tutup sabırlı olun. Son yarım saatte kapağı açıp ısıyı yükseltmek etin üstüne renk verir. Etin kendi suyunu lavaşa dökerek servis edin.`,
  },
  'rize-laz-boregi': {
    tr: `Laz böreği, adına rağmen tuzlu değil tatlı bir börek: ince yufka katmanlarının arasına muhallebi konarak yapılan, Rize ve Doğu Karadeniz'in sevilen tatlısıdır. Fırında tereyağıyla kızaran yufkalar dışta çıtır bir kabuk oluştururken içerideki muhallebi yumuşak ve kremamsı kalır.

Laz böreğinin özelliği, sütlü tatlı ile hamur işini tek bir tepside birleştirmesidir. Bazı tariflerde üzerine şerbet dökülür; bu tarifte ise şerbet yerine tarçınla servis edilir, böylece daha hafif bir tat elde edilir.

Püf noktası: Muhallebiyi yufkaya yaymadan önce tamamen soğutun; sıcak muhallebi yufkayı ıslatıp hamurlaştırır. Yumurta sarılarını muhallebiye eklerken önce biraz sıcak muhallebiyle ılıtın, yoksa pişip topaklanır. Yufkaların arasına tereyağını eksik etmeyin. Dilimlemeden önce böreği biraz dinlendirin.`,
  },
  'kastamonu-banduma': {
    tr: `Banduma, Kastamonu ve çevresinde pişirilen, ekmeği et suyuyla buluşturan bir sofra yemeği. Bayat ekmek, haşlanmış etin suyuyla ıslatılır, üzerine salçalı ve domatesli bir sosla kavrulmuş et yayılır. Tiride benzeyen bu yemek, ekmeği israf etmeme anlayışından doğmuş köklü bir Anadolu geleneğini yansıtır.

Banduma'nın lezzeti, et suyunun kalitesinden ve ekmeğin bu suyu ne kadar iyi emdiğinden gelir. Naneli, pul biberli tereyağı yemeğe renk ve koku katar, yanında servis edilen soğuk yoğurt ise sıcak tabağı dengeler.

Püf noktası: Kemikli et kullanın; et suyuna lezzet ve kıvam kemikten gelir. Ekmeği bayat kullanın, taze ekmek et suyunda hemen dağılır. Et suyunu ekmeğin üzerine azar azar dökün, ekmek ıslanmalı ama çamurlaşmamalı. Tereyağını servis anında gezdirin ve yemeği bekletmeden sofraya getirin.`,
  },
  'samsun-nokul': {
    tr: `Nokul, Samsun, Amasya ve Tokat çevresinde sevilen, cevizli ve tarçınlı iç harçla doldurulan mayalı bir hamur işi. Hamur ince açılır, üzerine tereyağı sürülüp ceviz serpilir, rulo yapılıp dilimlenerek fırında pişirilir. Kahvaltıda ve çay saatinde ikram edilir.

Nokulun tadı, cevizin dolgunluğu ile tarçının sıcak kokusundan gelir. Dilimlerin kesik yüzleri yukarı bakacak şekilde pişmesi, içteki spiral dokunun görünmesini sağlar ve nokula kendine özgü görüntüsünü verir.

Püf noktası: Hamuru mayalandırırken sıcak ve hava akımı olmayan bir yerde bekletin. Ruloyu sıkı sarın ki dilimler pişerken açılmasın. Ruloyu kesmek için keskin bir bıçak kullanın ve bastırmadan kesin. Dilimlere tekrar dinlenme süresi verin; ikinci mayalanma nokulu daha yumuşak yapar.`,
  },
  'giresun-findikli-sutlac': {
    tr: `Giresun, dünyaca ünlü fındığının yetiştiği şehir; fındık burada tatlıdan yemeğe pek çok tarifte kullanılır. Fındıklı sütlaç, klasik fırın sütlacına kavrulmuş Giresun fındığı eklenerek hazırlanan, Karadeniz'in hafif ve sevilen tatlılarından biri.

Fındık hem sütlacın içine karışarak tatlıya aroma verir hem de üzerine serpildiğinde çıtır bir doku katar. Fırında kızarmış üst katman, sütlacın klasik görünümünü ve hafif karamelimsi tadını tamamlar.

Püf noktası: Fındığı ekleme öncesinde hafifçe kavurun; çiğ fındık aynı aromayı vermez. Pirinci önce iyice pişirin, sütün içinde tam yumuşamayan pirinç sert kalır. Nişastayı soğuk suyla eritip ekleyin ve dibi tutmasın diye sürekli karıştırın. Fırında yalnızca üst ısıyı kullanın ve kaseleri yakından takip edin.`,
  },
  'urfa-kebabi': {
    tr: `Urfa kebabı, adını aldığı şehrin kebap kültürünün temsilcisi. Kıyma ve kuyruk yağı isot, sarımsak ve kimyonla yoğrulup yassı şişlere sarılır ve közde pişirilir. Adana kebabına benzese de daha az acıdır ve karakterini Urfa'nın kendine özgü biberi isottan alır.

İsot, kırmızı biberin gündüz güneşte kurutulup gece örtülerek "terletilmesiyle" elde edilir. Bu işlem bibere koyu, neredeyse siyaha çalan bir renk ve dumanlı, hafif tatlı bir aroma verir. Urfa kebabını acıdan çok bu aromayla tanırsınız.

Püf noktası: Kıyma harcını uzun süre, yapışkan bir kıvam alana kadar yoğurun; iyi yoğrulmayan harç şişten düşer. Harcı pişirmeden önce soğukta dinlendirin. Şişlere geçirirken ellerinizi ıslatın. Közün alevsiz olması gerekir. Kebabı közlenmiş domates, biber ve lavaşla servis edin.`,
  },
  'trabzon-kuymak': {
    tr: `Kuymak, Trabzon başta olmak üzere Doğu Karadeniz'in kahvaltı sofralarının yıldızı. Bölgenin bazı yerlerinde mıhlama olarak da bilinir. Mısır unu tereyağında pişirilir, içine eriyip uzayan bir peynir eklenir ve bakır sahanda, sıcacık sofraya getirilir.

Kuymağın lezzeti, kullanılan malzemenin kalitesinden gelir: taze ve kokulu Karadeniz tereyağı, ince öğütülmüş mısır unu ve eridiğinde ipeksi bir şekilde uzayan kolot peyniri. Ekmekle ya da kaşıkla, ortak sahandan yenmesi de geleneğin bir parçasıdır.

Püf noktası: Mısır ununu suya azar azar ve sürekli karıştırarak ekleyin, yoksa topaklanır. Tereyağından tasarruf etmeyin; kuymağın kıvamını ve tadını yağ belirler. Peyniri en son ekleyin ve uzayana kadar karıştırın. Kuymak soğudukça katılaşır, bu yüzden pişer pişmez servis edin.`,
  },
  'van-kahvaltisi': {
    tr: `Van kahvaltısı, Türkiye'nin en ünlü kahvaltı sofralarından biri. Van'da kahvaltı bir öğünden çok, saatlerce süren bir ikram geleneğidir. Şehirde kahvaltı salonlarının sıralandığı sokaklar bile vardır. Sofrada onlarca küçük tabak bulunur, ama bu sofranın simgesi Van otlu peyniridir.

Otlu peynir, içine sirmo, mendi ve benzeri yabani dağ otları katılarak yapılır ve aromasını bu otlardan alır. Yanına petek bal, kaymak, tereyağında ısıtılmış kavut, sahanda yumurta, taze sebzeler ve reçeller eşlik eder. Demli çay bu sofranın ayrılmaz parçasıdır.

Püf noktası: Van kahvaltısının ruhu çeşitliliktir; az miktarlarda ama çok çeşitli tabaklar hazırlayın. Otlu peyniri buzdolabından erken çıkarın, oda sıcaklığında aroması daha iyi ortaya çıkar. Yumurtayı en son, herkes sofraya oturunca pişirin. Çayı taze demleyin ve sık sık tazeleyin.`,
  },
  'tire-koftesi': {
    tr: `Tire köftesi, İzmir'in Tire ilçesinin adını taşıyan, sunumuyla diğer ızgara köftelerden ayrılan bir lezzet. İnce ve uzun şekilde şişe sarılan köfteler közde pişirilir, ardından küp doğranmış pidenin üzerine dizilir. Üzerine domates sosu ve en son kızgın tereyağı dökülür.

Köfte harcı oldukça sadedir: kıyma, soğan ve birkaç baharat. Lezzetin asıl kaynağı etin kalitesi ve közün dumanıdır. Sosu emen pide ile tereyağının cızırtısı, yemeği İskender'e benzer ama kendine özgü bir tabağa dönüştürür.

Püf noktası: Harcı uzun süre yoğurup dinlendirin ki şişte tutunsun. Köfteleri ince şekillendirin; kalın köfte közde dışı yanarken içi geç pişer. Pideyi servisten hemen önce ısıtın, sos ve tereyağı dökülene kadar ıslanmasın. Tereyağını köpürene kadar kızdırıp sofrada dökün.`,
  },
  'konya-arabasi-corbasi': {
    tr: `Arabaşı, İç Anadolu'nun kış gecelerine özgü, alışılmışın dışında bir çorba. Acılı ve salçalı tavuk çorbası, ayrıca pişirilip tepside soğutularak katılaştırılan bir hamurla birlikte yenir. Bir kaşık sıcak çorbayla bir parça soğuk hamur aynı anda ağza alınır; gelenekte hamur çiğnenmeden yutulur.

Konya ve çevresinde arabaşı, uzun kış gecelerinde komşuların ve akrabaların bir araya geldiği sohbet toplantılarının yemeğidir. Sıcak çorba ile serin hamur arasındaki zıtlık, yemeğin hem keyfini hem de geleneğini oluşturur.

Püf noktası: Hamuru topaksız olması için unu soğuk tavuk suyuyla çırparak açın ve pişirirken hiç durmadan karıştırın. Hamur kaşıktan zor düşecek kadar koyulaşmalı. Tepsiyi önceden ıslatırsanız katılaşan hamur kolay kesilir. Çorbayı servis anına kadar sıcak tutun.`,
  },
  'mardin-kusleme': {
    tr: `Küşleme, kuzunun en yumuşak kısmı olan bonfile etinden, yörede "lokum" denen bölümden yapılan bir kebap. Mardin, Diyarbakır ve Urfa'da sevilen küşleme, sade bir hazırlıkla közde kısa sürede pişirilir. Baharat neredeyse hiç kullanılmaz, çünkü bu kebapta etin kendisi ön plandadır.

Küşlemenin başarısı doğru etten ve doğru pişirmeden gelir. Kemiksiz, yağsız ve lifleri ince olan bu et, közde birkaç dakikada pişer ve ağızda dağılacak kadar yumuşak kalır. Lavaş, közlenmiş biber, domates ve sumaklı soğanla servis edilir.

Püf noktası: Etin zarlarını ve sinirlerini dikkatlice temizleyin. Pişirmeden önce eti oda sıcaklığına getirin, soğuk et közde eşit pişmez. Tuzu pişirmenin sonunda serpin, önceden tuzlanan et suyunu kaybeder. Fazla pişirmeyin; içi hafif pembe kalan küşleme en lezzetlisidir.`,
  },
  'babaganush': {
    tr: `Babagannuş, Hatay ve Doğu Akdeniz mutfağının közlenmiş patlıcanla yapılan mezelerinden biri. Hatay usulünde patlıcan ezilip püre yapılmaz, iri doğranır ve domates, biber, taze soğan ve maydanozla birleştirilir. Nar ekşisi, limon ve zeytinyağı salataya ekşi, ferah bir tat verir.

Babagannuş sık sık mütebbel ile karıştırılır. Mütebbelde közlenmiş patlıcan tahin ve yoğurtla ezilir; babagannuş ise tahinsizdir ve daha çok bir salataya benzer. Her ikisi de Hatay sofralarında birlikte bulunabilir.

Püf noktası: Patlıcanları fırında değil, doğrudan ateşte közleyin; dumanlı tadın kaynağı budur. Kabuklarını soyduktan sonra patlıcanı süzgeçte bekletin, fazla suyu salatayı sulandırır. Patlıcanı bıçakla doğrayın, blender kullanmayın. Salatayı servis etmeden kısa süre önce karıştırın ki sebzeler diri kalsın.`,
  },
  'adana-anali-kizli': {
    tr: `Analı kızlı, Güneydoğu Anadolu ve Çukurova mutfağında, adını iki farklı köfteden alan bir çorba. "Ana" denen büyük köftelerin içi kıyma ve cevizle doldurulur; "kız" denen küçük köfteler ise içi boş, nohut büyüklüğünde bulgur toplarıdır. İkisi birlikte nohutlu, salçalı ve ekşili bir et suyunda pişer.

Bu çorba emek ister ve çoğu zaman özel günlerde, kalabalık sofralar için hazırlanır. Ekşiliği limon ya da nar ekşisinden, ferahlığı en son gezdirilen naneli tereyağından gelir.

Püf noktası: Bulgur hamurunu uzun süre yoğurun, ince açıldığında çatlamayacak esneklikte olmalı. Analara iç harcı koyarken ellerinizi ıslatın ve köfteleri sıkıca kapatın. Anaları kızlardan önce tencereye atın, çünkü büyük köftelerin pişmesi daha uzun sürer. Ekşiyi en sonda ekleyin.`,
  },
  'harput-mantisi': {
    tr: `Harput mantısı, adında mantı geçmesine rağmen hamur içermeyen, Elazığ mutfağına özgü bir yemek. Küçük kıyma köfteleri önce fırında kızartılır, ardından salçalı bir sosla pişirilir ve sarımsaklı yoğurt ile kızgın tereyağıyla servis edilir. Sunumu mantıyı andırdığı için bu adla anılır.

Elazığ'ın eski yerleşim yeri Harput, zengin mutfak kültürüyle bilinir ve bu yemek de bölgenin kıymalı yemek geleneğinin bir parçasıdır. Hamur açma zahmeti olmadığı için mantıya göre daha pratik, ama en az onun kadar doyurucudur.

Püf noktası: Köfteleri küçük ve aynı büyüklükte yapın ki eşit pişsinler. Fırında önce sossuz kızartmak köftelerin şeklini korumasını sağlar. Sosu ekledikten sonra fazla pişirmeyin; hafifçe koyulaşması yeterlidir. Yoğurdu oda sıcaklığında kullanın ve tereyağını servis anında gezdirin.`,
  },
  'diyarbakir-meftune': {
    tr: `Meftune, Diyarbakır mutfağının bol sarımsaklı ve ekşili sulu yemeği. Kuzu eti ve kızartılmış patlıcan, domatesli ve biber salçalı bir sosta birlikte pişirilir. Yemeğe karakterini veren, sumak ekşisinin ekşiliği ile cömertçe kullanılan sarımsaktır.

Diyarbakır'da meftune, patlıcanın bol olduğu yaz ve sonbahar aylarında sıkça pişirilir. Bazı evlerde et yerine köfteyle de yapılır. Bulgur pilavıyla birlikte, suyuna ekmek banılarak yenir.

Püf noktası: Patlıcanları önce tuzlu suda bekletip acılığını alın, ardından kızartın; kızarmış patlıcan pişerken dağılmaz ve sosa lezzet katar. Sarımsağı bolca kullanmaktan çekinmeyin, meftunenin kimliği budur. Sumak ekşisini sona doğru ekleyin ve tadına bakarak ayarlayın.`,
  },
  'gaziantep-yuvarlama': {
    tr: `Yuvarlama, Gaziantep'te özellikle Ramazan Bayramı sofralarında pişirilen geleneksel bir yemek. Bulgur ve kıymadan yoğrulan nohut büyüklüğündeki minicik köfteler, kuşbaşı et ve nohutla birlikte yoğurtlu bir sosta pişirilir. Bayram öncesinde aile bireylerinin bir araya gelip köfteleri birlikte yuvarlaması da geleneğin bir parçasıdır.

Yuvarlamanın emek isteyen yanı köftelerin küçüklüğüdür. Bu minik köfteler yoğurt sosunun her kaşıkta eşit dağılmasını sağlar. Üzerine gezdirilen naneli tereyağı yemeğin kokusunu tamamlar.

Püf noktası: Yoğurdu yumurta ve nişastayla çırpın ve tencereye eklemeden önce sıcak suyla ılıtın, böylece kesilmez. Yoğurt eklendikten sonra hep aynı yöne karıştırın ve kaynatmayın. Köfteleri ne kadar küçük yaparsanız yemek o kadar geleneksel olur. Yanında pirinç pilavı servis edin.`,
  },
  'erzurum-kadayifi': {
    tr: `Kadayıf dolması, Erzurum'un en bilinen tatlısı. Tereyağıyla ovulan tel kadayıfın içine ceviz konur, avuçta sıkıştırılarak top şekli verilir, kızartılır ve soğuk şerbete batırılır. Dışı çıtır, içi şerbetli ve cevizli olan bu tatlı, Erzurum'da özellikle Ramazan sofralarında ve misafir ağırlamada öne çıkar.

Kadayıf dolmasını tepside pişen kadayıf tatlılarından ayıran şey hem şekli hem de pişirme yöntemidir. Kızartma, kadayıfın dışını hızla kızartır ve şerbeti çektiğinde bile çıtırlığını bir süre korur.

Püf noktası: Kadayıfı tereyağıyla iyice ovun ki her tel yağlansın. Dolmaları avucunuzda sıkıca bastırın, gevşek kalan dolma kızarırken dağılır. Yağın çok sıcak olmaması gerekir; dışı yanmadan içi de ısınmalı. Şerbet soğuk, dolma sıcak olmalı. Üzerine bolca dövülmüş ceviz serpin.`,
  },
  'amasya-mantisi': {
    tr: `Mantı, Anadolu'nun hemen her bölgesinde farklı biçimlerde yapılan bir hamur işi ve Amasya'nın da kendi mantı geleneği vardır. Amasya mantısında hamur Kayseri mantısına göre biraz daha kalın açılır ve mantılar biraz daha iri kesilir. Bu da mantıyı daha doyurucu ve hazırlanması daha pratik bir yemek haline getirir.

Kıymalı iç harç, sarımsaklı yoğurt ve pul biberli tereyağı mantının klasik üçlüsünü oluşturur. Bu tarifte yoğurdun üzerine ince bir domates sosu da gezdirilir.

Püf noktası: Hamuru açmadan önce en az yarım saat dinlendirin, böylece kolay açılır ve geri çekmez. Mantıları kapatırken köşeleri sıkıca birleştirin ki haşlarken açılmasın. Bol tuzlu suda haşlayın ve fazla pişirmeyin. Sarımsaklı yoğurdu oda sıcaklığında hazırlayın, soğuk yoğurt sıcak mantıyı hemen soğutur.`,
  },
  'izmir-kemal-pasa-tatlisi': {
    tr: `Kemalpaşa tatlısı, adını Bursa'nın Mustafakemalpaşa ilçesinden alan, tuzsuz taze peynirle yapılan şerbetli bir tatlı. İlçede tatlı fırında pişirilip kurutulmuş halde satılır; evde kaynayan şerbette pişirilerek hazırlanır. Kuru hali uzun süre bozulmadan saklanabildiği için Bursa'dan hediye olarak da götürülür.

Peynir, irmik ve unla yoğrulan hamur fırında açık altın rengine kadar pişer. Şerbette kaynadığında şişer, yumuşar ve süngerimsi bir doku kazanır. Kaymakla servis edildiğinde hafif ve ferah bir tatlı olur.

Püf noktası: Peynirin tuzsuz ve taze olması şart; tuzlu peynir tatlının tadını bozar. Hamur ele yapışmayacak kıvamda olmalı, gerekirse biraz daha un ekleyin. Tatlıları fırında fazla kızartmayın, açık renk yeterlidir. Şerbette kısık ateşte pişirin ve tatlıların şerbeti tamamen çekmesini bekleyin.`,
  },
  'bursa-kestane-sekeri': {
    tr: `Kestane şekeri, Bursa'nın en bilinen hediyelik lezzeti. Uludağ eteklerindeki kestane ağaçlarından toplanan iri kestaneler, kabukları soyulduktan sonra şekerli şerbette uzun süre pişirilir ve kurutulur. Bursa'ya yolu düşenlerin dönüşte yanında götürdüğü başlıca hediyelerdendir.

Kestane şekerinin başarısı, kestanenin şerbeti iç kısmına kadar çekmesine ve bu sırada dağılmamasına bağlıdır. Doğru pişirilmiş kestane dışta parlak, içte yumuşak ve tatlıdır.

Püf noktası: Kestanelerin hem dış kabuğunu hem de içteki ince zarı mutlaka soyun; zar kalırsa acı bir tat bırakır. Kestaneler sıcakken daha kolay soyulur. Şerbette kısık ateşte ve nazikçe pişirin, sık karıştırmak kestaneleri parçalar. Kurutma süresini kısaltmayın; iyi kurumamış kestane şekeri yapışır.`,
  },
  'gemlik-zeytinli-meze': {
    tr: `Gemlik zeytini, Bursa'nın Gemlik ilçesinin adını taşıyan, Türkiye'nin en bilinen sofralık siyah zeytinlerinden biri. Eti dolgun, kabuğu ince ve yağ oranı yüksek olan bu zeytin, kahvaltı sofralarının vazgeçilmezidir. Bu tarifte zeytin, sarımsak, kekik ve limonla ılık bir mezeye dönüşür.

Zeytinyağında hafifçe ısıtılan sarımsak ve kekik, zeytinin aromasını öne çıkarır; limon kabuğu ise tuzlu ve yağlı tadı ferahlatır. Ekmekle, kahvaltıda ya da bir meze tabağının parçası olarak servis edilebilir.

Püf noktası: Sarımsağı zeytinyağında kısık ateşte, kızartmadan yalnızca pembeleşene kadar ısıtın; yanan sarımsak acılaşır. Zeytinleri uzun süre pişirmeyin, yalnızca ısınmaları yeterlidir. Zeytinler çok tuzluysa kullanmadan önce birkaç saat suda bekletin. Taze kekik dalı sunuma güzel bir koku katar.`,
  },
  'kars-kazi': {
    tr: `Kaz, Kars ve Ardahan'ın kış mutfağının simgesidir. Yaz boyunca otlaklarda beslenen kazlar sonbaharda kesilir, eti tuzlanıp kurutulur ya da tütsülenir ve uzun kış boyunca saklanır. Kars'ta kaz eti, soğuk kış günlerinde aile sofralarının ve misafir ağırlamanın baş yemeğidir.

Tuzla kürlenen ve ardından pişirilen kaz eti, yoğun ve kendine özgü bir tat kazanır. Bu tarif, geleneksel yöntemi ev mutfağına uyarlar: et önce baharatlı tuzla kürlenir, sonra haşlanır, fırında kızartılır ve isteğe göre kısa süre tütsülenir.

Püf noktası: Kürleme süresini kısaltmayın; tuz etin derinlerine işlemeli. Kürlenen eti haşlamadan önce iyice yıkayın, yoksa fazla tuzlu olur. Kaz eti yağlıdır, fırında kızartırken eriyen yağı ayrı bir kaba alıp pilav ya da patates pişirmek için kullanabilirsiniz. Eti ince dilimleyerek servis edin.`,
  },
  'gaziantep-ciger-kebabi': {
    tr: `Ciğer kebabı, Gaziantep'te günün her saatinde yenen bir sokak lezzeti; şehirde pek çok kişi güne ciğer kebabıyla başlar. Küçük parçalara kesilen kuzu ciğeri, aralarına kuyruk yağı dizilerek şişe geçirilir ve közde dakikalar içinde pişirilir.

Antep ciğer kebabının lezzeti tazelik ve sadelikten gelir. Pul biber ve kimyonla hafifçe baharatlanan ciğer, eriyen kuyruk yağıyla yumuşar. Sıcak lavaşın üzerine alınır; yanında közlenmiş domates ve biber, soğan ve maydanozla yenir.

Püf noktası: Ciğeri mümkün olduğunca taze alın ve kesmeden önce zarını soyun. Közün yüksek ısıda ve şişlerin ateşe yakın olması gerekir; ciğer hızlı pişmeli. İçi hafif pembe kaldığında ateşten alın, fazla pişen ciğer sertleşir ve kurur. Kebabı bekletmeden, şişten çıkar çıkmaz servis edin.`,
  },
  'rize-karalahana-corbasi': {
    tr: `Karalahana çorbası, Rize ve Doğu Karadeniz'in en sevilen kış çorbası. Bölgenin dik yamaçlarında yetişen karalahana, bu çorbada tereyağıyla kavrulur, et suyunda yumuşatılır ve mısır unuyla koyulaştırılır. Karadeniz mutfağının iki temel malzemesi olan karalahana ve mısır aynı tencerede buluşur.

Mısır unu çorbaya hem kıvam hem de hafif tatlı bir tat verir. Üzerine gezdirilen pul biberli tereyağı ise karalahananın hafif acımsı tadını dengeler. Yanında mısır ekmeğiyle servis edilir.

Püf noktası: Karalahananın kalın saplarını çıkarın, yaprakları iyice yıkayın; yapraklarda toprak kalabilir. Mısır ununu doğrudan çorbaya eklemeyin, önce soğuk suyla pürüzsüz bir şekilde açın, yoksa topaklanır. Mısır unu ekledikten sonra çorbayı kısık ateşte karıştırarak pişirin, dibi kolay tutar.`,
  },
  'giresun-muhlama': {
    tr: `Mıhlama, Giresun ve Doğu Karadeniz'in kahvaltı sofralarının yıldızı. Bakır sahanda eritilen yayık tereyağında mısır unu kavrulur, su ile pişirilip koyulaştırılır ve içine eriyip uzayan bir peynir eklenir. Bölgenin bazı yerlerinde kuymak adıyla da bilinir.

Mıhlamanın lezzeti malzemenin kalitesine bağlıdır: taze, kokulu tereyağı, iri çekilmiş mısır unu ve eriyince tel tel uzayan peynir. Ortak sahandan, ekmekle ya da kaşıkla yenmesi de geleneğin bir parçasıdır.

Püf noktası: Mısır ununu tereyağında hafif renk alana kadar kavurun; bu adım yemeğin aromasını belirler. Suyu ekledikten sonra hızlı karıştırın ki topak oluşmasın. Peyniri en son ekleyin ve uzayıp ipe çekene kadar karıştırın. Mıhlama soğudukça katılaşır; pişer pişmez, sahanıyla birlikte sofraya getirin.`,
  },
  'erzurum-ayran-asi': {
    tr: `Ayran aşı, Erzurum ve Doğu Anadolu'nun uzun ve soğuk kışlarında sofradan eksik olmayan yoğurtlu bir çorba. Yoğurt, yumurta ve unla terbiye edilir, içine bulgur ya da pirinç ve isteğe göre nohut eklenir. Hafif ekşi, kremamsı ve doyurucu bir çorbadır.

Doğu Anadolu'da hayvancılığın yaygın olması, yoğurdu bölge mutfağının temel malzemelerinden biri yapmıştır; ayran aşı da bu mutfağın en sade örneklerindendir. Üzerine gezdirilen naneli ve pul biberli tereyağı çorbaya hem renk hem koku katar.

Püf noktası: Yoğurdu yumurta ve unla çok iyi çırpın; bu karışım yoğurdun ısınırken kesilmesini önler. Çorbayı ısıtırken hiç durmadan ve hep aynı yöne karıştırın. Kaynamaya başladığında ateşi hemen kısın. Bulgurun pişme süresi çorbanın kıvamını belirler, gerekirse biraz sıcak su ekleyin.`,
  },
  'kars-tutmac-corbasi': {
    tr: `Tutmaç, adı 11. yüzyılda Kaşgarlı Mahmud'un Divanü Lügati't-Türk'ünde de geçen, Türk mutfağının en eski yemeklerinden biri. El açması ince hamurun küçük parçalar halinde kesilmesiyle yapılan bu çorba, Orta Asya'dan Anadolu'ya uzanan bir geleneğin izini taşır. Kars'ta tutmaç, mercimek, nohut ve yoğurtla zenginleştirilir.

Tutmacın lezzeti ev yapımı hamurdan gelir. İnce açılıp kesilen hamur parçaları çorbada pişerken suyu koyulaştırır, yoğurt ise hafif bir ekşilik katar. Naneli tereyağı çorbanın kokusunu tamamlar.

Püf noktası: Hamuru sert yoğurun ve olabildiğince ince açın. Kesilen parçaları unlayıp biraz kurutun, böylece çorbada birbirine yapışmazlar. Yoğurdu doğrudan kaynayan çorbaya eklemeyin; önce bir kepçe sıcak çorbayla ılıtın. Yoğurt eklendikten sonra çorbayı kısık ateşte tutun.`,
  },
  'trabzon-pita': {
    tr: `Trabzon pidesi, uzun ve kayık biçimiyle tanınan, Karadeniz'in fırın kültürünün simgesi. Mayalı hamur oval açılır, ortasına harç konur, kenarları içe katlanarak kayık şekli verilir ve taş fırında pişirilir. Trabzon'da pide, kıymalı olduğu kadar peynirli ve yumurtalı çeşitleriyle de sevilir.

Bu tarif sade kıymalı versiyondur. Kıyma, soğan, biber ve domatesle hazırlanan harç fırında pişerken hamura işler. Fırından çıkınca üzerine sürülen tereyağı pideye parlaklık ve koku katar.

Püf noktası: Hamuru yumuşak tutun ve iyice mayalandırın; sert hamur fırında kabarmaz. Harcı ince bir tabaka halinde yayın, kalın harç hamurun pişmesini engeller. Kenarları sıkıca katlayın ki pişerken açılmasın. Fırını iyice ısıtın; mümkünse taş ya da ters tepsi üzerinde pişirin. Tereyağını pide sıcakken sürün.`,
  },
  'trabzon-hurma-tatlisi': {
    tr: `Trabzon hurması, adı hurma olsa da hurmayla akrabalığı olmayan, kaki olarak da bilinen bir meyve. Karadeniz'in ılıman ikliminde yetişir ve sonbaharda olgunlaşır. Ham haliyle buruk olan meyve, iyice olgunlaştığında reçel kıvamında yumuşak ve bal gibi tatlı bir hale gelir.

Bu tatlı, Trabzon hurmasının doğal tatlılığını süzme yoğurt, bal ve cevizle buluşturan, pişirme gerektirmeyen hafif bir sonbahar tatlısı. Limon kabuğu ve nane ferahlık, tarçın ise sıcak bir koku katar.

Püf noktası: Meyvenin tamamen olgunlaşmış olması şart; ham Trabzon hurması ağzı buruşturur. Sert meyveleri oda sıcaklığında, elma ya da muzun yanında bekletirseniz daha hızlı olgunlaşırlar. Yoğurdu çok fazla tatlandırmayın, meyve zaten tatlıdır. Tatlıyı servis etmeden hemen önce hazırlayın.`,
  },
  'sinop-boyabat-keşkeği': {
    tr: `Boyabat, Sinop'un iç kesimlerinde, Kızılırmak vadisinde yer alan bir ilçe ve keşkeğiyle tanınır. Boyabat'ta keşkek, düğünlerde ve hayır yemeklerinde büyük kazanlarda, saatlerce karıştırılıp dövülerek pişirilir. Hazırlığı çoğu zaman topluca yapılır ve kazanın başında nöbetleşe karıştırılır.

Dövme buğday ve etin uzun pişirme sonunda birbirine karışmasıyla ortaya çıkan keşkek, lif lif ve yapışkan bir kıvam alır. Üzerine gezdirilen pul biberli ve naneli tereyağı, bu sade yemeğe renk ve koku verir.

Püf noktası: Buğdayı bir gece önceden ıslatın ve pişirirken suyunu eksik etmeyin, gerekirse sıcak su ekleyin. Eti tamamen yumuşayıp liflerine ayrılana kadar pişirin. Dövme aşamasında sabırlı olun; keşkek tek parça gibi görünene dek devam edin. Tereyağını servis anında kızdırıp gezdirin.`,
  },
}

export function getRecipeIntro(recipeId, lang = 'tr') {
  return RECIPE_INTROS[recipeId]?.[lang] || null
}
