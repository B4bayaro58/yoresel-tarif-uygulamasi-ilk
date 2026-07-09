import LegalPageLayout from '@/components/LegalPageLayout'

export const metadata = { title: 'KVKK Aydınlatma Metni — Yöresel Tarifler' }

export default function KvkkPage() {
  return (
    <LegalPageLayout emoji="🛡️" title="KVKK Aydınlatma Metni" updatedAt="3 Temmuz 2026">
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;<strong>KVKK</strong>&quot;) uyarınca, veri sorumlusu
        sıfatıyla <strong>[Şirket/Şahıs Unvanı]</strong> (&quot;<strong>Yöresel Tarifler</strong>&quot;) olarak kişisel
        verilerinizin işlenmesine ilişkin sizi bilgilendirmek isteriz.
      </p>

      <h2>İşlenen Kişisel Veriler</h2>
      <p>
        Ad-soyad, e-posta adresi, kullanıcı tercihleri (favoriler, alışveriş listesi, dil/tema), tarif
        önerileri ve değerlendirmeleri, teknik kullanım verileri (IP adresi, tarayıcı bilgisi).
      </p>

      <h2>İşleme Amaçları</h2>
      <ul>
        <li>Üyelik ve hesap işlemlerinin yürütülmesi</li>
        <li>Favoriler, alışveriş listesi gibi hizmetlerin sunulması</li>
        <li>Kullanıcı taleplerinin ve önerilerin değerlendirilmesi</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
      </ul>

      <h2>Aktarım</h2>
      <p>
        Verileriniz, barındırma hizmeti aldığımız Google Firebase / Cloudflare gibi altyapı sağlayıcılarına,
        yalnızca hizmetin sunulabilmesi için gerekli ölçüde aktarılabilir. Verileriniz pazarlama amacıyla
        üçüncü kişilerle paylaşılmaz.
      </p>

      <h2>Toplama Yöntemi ve Hukuki Sebep</h2>
      <p>
        Verileriniz, siteye üye olurken ve siteyi kullanırken elektronik ortamda, KVKK m.5/2 kapsamındaki
        &quot;sözleşmenin kurulması/ifası&quot; ve &quot;veri sorumlusunun meşru menfaati&quot; hukuki sebeplerine
        dayanılarak toplanır.
      </p>

      <h2>KVKK Kapsamındaki Haklarınız</h2>
      <p>KVKK&apos;nın 11. maddesi uyarınca şu haklara sahipsiniz:</p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
        <li>Silinmesini veya yok edilmesini isteme</li>
        <li>İşlenen verilerin üçüncü kişilere bildirilmesini isteme</li>
      </ul>
      <p>
        Bu haklarınızı kullanmak için <a href="mailto:info@yoreseltarif.com" className="underline">info@yoreseltarif.com</a> adresine
        yazılı olarak başvurabilirsiniz.
      </p>
    </LegalPageLayout>
  )
}
