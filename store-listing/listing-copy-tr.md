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
• Türkçe, İngilizce, Fransızca ve İtalyanca dil desteği
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

**Data safety formu:** Toplanan veriler — e-posta (Firebase Auth), kullanıcı içeriği (yorumlar, tarif önerileri, favoriler). Üçüncü taraflarla paylaşılmıyor. Firebase/Google Analytics kullanılıyorsa (bkz. `analyticsService.js`) bu da formda belirtilmeli.

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

**Grafik varlıklar (henüz yok, hazırlanmalı):**
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
