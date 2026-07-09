import LegalPageLayout from '@/components/LegalPageLayout'

export const metadata = { title: 'Hakkımızda — Yöresel Tarifler' }

export default function HakkimizdaPage() {
  return (
    <LegalPageLayout emoji="🍽️" title="Hakkımızda" updatedAt="3 Temmuz 2026">
      <p>
        Yöresel Tarifler, dünyanın dört bir yanından ve Türkiye&apos;nin her köşesinden derlenen
        yöresel lezzetleri tek bir platformda buluşturmak amacıyla kuruldu. Amacımız, geleneksel
        tarifleri kaybolmadan gelecek nesillere aktarmak ve mutfağınıza yeni lezzetler kazandırmak.
      </p>

      <h2>Neler Sunuyoruz?</h2>
      <ul>
        <li>8 kıtadan özenle seçilmiş yüzlerce yöresel tarif</li>
        <li>Türkiye&apos;nin şehirlerine özgü otantik lezzetler</li>
        <li>Favori tariflerinizi kaydetme ve alışveriş listesi oluşturma</li>
        <li>Kullanıcılar tarafından önerilen ve topluluk tarafından zenginleştirilen içerik</li>
      </ul>

      <h2>Ekibimiz</h2>
      <p>
        Küçük ama tutkulu bir ekip olarak, her tarifin doğruluğunu ve lezzetini önemsiyoruz. Sorularınız
        veya önerileriniz için <a href="/iletisim" className="underline">iletişim</a> sayfamızdan bize
        ulaşabilirsiniz.
      </p>
    </LegalPageLayout>
  )
}
