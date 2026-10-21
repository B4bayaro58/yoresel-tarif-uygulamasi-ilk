// KVKK / 5651 metinlerinin tek kaynağı -- hem mobil uygulama hem web sitesi
// (`@shared/legalTexts`) buradan okur, iki platformdaki metinler ayrışmasın.
//
// Metin blokları: { h } başlık, { p } paragraf, { ul: [...] } madde listesi.
// İlke Kararı 2026/347 (RG 24/3/2026): aydınlatma metni ile açık rıza metni
// ayrı ayrı sunulmalı ve aydınlatma bir onaya bağlanamaz -- o yüzden
// KVKK_AYDINLATMA ile AD_CONSENT_TEXT ayrı tutuluyor, kayıt ekranında
// aydınlatma için onay kutusu yok.

export const LEGAL_UPDATED_AT = '21 Ekim 2026';

// Veri sorumlusu (KVKK md.10/a) ve içerik sağlayıcı künyesi (5651 md.3).
export const CONTROLLER = {
  name: 'Çağatay YILMAZ',
  address: 'Gültepe Mah. 11. Toptancılar Sk. No:23 Merkez/Sivas',
  email: 'info@yoreseltarif.com',
  website: 'yoreseltarif.com',
};

export const KVKK_AYDINLATMA = [
  {
    p: `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Yöresel Tarif web sitesi (${CONTROLLER.website}) ve mobil uygulaması ("Yöresel Tarif") kapsamında kişisel verilerinizin işlenmesine ilişkin sizi bilgilendirmek isteriz.`,
  },
  { h: '1. Veri Sorumlusu' },
  {
    ul: [
      `Veri sorumlusu: ${CONTROLLER.name}`,
      `Adres: ${CONTROLLER.address}`,
      `E-posta: ${CONTROLLER.email}`,
    ],
  },
  { h: '2. İşlenen Kişisel Veriler' },
  {
    ul: [
      'Kimlik: ad-soyad veya kullanıcı adı (görünen ad), profil fotoğrafı (Google/Apple hesabınızdan gelirse)',
      'İletişim: e-posta adresi',
      'Kullanıcı işlem verileri: favoriler, alışveriş listesi, menü, gönderdiğiniz tarif önerileri ve fotoğrafları, verdiğiniz yıldız puanları, tarif hata bildirimleri',
      'İşlem güvenliği: hesap kimliği (UID), giriş yöntemi (e-posta, Google, Apple), oturum bilgileri, hizmet sağlayıcılarımızın sunucu kayıtlarındaki IP adresi',
      'Abonelik: Premium abonelik durumu ve satın alma kaydı (ödeme Apple veya Google tarafından alınır; kart bilgilerinize erişimimiz yoktur)',
      'Reklam: reklam tanımlayıcısı (iOS\'ta yalnızca izin verirseniz), reklam çerezleri ve reklam etkileşim verileri',
    ],
  },
  {
    p: 'Özel nitelikli kişisel veri (sağlık, din, biyometrik veri vb.) işlenmez. Lütfen tarif önerilerinizde ve hata bildirimlerinizde bu tür bilgiler paylaşmayın.',
  },
  { h: '3. İşleme Amaçları ve Hukuki Sebepler' },
  {
    ul: [
      'Üyelik oluşturma, hesap yönetimi, favori/alışveriş listesi senkronizasyonu, tarif önerisi ve puan verme, Premium aboneliğin yürütülmesi — KVKK md.5/2-c (sözleşmenin kurulması ve ifası)',
      'Tarif önerileri ve hata bildirimlerinin incelenmesi, 5651 sayılı Kanun dahil mevzuattan doğan yükümlülüklerin yerine getirilmesi — md.5/2-ç (hukuki yükümlülük) ve md.5/2-f (meşru menfaat)',
      'Bilgi ve hizmet güvenliğinin sağlanması, kötüye kullanımın önlenmesi — md.5/2-f (meşru menfaat)',
      'Kişiselleştirilmemiş reklam gösterimi (ücretsiz hizmetin finansmanı) — md.5/2-f (meşru menfaat)',
      'Kişiselleştirilmiş reklam gösterimi — yalnızca açık rızanızla (md.5/1); ayrı "Reklam Açık Rıza Metni" ile alınır, vermemeniz hiçbir hizmeti kısıtlamaz',
      'Başvuru ve taleplerin yanıtlanması, hukuki uyuşmazlıklarda hakların korunması — md.5/2-ç ve md.5/2-e',
    ],
  },
  { h: '4. Toplama Yöntemi' },
  {
    p: 'Kişisel verileriniz; kayıt ve giriş formları, Google ve Apple ile giriş, uygulama ve sitedeki işlemleriniz, çerezler ve benzeri teknolojiler ile mobil reklam araçları aracılığıyla elektronik ortamda, otomatik yollarla toplanır.',
  },
  { h: '5. Kişisel Verilerin Aktarılması' },
  {
    p: 'Kişisel verileriniz pazarlama amacıyla satılmaz. Hizmetin sunulabilmesi için aşağıdaki hizmet sağlayıcılara aktarılır. Bu sağlayıcıların sunucuları yurt dışında (başta ABD ve AB ülkeleri) bulunduğundan aktarım yurt dışına aktarım niteliğindedir ve KVKK md.9 hükümlerine uygun olarak yapılır:',
  },
  {
    ul: [
      'Google LLC / Google Ireland Ltd. — Firebase (kimlik doğrulama, veritabanı, dosya depolama), Google ile Giriş, AdMob ve AdSense (reklam)',
      'Apple Inc. — Apple ile Giriş, App Store satın alma',
      'Vercel Inc. — web sitesinin barındırılması',
      'RevenueCat Inc. — Premium abonelik yönetimi (yalnızca hesap kimliği)',
    ],
  },
  {
    p: 'Kanunen yetkili kamu kurum ve kuruluşlarına, talep halinde ve mevzuatın gerektirdiği ölçüde aktarım yapılabilir (md.8 ve md.5/2-ç). Onaylanan tarif önerileri, gönderen adı belirtilmeden editoryal içerik olarak yayınlanır; verdiğiniz puanlar adınız gösterilmeden yalnızca ortalamaya dahil edilir.',
  },
  { h: '6. Saklama Süresi' },
  {
    p: 'Verileriniz hesabınız açık olduğu sürece saklanır. Hesabınızı uygulamadaki "Hesabı Sil" seçeneğiyle veya e-posta ile talep ederek sildiğinizde; hesap kaydınız, puanlarınız, gönderdiğiniz tarif önerileri, hata bildirimleriniz ve yüklediğiniz fotoğraflar silinir. Hizmet sağlayıcıların sistemlerindeki yedek ve kayıtlar, kendi saklama sürelerinin sonunda (genellikle en geç 6 ay içinde) silinir. Yasal bir yükümlülük gerektirdiğinde ilgili veriler mevzuatta öngörülen süre kadar saklanabilir.',
  },
  { h: '7. KVKK md.11 Kapsamındaki Haklarınız' },
  {
    ul: [
      'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
      'İşlenmişse buna ilişkin bilgi talep etme',
      'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
      'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme',
      'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
      'KVKK md.7 çerçevesinde silinmesini veya yok edilmesini isteme',
      'Düzeltme ve silme işlemlerinin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme',
      'İşlenen verilerin münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonuç çıkmasına itiraz etme',
      'Kanuna aykırı işleme sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme',
    ],
  },
  { h: '8. Başvuru Yöntemi' },
  {
    p: `Haklarınızı kullanmak için başvurunuzu; ${CONTROLLER.address} adresine yazılı olarak, ya da Yöresel Tarif hesabınızda kayıtlı e-posta adresinizden ${CONTROLLER.email} adresine iletebilirsiniz. Başvurunuzda ad-soyad, iletişim bilgileriniz ve talebinizin açıklaması yer almalıdır. Başvurunuz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır. Başvurunuzun reddedilmesi, cevabın yetersiz bulunması veya süresinde cevap verilmemesi halinde Kişisel Verileri Koruma Kurulu'na şikâyette bulunabilirsiniz.`,
  },
];

// Kişiselleştirilmiş reklam için açık rıza metni -- aydınlatmadan ayrı
// (İlke Kararı 2026/347). Rıza vermemek hiçbir özelliği kısıtlamaz; o
// durumda kişiselleştirilmemiş reklam gösterilir.
export const AD_CONSENT_TEXT = [
  {
    p: `${CONTROLLER.name} (veri sorumlusu) tarafından, Yöresel Tarif web sitesinde ve mobil uygulamasında size ilgi alanlarınıza göre kişiselleştirilmiş reklamlar gösterilebilmesi amacıyla; reklam tanımlayıcınız (iOS'ta ayrıca izin verirseniz), reklam çerezleri, cihaz ve uygulama/site kullanım bilgileriniz ile reklam etkileşim verilerinizin Google LLC / Google Ireland Ltd. (AdMob ve AdSense) tarafından işlenmesine ve bu amaçla yurt dışındaki (başta ABD) sunuculara aktarılmasına açık rıza veriyorum.`,
  },
  {
    ul: [
      'Bu rıza isteğe bağlıdır. Vermezseniz uygulamanın ve sitenin tüm özelliklerini aynı şekilde kullanmaya devam edersiniz; size yalnızca kişiselleştirilmemiş reklam gösterilir.',
      'Rızanızı dilediğiniz zaman geri alabilirsiniz: uygulamada Profil > Reklam Tercihleri, sitede sayfanın altındaki "Çerez Tercihleri" bağlantısı.',
      'Kişisel verilerinizin işlenmesine ilişkin ayrıntılı bilgi KVKK Aydınlatma Metni\'nde yer alır.',
    ],
  },
];

// Rıza ekranlarında görünen kısa özet (tam metin yukarıda).
export const AD_CONSENT_SUMMARY =
  'Size ilgi alanlarınıza göre reklam gösterebilmemiz için reklam verilerinizin Google (AdMob/AdSense) tarafından işlenmesine ve yurt dışına aktarılmasına açık rızanızı istiyoruz. Vermezseniz her şey aynı şekilde çalışır, yalnızca kişiselleştirilmemiş reklam görürsünüz. Kararınızı istediğiniz zaman değiştirebilirsiniz.';


// Mobil pencerelerin Türkçe dışı dillerdeki karşılığı (hukuki metnin aslı
// Türkçe; tam metinler yalnızca Türkçe yayınlanıyor).
export const AD_CONSENT_UI = {
  tr: {
    title: 'Reklam Tercihleri',
    summary: AD_CONSENT_SUMMARY,
    accept: 'Kabul Et',
    reject: 'Reddet',
    readFull: 'Açık rıza metninin tamamını oku',
    hideFull: 'Metni gizle',
    current: (c) => (c === 'granted' ? 'Mevcut seçim: Kabul edildi' : c === 'denied' ? 'Mevcut seçim: Reddedildi' : ''),
    close: 'Kapat',
  },
  en: {
    title: 'Ad Preferences',
    summary:
      'We ask for your explicit consent to have your advertising data processed by Google (AdMob) and transferred abroad so we can show ads based on your interests. If you decline, everything works the same — you will only see non-personalized ads. You can change your choice at any time.',
    accept: 'Accept',
    reject: 'Decline',
    readFull: 'Read the full consent text (Turkish)',
    hideFull: 'Hide text',
    current: (c) => (c === 'granted' ? 'Current choice: Accepted' : c === 'denied' ? 'Current choice: Declined' : ''),
    close: 'Close',
  },
};


