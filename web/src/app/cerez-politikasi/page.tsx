import LegalPageLayout from '@/components/LegalPageLayout'

export const metadata = { title: 'Çerez Politikası — Yöresel Tarifler' }

export default function CerezPolitikasiPage() {
  return (
    <LegalPageLayout emoji="🍪" title="Çerez Politikası" updatedAt="3 Temmuz 2026">
      <p>
        Bu sayfa, Yöresel Tarifler sitesinde kullanılan çerezleri (cookie) ve benzeri teknolojileri
        (yerel depolama / localStorage) açıklar.
      </p>

      <h2>Çerez Nedir?</h2>
      <p>
        Çerezler, bir siteyi ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır.
        Sitemiz, üçüncü taraf reklam/izleme çerezleri yerine ağırlıklı olarak tarayıcınızın yerel
        depolama alanını (localStorage) kullanır.
      </p>

      <h2>Kullandığımız Teknolojiler</h2>
      <ul>
        <li><strong>Zorunlu:</strong> Oturum açma durumunuzu hatırlamak (Firebase Authentication)</li>
        <li><strong>Tercih:</strong> Dil seçiminiz ve açık/koyu tema tercihiniz</li>
        <li><strong>İşlevsellik:</strong> Favori tarifleriniz ve alışveriş listeniz (giriş yapmadıysanız
          yerel depolamada, giriş yaptıysanız hesabınızla senkronize)</li>
      </ul>
      <p>
        Sitemiz şu an reklam ağları veya analitik takip çerezleri kullanmamaktadır.
      </p>

      <h2>Çerezleri Yönetme</h2>
      <p>
        Tarayıcınızın ayarlarından yerel depolama verilerini istediğiniz zaman temizleyebilirsiniz.
        Bunu yaptığınızda dil/tema tercihiniz ve giriş yapmamış durumdaki favori/alışveriş listeniz
        sıfırlanır.
      </p>
    </LegalPageLayout>
  )
}
