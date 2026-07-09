import LegalPageLayout from '@/components/LegalPageLayout'

export const metadata = { title: 'Gizlilik Politikası — Yöresel Tarifler' }

export default function GizlilikPolitikasiPage() {
  return (
    <LegalPageLayout emoji="🔒" title="Gizlilik Politikası" updatedAt="3 Temmuz 2026">
      <p>
        Yöresel Tarifler (&quot;<strong>Site</strong>&quot;) olarak kullanıcılarımızın gizliliğine önem veriyoruz.
        Bu Gizlilik Politikası, siteyi kullanırken hangi kişisel verilerin toplandığını, nasıl kullanıldığını
        ve nasıl korunduğunu açıklar.
      </p>

      <h2>Topladığımız Veriler</h2>
      <ul>
        <li>Hesap oluştururken verdiğiniz ad, e-posta adresi</li>
        <li>Favori tarifleriniz, alışveriş listeleriniz ve dil/tema tercihleriniz</li>
        <li>Tarif değerlendirmeleri ve yorumlarınız</li>
        <li>Site kullanımına dair temel teknik veriler (tarayıcı türü, IP adresi)</li>
      </ul>

      <h2>Verilerin Kullanım Amacı</h2>
      <p>
        Toplanan veriler yalnızca hesabınızı yönetmek, favori ve alışveriş listesi gibi özellikleri
        çalıştırmak, size daha iyi bir deneyim sunmak ve yasal yükümlülüklerimizi yerine getirmek
        amacıyla kullanılır. Verileriniz üçüncü taraflara satılmaz veya pazarlama amacıyla kiralanmaz.
      </p>

      <h2>Verilerin Saklanması</h2>
      <p>
        Verileriniz, Google Firebase altyapısı üzerinde şifreli olarak saklanır. Hesabınızı sildiğinizde
        kişisel verileriniz makul bir süre içinde sistemlerimizden kaldırılır.
      </p>

      <h2>Haklarınız</h2>
      <p>
        6698 sayılı KVKK ve ilgili mevzuat kapsamındaki haklarınız için{' '}
        <a href="/kvkk" className="underline">KVKK Aydınlatma Metni</a> sayfamızı inceleyebilir, taleplerinizi{' '}
        <a href="mailto:info@yoreseltarif.com" className="underline">info@yoreseltarif.com</a> adresine
        iletebilirsiniz.
      </p>

      <h2>İletişim</h2>
      <p>
        Bu politika ile ilgili sorularınız için <a href="mailto:info@yoreseltarif.com" className="underline">info@yoreseltarif.com</a> adresinden
        bize ulaşabilirsiniz.
      </p>
    </LegalPageLayout>
  )
}
