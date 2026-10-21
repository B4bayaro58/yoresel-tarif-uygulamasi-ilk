import LegalPageLayout from '@/components/LegalPageLayout'
// @ts-ignore
import { CONTROLLER, LEGAL_UPDATED_AT } from '@shared/legalTexts'

export const metadata = { title: 'Gizlilik Politikası — Yöresel Tarif' }

export default function GizlilikPolitikasiPage() {
  return (
    <LegalPageLayout emoji="🔒" title="Gizlilik Politikası" updatedAt={LEGAL_UPDATED_AT}>
      <p>
        Bu Gizlilik Politikası, Yöresel Tarif web sitesi ve mobil uygulamasını kullanırken hangi verilerin
        toplandığını, nasıl kullanıldığını ve nasıl korunduğunu özetler. 6698 sayılı KVKK kapsamındaki
        ayrıntılı bilgilendirme için <a href="/kvkk" className="underline">KVKK Aydınlatma Metni</a>&apos;ni inceleyin.
      </p>

      <h2>Veri Sorumlusu</h2>
      <p>
        {CONTROLLER.name} — {CONTROLLER.address} — <a href={`mailto:${CONTROLLER.email}`} className="underline">{CONTROLLER.email}</a>
      </p>

      <h2>Topladığımız Veriler</h2>
      <ul>
        <li>Hesap oluştururken verdiğiniz ad ve e-posta adresi (veya Google/Apple hesabınızdan gelen ad, e-posta ve profil fotoğrafı)</li>
        <li>Favorileriniz, alışveriş listeniz, dil ve tema tercihleriniz</li>
        <li>Gönderdiğiniz tarif önerileri ve fotoğrafları, verdiğiniz yıldız puanları ve hata bildirimleri</li>
        <li>Teknik veriler: hesap kimliği, hizmet sağlayıcıların sunucu kayıtlarındaki IP adresi</li>
        <li>Reklam verileri: reklam çerezleri ve reklam tanımlayıcısı (kişiselleştirilmiş reklam yalnızca açık rızanızla)</li>
      </ul>

      <h2>Verilerin Kullanım Amacı</h2>
      <p>
        Verileriniz hesabınızı yönetmek, favori ve alışveriş listesi gibi özellikleri çalıştırmak, tarif
        önerilerini incelemek, güvenliği sağlamak, reklam göstermek ve yasal
        yükümlülüklerimizi yerine getirmek amacıyla kullanılır. Verileriniz satılmaz.
      </p>

      <h2>Reklamlar</h2>
      <p>
        Site ve uygulamada Google AdSense ve AdMob reklamları gösterilir. Açık rıza vermediğiniz sürece size
        yalnızca kişiselleştirilmemiş reklam gösterilir. Tercihinizi sitede sayfanın altındaki &quot;Çerez
        Tercihleri&quot;, uygulamada Profil &gt; Reklam Tercihleri üzerinden istediğiniz zaman değiştirebilirsiniz
        (bkz. <a href="/acik-riza-metni" className="underline">Reklam Açık Rıza Metni</a>).
      </p>

      <h2>Hizmet Sağlayıcılar ve Yurt Dışına Aktarım</h2>
      <p>
        Verileriniz Google (Firebase, AdMob, AdSense, Google ile Giriş), Apple (Apple ile Giriş, App Store),
        Vercel (web barındırma) ve RevenueCat (abonelik yönetimi) altyapılarında
        işlenir. Bu sağlayıcıların sunucuları yurt dışındadır; aktarım KVKK md.9&apos;a uygun olarak yapılır.
      </p>

      <h2>Saklama ve Silme</h2>
      <p>
        Verileriniz hesabınız açık olduğu sürece saklanır. Hesabınızı sildiğinizde hesap kaydınız, puanlarınız,
        tarif önerileriniz, hata bildirimleriniz ve yüklediğiniz fotoğraflar silinir. Hesap silme adımları için{' '}
        <a href="/hesap-silme" className="underline">Hesap Silme</a> sayfasına bakın.
      </p>

      <h2>Haklarınız ve İletişim</h2>
      <p>
        KVKK md.11 kapsamındaki haklarınızı kullanmak için başvuru yöntemi{' '}
        <a href="/kvkk" className="underline">KVKK Aydınlatma Metni</a>&apos;nde yer alır. Sorularınız için{' '}
        <a href={`mailto:${CONTROLLER.email}`} className="underline">{CONTROLLER.email}</a> adresine yazabilirsiniz.
      </p>
    </LegalPageLayout>
  )
}
