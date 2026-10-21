# 15 Yaş Sınırı / Yaş Doğrulama (5651 ek 4 + Yönetmelik, yürürlük 1/11/2026)

## Kodda yapılanlar (web + mobil)

- Her hesaptan (mevcutlar dahil) bir kez yaş grubu beyanı: **18+ / 15-17 / 15 altı**
  (`users/{uid}.ageBracket`, `ageDeclaredUnder15`).
- 15 altı: oturum kapatılır; web admin > Kullanıcılar'da **"⚠️ 15 yaş altı"** rozetiyle görünür.
- 15-17 (Yönetmelik md.8): kişiselleştirilmiş reklam yok (rıza sorulmaz), AdMob'a
  `tagForUnderAgeOfConsent`, yorum ve tarif önerilerinde gerçek ad yerine "Yöresel Tarif Kullanıcısı"
  (beyandan önceki yorumlar da güncellenir). Platformda takip/mesaj/canlı yayın/akış zaten yok.
- Ebeveyn bilgilendirme + başvuru/itiraz mekanizması (md.9/5, md.10):
  yoreseltarif.com/ebeveyn-bilgilendirme, uygulamada Profil > Ebeveyn Bilgilendirme.

## Senin yapacakların

1. **Dilekçeyi gönder** (`SGB_Yas_Dogrulama_Basvurusu.docx`): T.C. kimlik no ve telefonu doldur,
   imzala. Gönderim yolları: **CİMER** (cimer.gov.tr — "Başvuru" > ilgili kurum: Siber Güvenlik
   Başkanlığı) veya iadeli taahhütlü posta ile dilekçedeki adrese. Gönderim tarihini ve başvuru
   numarasını sakla — "iyi niyetli uyum çabası"nın (md.11/3) kanıtı.
2. **Rehber gelince** e-Devlet yaş doğrulama belirtecini entegre edeceğiz; mevcut hesaplar için son
   tarih **31/3/2027**.
3. **"⚠️ 15 yaş altı" hesapları sil**: kullanıcı/ebeveyn info@yoreseltarif.com'dan itiraz etmediyse
   (öneri: 30 gün bekle) hesabı ve verilerini sil.
4. **İtiraz/başvuru kaydı tut** (md.10/6): yıl boyunca gelen başvuru sayısı, kabul edilen sayı ve ortalama
   sonuçlandırma süresi. Yılda bir SGB'ye bildirilir ve sitede yayınlanır.
