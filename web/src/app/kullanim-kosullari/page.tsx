import LegalPageLayout from '@/components/LegalPageLayout'

export const metadata = { title: 'Kullanım Koşulları — Yöresel Tarifler' }

export default function KullanimKosullariPage() {
  return (
    <LegalPageLayout emoji="📜" title="Kullanım Koşulları" updatedAt="3 Temmuz 2026">
      <p>
        Yöresel Tarifler sitesini (&quot;<strong>Site</strong>&quot;) kullanarak aşağıdaki koşulları kabul etmiş
        sayılırsınız. Lütfen siteyi kullanmadan önce bu koşulları dikkatlice okuyun.
      </p>

      <h2>Hesap Sorumluluğu</h2>
      <p>
        Hesabınızla ilgili bilgilerin (e-posta, şifre) gizliliğinden siz sorumlusunuz. Hesabınız üzerinden
        gerçekleştirilen tüm işlemlerden sorumlu tutulursunuz.
      </p>

      <h2>İçerik Paylaşımı</h2>
      <p>
        &quot;Tarif Öner&quot; özelliği ile paylaştığınız tarifler, yayınlanmadan önce editör ekibimiz tarafından
        incelenir. Paylaştığınız içeriğin size ait olduğunu veya paylaşma hakkına sahip olduğunuzu kabul
        edersiniz. Uygunsuz, yanıltıcı veya telif hakkı ihlali içeren tarifler yayınlanmadan reddedilir.
      </p>

      <h2>Yasaklı Kullanımlar</h2>
      <ul>
        <li>Siteyi otomatik araçlarla (bot, scraper) aşırı yüklemek</li>
        <li>Başka kullanıcıların hesaplarına yetkisiz erişim sağlamaya çalışmak</li>
        <li>Hakaret, taciz veya yanıltıcı içerik paylaşmak</li>
      </ul>

      <h2>Sorumluluğun Sınırlandırılması</h2>
      <p>
        Sitedeki tarifler bilgilendirme amaçlıdır. Alerji, beslenme kısıtlaması veya sağlık durumunuz
        varsa tarifleri uygulamadan önce kendi değerlendirmenizi yapmanızı öneririz. Site, tariflerin
        uygulanmasından doğacak sonuçlardan sorumlu tutulamaz.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Bu koşullar zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır.
      </p>
    </LegalPageLayout>
  )
}
