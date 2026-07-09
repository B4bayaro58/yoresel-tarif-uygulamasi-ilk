import LegalPageLayout from '@/components/LegalPageLayout'

export const metadata = { title: 'İçerik Politikası — Yöresel Tarifler' }

export default function IcerikPolitikasiPage() {
  return (
    <LegalPageLayout emoji="📋" title="İçerik Politikası" updatedAt="3 Temmuz 2026">
      <p>
        Bu politika, Yöresel Tarifler sitesindeki tariflerin ve kullanıcı tarafından önerilen
        içeriklerin hangi kurallara göre yayınlandığını açıklar.
      </p>

      <h2>Yayın Kaynakları</h2>
      <p>
        Sitedeki tarifler iki kaynaktan gelir: editör ekibimiz tarafından derlenen yöresel tarifler ve
        kullanıcılar tarafından &quot;Tarif Öner&quot; sayfası üzerinden gönderilen tarifler.
      </p>

      <h2>Kullanıcı Tarafından Önerilen Tarifler</h2>
      <ul>
        <li>Gönderilen her tarif, yayınlanmadan önce editör ekibi tarafından incelenir</li>
        <li>Tarifin size ait olması veya paylaşma hakkınızın bulunması gerekir</li>
        <li>Uygunsuz dil, yanıltıcı bilgi veya telif ihlali içeren tarifler reddedilir</li>
        <li>Onaylanan tarifler, öneren kullanıcının adıyla yayınlanabilir</li>
      </ul>

      <h2>Fotoğraflar</h2>
      <p>
        Tarif fotoğrafları, ya kullanıcılar tarafından yüklenir ya da editör ekibi tarafından temin
        edilir. Yüklediğiniz fotoğrafların telif hakkına sahip olduğunuzu veya kullanım izniniz
        olduğunu kabul edersiniz.
      </p>

      <h2>İçerik Kaldırma</h2>
      <p>
        Telif hakkı ihlali veya uygunsuz içerik bildirimi için{' '}
        <a href="mailto:info@yoreseltarif.com" className="underline">info@yoreseltarif.com</a> adresinden
        bize ulaşabilirsiniz. Bildirimler incelenerek gerekli görülmesi halinde içerik kaldırılır.
      </p>
    </LegalPageLayout>
  )
}
