# KVKK md.9 — Yurt Dışına Aktarım Standart Sözleşmeleri

Yöresel Tarif'in kullandığı hizmet sağlayıcıların sunucuları yurt dışında. 2024'ten beri bu aktarımların
dayanağı açık rıza değil, **Kurul'un ilan ettiği standart sözleşme** (KVKK md.9/4-c). Bu klasördeki
dosyalar o sözleşmelerdir.

| Dosya | Alıcı | Modül | Neden |
|---|---|---|---|
| `SS2_Google-Firebase.docx` | Google LLC | 2 — Veri Sorumlusundan Veri İşleyene | Üyelik, veritabanı, fotoğraflar |
| `SS2_Sentry.docx` | Functional Software, Inc. | 2 | Mobil hata raporlama |
| `SS2_RevenueCat.docx` | RevenueCat, Inc. | 2 | Premium abonelik |
| `SS2_Vercel.docx` | Vercel Inc. | 2 | Web sitesi barındırma |
| `SS1_Google-AdMob-AdSense.docx` | Google Ireland Limited | 1 — Veri Sorumlusundan Veri Sorumlusuna | Reklam (Google kendi amacıyla işler) |

## Sözleşme metni hakkında

- Metin, Kurul'un 2024/959 sayılı kararıyla yayımlanan resmî PDF'lerden **birebir** alındı; üretim
  sırasında PDF ile karakter karakter karşılaştırıldı. Kurul metinde değişiklik yapılmasını yasaklıyor
  (Madde 2) — **gövde metnine dokunmayın**, yalnızca Ekler ve imza alanları doldurulabilir.
- Kurul'un seçime bıraktığı yerlerde yapılan seçimler:
  - Madde 8 (Modül 2): **Genel yetkilendirme**, alt işleyen değişikliği için **30 gün** önceden bildirim
    (büyük sağlayıcıların kendi koşullarıyla uyumlu).
  - Madde 10 (isteğe bağlı bağımsız uyuşmazlık çözüm kuruluşu maddesi): **eklenmedi**.
  - Madde 16 / Modül 1'de Madde 15 (Kurum'a bildirim): **bildirimi veri aktaran (siz) yapar.**
- Ekler (Ek I aktarım detayları, Ek II güvenlik tedbirleri, Ek III alt işleyenler) uygulamanın gerçek
  veri akışına göre dolduruldu. İmzalamadan önce bir kez okuyun.
- **Google'ın sözleşme yapan şirketini kontrol edin:** Firebase konsolu > Proje ayarları > Gizlilik /
  Veri işleme koşulları ve AdSense/AdMob > Ödemeler > Ödeme profili'nde hangi Google şirketiyle sözleşmeli
  olduğunuz yazar. Farklıysa (ör. Firebase için Google Ireland Limited / Google Cloud EMEA Limited)
  alıcı adını ve adresini o şirketle değiştirin (bu, imza bloğu ve Ek'lerdir; gövde metni değildir).

## Adım adım

1. **İmzalayın.** Her dosyanın sonundaki "Veri Aktaran" imza alanını e-imza ile veya ıslak imzayla
   imzalayın ve tarih atın. PDF'e çevirin.
2. **Sağlayıcıya gönderin** (aşağıdaki e-posta taslakları). Karşı tarafın imzalaması gerekiyor —
   sözleşme ancak iki taraf da imzalayınca yürürlüğe girer.
3. **Karşı imzalı nüsha gelince 5 iş günü içinde Kurum'a bildirin** (md.9/5). Kaçırmanın cezası
   2026 için 90.308 – 1.806.377 TL.
   - Yol: KVKK internet sitesindeki **Standart Sözleşme Bildirim Modülü** (Kurul kararı 2024/1793) ile
     çevrim içi; alternatif olarak KEP ile veya iadeli taahhütlü posta ile Kişisel Verileri Koruma
     Kurumu'na (Ankara). Bildirime imzalı sözleşmeyi ve imzalayanların yetkisini gösteren belgeyi ekleyin.
4. **Değişiklik olursa yeniden bildirin:** alt işleyen listesi, taraflar veya içerik değişir ya da
   sözleşme sona ererse Kurum'a ayrıca bildirim gerekir.
5. Bu tabloyu güncel tutun:

| Sağlayıcı | Gönderildi | Karşı imza geldi | Kurum'a bildirildi |
|---|---|---|---|
| Google (Firebase) | | | |
| Google (AdMob/AdSense) | | | |
| Sentry | | | |
| RevenueCat | | | |
| Vercel | | | |

## Sağlayıcı imzalamazsa

Büyük sağlayıcılar Türk standart sözleşmesini her zaman imzalamıyor. Bu durumda:

- Yazışmayı (gönderim ve ret/cevapsız kalma) saklayın; uyum için gösterilen çabanın kanıtıdır.
- Kanun bu aktarımlar için başka bir yol tanımıyor: açık rıza yalnızca **arızi** (düzenli olmayan)
  aktarımlarda geçerli (md.9/6), sürekli aktarımlarda dayanak olamaz. Yani imzalanmayan bir sağlayıcı
  için hukuken temiz seçenekler (a) aynı hizmeti sunan ve sözleşmeyi imzalayan başka bir sağlayıcıya
  geçmek ya da (b) o hizmeti kullanmayı bırakmaktır. Sentry gibi vazgeçilebilir hizmetlerde (b) kolay;
  Firebase için (a) büyük bir taşıma işidir.
- Hangi sağlayıcının ne cevap verdiğini öğrendiğinizde bir sonraki adımı birlikte değerlendirebiliriz.

## E-posta taslakları

Her birine ilgili `.docx`'in imzalı PDF'ini ekleyin.

**Sentry** — legal@sentry.io · **RevenueCat** — compliance@revenuecat.com · **Vercel** — privacy@vercel.com
**Google (Firebase)** — Firebase destek talebi (https://firebase.google.com/support) ·
**Google (AdMob/AdSense)** — Google gizlilik/veri koruma iletişim formu

```
Subject: Turkish KVKK Standard Contract for cross-border transfer — signature request

Hello,

I am the data controller of "Yöresel Tarif" (yoreseltarif.com and its iOS/Android apps), a
customer of [SERVICE] based in Türkiye.

Under Article 9 of Turkey's Personal Data Protection Law No. 6698 (as amended by Law No. 7499,
in force since 1 June 2024), transfers of personal data abroad must rely on the standard contract
issued by the Turkish Personal Data Protection Board (Decision 2024/959). EU SCCs and DPAs are not
recognised as a substitute, and the contract text may not be modified.

Attached is the Board's official standard contract [Module 2: Controller to Processor / Module 1:
Controller to Controller], already signed on our side, with Annexes I–III completed for our use of
[SERVICE]. Could you please have it countersigned by an authorised signatory and return a copy?
We are required to notify the Board within five business days of the final signature.

If you already offer a KVKK standard contract or a Türkiye-specific addendum, please point me to
it instead.

Thank you,
Çağatay YILMAZ
Data Controller, Yöresel Tarif
Gültepe Mah. 11. Toptancılar Sk. No:23 Merkez/Sivas, Türkiye
info@yoreseltarif.com
```
