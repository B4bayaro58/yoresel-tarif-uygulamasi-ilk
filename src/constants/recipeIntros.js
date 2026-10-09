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
}

export function getRecipeIntro(recipeId, lang = 'tr') {
  return RECIPE_INTROS[recipeId]?.[lang] || null
}
