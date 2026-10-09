import LegalPageLayout from '@/components/LegalPageLayout'

export const metadata = { title: 'Hesap ve Veri Silme — Yöresel Tarif' }

export default function HesapSilmePage() {
  return (
    <LegalPageLayout emoji="🗑️" title="Hesap ve Veri Silme" updatedAt="9 Ekim 2026">
      <p>
        Bu sayfa, <strong>Yöresel Tarif</strong> mobil uygulaması (Android ve iOS) ve yoreseltarif.com
        kullanıcılarının hesaplarını ve ilişkili verilerini nasıl silebileceğini açıklar.
      </p>

      <h2>Uygulama İçinden Hesap Silme</h2>
      <ol>
        <li>Yöresel Tarif uygulamasını açın ve hesabınıza giriş yapın.</li>
        <li>Alt menüden <strong>Profil</strong> sekmesine gidin.</li>
        <li>Sayfanın en altındaki <strong>Hesabı Sil</strong> düğmesine dokunun.</li>
        <li>Kimliğinizi doğrulayın ve silme işlemini onaylayın.</li>
      </ol>
      <p>Hesabınız ve aşağıda listelenen verileriniz anında ve kalıcı olarak silinir.</p>

      <h2>E-posta ile Silme Talebi</h2>
      <p>
        Uygulamaya erişiminiz yoksa, hesabınızda kayıtlı e-posta adresinden{' '}
        <a href="mailto:info@yoreseltarif.com?subject=Hesap%20silme%20talebi" className="underline">
          info@yoreseltarif.com
        </a>{' '}
        adresine &quot;Hesap silme talebi&quot; konulu bir e-posta gönderin. Talebiniz en geç 30 gün içinde
        işleme alınır ve size bilgi verilir. Hesabınızı silmeden yalnızca belirli verilerinizin (ör.
        yorumlarınız) silinmesini de aynı adresten talep edebilirsiniz.
      </p>

      <h2>Silinen Veriler</h2>
      <ul>
        <li>Hesap bilgileriniz (ad, e-posta adresi, profil fotoğrafı)</li>
        <li>Favorileriniz, alışveriş listeniz ve tercihleriniz</li>
        <li>Yazdığınız yorumlar ve puanlar</li>
        <li>Gönderdiğiniz tarifler ve bu tariflere ait fotoğraflar</li>
      </ul>

      <h2>Saklanan Veriler</h2>
      <ul>
        <li>
          Kimliğinizle ilişkilendirilmemiş, toplu istatistikler (ör. bir tarifin toplam görüntülenme sayısı)
          saklanmaya devam eder.
        </li>
        <li>
          Premium abonelik satın alma kayıtları, yasal ve mali yükümlülükler nedeniyle Google Play / App
          Store ve ödeme altyapısı sağlayıcımız tarafından ilgili mevzuatın öngördüğü süre boyunca saklanır.
          Aboneliğinizi iptal etmek için Google Play veya App Store abonelik ayarlarını kullanmalısınız;
          hesap silme aboneliği otomatik olarak iptal etmez.
        </li>
        <li>Teknik hata kayıtları, hata izleme sağlayıcımızın saklama süresi (en fazla 90 gün) sonunda otomatik olarak silinir.</li>
      </ul>
    </LegalPageLayout>
  )
}
