import LegalPageLayout from '@/components/LegalPageLayout'
// @ts-ignore
import { CONTROLLER, LEGAL_UPDATED_AT } from '@shared/legalTexts'

export const metadata = { title: 'İçerik Politikası — Yöresel Tarif' }

export default function IcerikPolitikasiPage() {
  return (
    <LegalPageLayout emoji="📋" title="İçerik Politikası" updatedAt={LEGAL_UPDATED_AT}>
      <p>
        Bu politika, Yöresel Tarif sitesindeki ve uygulamasındaki tariflerin ve kullanıcı tarafından
        paylaşılan içeriklerin hangi kurallara göre yayınlandığını ve hukuka aykırı içeriklerin nasıl
        bildirilebileceğini açıklar.
      </p>

      <h2>Yayın Kaynakları</h2>
      <p>
        Sitedeki tarifler iki kaynaktan gelir: editör ekibimiz tarafından derlenen yöresel tarifler ve
        kullanıcılar tarafından &quot;Tarif Öner&quot; özelliğiyle gönderilen tarifler. Kullanıcılar ayrıca
        tariflere yorum, puan ve fotoğraf ekleyebilir.
      </p>

      <h2>Kullanıcı İçerikleri</h2>
      <ul>
        <li>Gönderilen her tarif, yayınlanmadan önce editör ekibi tarafından incelenir</li>
        <li>İçeriğin size ait olması veya paylaşma hakkınızın bulunması gerekir</li>
        <li>Hakaret, taciz, nefret söylemi, yanıltıcı bilgi, kişisel veri (başkasına ait telefon, adres vb.), müstehcenlik veya telif ihlali içeren içerikler yayınlanmaz ya da kaldırılır</li>
        <li>Onaylanan tarifler ve yorumlar, paylaşan kullanıcının görünen adıyla yayınlanır</li>
        <li>Kurallara aykırı içerik paylaşan hesaplar engellenebilir</li>
      </ul>

      <h2>Fotoğraflar</h2>
      <p>
        Tarif fotoğrafları, ya kullanıcılar tarafından yüklenir ya da editör ekibi tarafından temin
        edilir. Yüklediğiniz fotoğrafların telif hakkına sahip olduğunuzu veya kullanım izniniz
        olduğunu kabul edersiniz.
      </p>

      <h2>Hukuka Aykırı İçerik Bildirimi</h2>
      <p>
        Bir yorumu uygulamadaki &quot;Bildir&quot; düğmesiyle şikâyet edebilir, yorum sahibini engelleyebilirsiniz.
        Kişilik haklarınızı, özel hayatınızı veya telif hakkınızı ihlal ettiğini düşündüğünüz bir içerik için{' '}
        <a href={`mailto:${CONTROLLER.email}`} className="underline">{CONTROLLER.email}</a> adresine; içeriğin
        bağlantısını (URL), ihlalin açıklamasını ve kimlik/iletişim bilgilerinizi içeren bir bildirim
        gönderebilirsiniz. Bildirimler en kısa sürede incelenir; hukuka aykırı bulunan içerik yayından
        kaldırılır ve size bilgi verilir. 5651 sayılı Kanun kapsamında yetkili makamlarca verilen içeriğin
        çıkarılması ve erişimin engellenmesi kararları derhal uygulanır.
      </p>
    </LegalPageLayout>
  )
}
