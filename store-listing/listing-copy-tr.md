# Mağaza listesi metni (TR) — taslak

Kaynak: `OnboardingScreen.js` slaytları + uygulamanın mevcut özellik seti. Karakter
limitleri her platformun kendi kuralı; yapıştırmadan önce kontrol et.

## Google Play Console

**Uygulama adı** (30 karakter): Yöresel Tarif

**Kısa açıklama** (80 karakter sınırı):
```
Dünyanın 1000+ yöresel tarifi: adım adım pişir, listeni oluştur, rozet kazan
```
(78 karakter)

**Tam açıklama** (4000 karakter sınırı):
```
Yöresel Tarif ile dünyanın dört bir yanındaki mutfak kültürünü kaşifin
mutfağına taşı. 1000'den fazla yöresel tarif — her birinin arkasındaki
hikayeyle birlikte.

ÖZELLİKLER
• 8 kıtadan 1000+ yöresel tarif: Türk mutfağından İskender, Mantı, Lahmacun,
  Künefe'ye; dünya mutfağından yüzlerce klasiğe
• Adım adım, net anlatımlı tarifler — porsiyon ayarına göre malzeme miktarı
  otomatik hesaplanır
• Pişirme sayacı ile adımları kaçırmadan takip et
• Beğendiğin tarifleri favorilere ekle, alışveriş listeni otomatik oluştur
• Günün menüsü ile her gün yeni bir tarif keşfet
• Tarif pişirdikçe rozet kazan, ülkeleri keşfet, kendi mutfak pasaportunu
  doldur
• Kendi tarifini paylaş, topluluğun yorumlarını oku ve puanla
• Karanlık/Aydınlık tema

Yöresel Tarif, hem yeni başlayanlar hem deneyimli aşçılar için: net
adımlar, doğru porsiyon hesaplama ve keşfedilecek onlarca mutfak kültürüyle
mutfakta kaybolmadan pişirmeni sağlar.
```

**Kategori:** Yemek ve İçecek (Food & Drink)

**Grafik varlıklar:**
- Uygulama ikonu 512×512 PNG (mevcut `assets/icon.png` 1024×1024 — Play Console'a yüklerken kontrol et)
- Feature graphic 1024×500 PNG — **hazır: `store-listing/feature-graphic-1024x500.png`**
- Telefon ekran görüntüleri: en az 2, önerilen 4-8 adet (16:9 veya 9:16) — **yok, gerçek cihaz/emulator'dan alınmalı**
- (Opsiyonel ama önerilir) 7" ve 10" tablet ekran görüntüleri

**Content rating anketi:** Play Console'da doldurulacak — uygulamada şiddet/yetişkin içerik yok, UGC (yorum) var ve moderasyon mekanizması mevcut (rapor/engelle), bu ankette belirtilmeli.

**Data safety formu:** 2026-10-09'da dolduruldu.

> 2026-10-11: Tam açıklamadan "Türkçe, İngilizce, Fransızca ve İtalyanca dil desteği" satırı çıkarıldı — uygulamada dil seçimi yok (Profil'deki "Yakında" satırı da kaldırıldı). Play Console'daki mağaza kaydında bu satır duruyorsa oradan da silinmeli.

---

## Apple App Store Connect

**Uygulama adı** (30 karakter): Yöresel Tarif

**Alt başlık / Subtitle** (30 karakter sınırı):
```
Dünya mutfağını keşfet
```

**Promosyon metni** (170 karakter, gönderim sonrası da güncellenebilir):
```
1000'den fazla yöresel tarif, adım adım pişirme, porsiyon hesaplama ve
alışveriş listesi tek uygulamada. Rozet kazan, mutfak pasaportunu doldur!
```

**Açıklama** (4000 karakter sınırı) — Play Store ile aynı metin kullanılabilir.

**Anahtar kelimeler** (100 karakter, virgülle ayrılmış):
```
tarif,yemek,mutfak,pişirme,yöresel,dünya mutfağı,alışveriş listesi,tarifler
```

**Kategori:** Yemek ve İçecek (Food & Drink)

**Gizlilik Politikası URL'si:** https://yoreseltarif.com/gizlilik-politikasi (zaten canlı)

**Destek URL'si:** https://yoreseltarif.com/iletisim (zaten canlı)

**Gönderim öncesi kontrol listesi (2026-10-11):**
- Ekran görüntüleri: iPhone 6.9" — 1320×2868 veya 1290×2796 piksel, en az 3 (önerilen 5-6). Telefondan **doğrudan** aktarılmalı (AirDrop/kablo/iCloud — WhatsApp sıkıştırır ve boyutu değiştirir).
- iPad: `app.config.js` → `supportsTablet: true` olduğu sürece 13" iPad ekran görüntüleri de zorunlu. Ya iPad görüntüsü hazırlanacak ya da `supportsTablet: false` yapılıp yeni iOS build alınacak (uygulama iPad'de yine iPhone modunda çalışır).
- İnceleme notu + demo hesap: `inceleme.yoreseltarif@gmail.com` (şifre kullanıcıda; RevenueCat'te ömür boyu premium tanımlı). Not: "Premium satın alma akışı sandbox hesabıyla test edilebilir; demo hesapta premium zaten açık."
- Sürüm 1.0, abonelik grubunu (Premium Aylık + Yıllık) içeren mevcut taslak gönderime eklenmeli.
- Lisans sözleşmesi (EULA): Apple'ın standart EULA'sı kullanılabilir; uygulama içi Kullanım Koşulları'nda abonelik bölümü var (2026-10-11), ödeme ekranında Koşullar/Gizlilik bağlantıları mevcut.

**App Privacy (gizlilik etiketi) cevapları — koda göre:**
- *Takip (Tracking): EVET* — AdMob + ATT izni isteniyor (`consentService.js`). Takipte kullanılanlar: Cihaz Kimliği, Reklam verileri, Ürün etkileşimi, Kaba konum.
- *İletişim Bilgileri → E-posta adresi*: Uygulama işlevselliği; kullanıcıya bağlı; takip yok.
- *İletişim Bilgileri → Ad*: (görünen ad / Apple-Google girişi) Uygulama işlevselliği; kullanıcıya bağlı.
- *Kullanıcı İçeriği → Fotoğraflar, Diğer kullanıcı içeriği* (tarif önerisi, yorum, yorum fotoğrafı): Uygulama işlevselliği; kullanıcıya bağlı.
- *Tanımlayıcılar → Kullanıcı Kimliği*: Uygulama işlevselliği (Firebase UID; Sentry hata kaydında da uid var); kullanıcıya bağlı.
- *Tanımlayıcılar → Cihaz Kimliği*: Üçüncü taraf reklamcılık; takip EVET.
- *Satın Almalar → Satın alma geçmişi*: Uygulama işlevselliği (RevenueCat); kullanıcıya bağlı.
- *Tanılama → Çökme verileri, Performans verileri*: Uygulama işlevselliği (Sentry); kullanıcıya bağlı (uid).
- *Kullanım Verileri → Reklam verileri*: Üçüncü taraf reklamcılık (AdMob).
- *Konum → Kaba konum (Coarse Location)*: Üçüncü taraf reklamcılık (AdMob, IP'den); kullanıcıya bağlı değil; takip EVET.
- *Kullanım Verileri → Ürün etkileşimi (Product Interaction)*: Üçüncü taraf reklamcılık + Analitik (anonim görüntülenme sayaçları, `viewStatsService.js`); kullanıcıya bağlı değil; takip EVET.
- Toplanmayan: hassas konum, kişiler, sağlık, finans bilgisi (ödeme Apple'da), arama geçmişi (2026-10-11'de analitik kayıtları kaldırıldı).
- **2026-10-11: App Store Connect'te bu 12 veri türüyle dolduruldu.**

**Yaş derecelendirmesi:** Tüm içerik soruları "Yok". Kullanıcı tarafından oluşturulan içerik var (yorum/tarif önerisi) — moderasyon, şikayet ve engelleme mevcut. Sonuç büyük olasılıkla 4+ (UGC nedeniyle Apple 12+ önerebilir; kabul edilebilir).

**Grafik varlıklar:**
- 6.9" (iPhone 16 Pro Max vb.) ekran görüntüleri: en az 3, önerilen 5-10 — **yok**
- 6.5" ekran görüntüleri (eski zorunluluk, artık 6.9" yeterli olabilir, App Store Connect'te kontrol et)
- iPad ekran görüntüleri (uygulama `supportsTablet: true` — iPad'de de test edilmeli)
- App Store ikonu 1024×1024 (arka planında şeffaflık olmamalı — mevcut `assets/icon.png` kontrol edilmeli)

**Age rating anketi:** Play Console ile aynı mantık — UGC var, moderasyon var.

**App Privacy (Nutrition Label) formu:** Data safety formuyla aynı bilgiler, Apple'ın kendi kategori/etiket sistemine göre doldurulacak.

---

## Genel eksik listesi (bu taslağın kapsamadığı, hâlâ elle yapılması gereken)

1. Telefon + tablet/iPad ekran görüntüleri — gerçek cihaz veya simulator'dan alınmalı, sonra store boyutlarına göre kırpılmalı/kadraj yapılmalı. (2026-08-15: bu ortamda Android emulator çalıştırılamadı — nested virtualization desteklenmiyor, `CPUID.01H:ECX.avx/xsave` hataları. Kullanıcının kendi makinesinde alması gerekiyor.)
2. ~~Play Store feature graphic (1024×500)~~ — **tamam**, `feature-graphic-1024x500.png` (2026-08-15, sharp ile SVG'den render edildi).
3. ~~Apple Developer Program ve Google Play Console hesap kayıtları~~ — **tamam** (2026-08-15, kullanıcı onayladı).
4. Play Console'da uygulama kaydı + mağaza listesi formu, App Store Connect'te app record — kullanıcının kendi hesabından yapması gerekiyor, bu oturumda erişilemez.
5. İlk gerçek `eas submit` denemesi — hesaplar hazır, sıradaki adım.
