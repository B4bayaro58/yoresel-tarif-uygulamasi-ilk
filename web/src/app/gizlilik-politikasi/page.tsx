import LegalPageLayout from '@/components/LegalPageLayout'
// @ts-ignore
import { CONTROLLER, LEGAL_UPDATED_AT, MIN_AGE } from '@shared/legalTexts'

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
        <li>Gönderdiğiniz tarifler, yorumlar, puanlar, fotoğraflar, hata bildirimleri ve şikâyetler</li>
        <li>{MIN_AGE} yaşından büyük olduğunuza dair beyanınız</li>
        <li>Teknik veriler: hesap kimliği, hata kayıtları, hizmet sağlayıcıların sunucu kayıtlarındaki IP adresi</li>
        <li>Reklam verileri: reklam çerezleri ve reklam tanımlayıcısı (kişiselleştirilmiş reklam yalnızca açık rızanızla)</li>
      </ul>

      <h2>Verilerin Kullanım Amacı</h2>
      <p>
        Verileriniz hesabınızı yönetmek, favori ve alışveriş listesi gibi özellikleri çalıştırmak, kullanıcı
        içeriklerini incelemek, hataları tespit etmek, güvenliği sağlamak, reklam göstermek ve yasal
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
        Vercel (web barındırma), Sentry (hata raporlama) ve RevenueCat (abonelik yönetimi) altyapılarında
        işlenir. Bu sağlayıcıların sunucuları yurt dışındadır; aktarım KVKK md.9&apos;a uygun olarak yapılır.
      </p>

      <h2>Saklama ve Silme</h2>
      <p>
        Verileriniz hesabınız açık olduğu sürece saklanır. Hesabınızı sildiğinizde hesap kaydınız, yorumlarınız,
        tarifleriniz, hata bildirimleriniz ve yüklediğiniz fotoğraflar silinir. Hesap silme adımları için{' '}
        <a href="/hesap-silme" className="underline">Hesap Silme</a> sayfasına bakın.
      </p>

      <h2>Yaş Sınırı</h2>
      <p>
        Hesap oluşturmak ve yorum/tarif paylaşmak için {MIN_AGE} yaşından büyük olmanız gerekir. Tarifler üye
        olmadan herkes tarafından görüntülenebilir.
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
