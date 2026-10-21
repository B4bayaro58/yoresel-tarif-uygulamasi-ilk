import LegalPageLayout from '@/components/LegalPageLayout'
// @ts-ignore
import { CONTROLLER, LEGAL_UPDATED_AT } from '@shared/legalTexts'

export const metadata = { title: 'Kullanım Koşulları — Yöresel Tarif' }

export default function KullanimKosullariPage() {
  return (
    <LegalPageLayout emoji="📜" title="Kullanım Koşulları" updatedAt={LEGAL_UPDATED_AT}>
      <p>
        Yöresel Tarif sitesini (&quot;<strong>Site</strong>&quot;) kullanarak aşağıdaki koşulları kabul etmiş
        sayılırsınız. Lütfen siteyi kullanmadan önce bu koşulları dikkatlice okuyun.
      </p>

      <h2>Hizmet Sağlayıcı</h2>
      <p>
        Yöresel Tarif web sitesi ve mobil uygulaması {CONTROLLER.name} tarafından sunulmaktadır.
        Adres: {CONTROLLER.address} — E-posta:{' '}
        <a href={`mailto:${CONTROLLER.email}`} className="underline">{CONTROLLER.email}</a>
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
        Onaylanan tarifler gönderen adı belirtilmeden yayınlanır. Tariflere verdiğiniz yıldız puanları
        anonimdir; yalnızca ortalama puan gösterilir. Ayrıntılar için{' '}
        <a href="/icerik-politikasi" className="underline">İçerik Politikası</a>&apos;na bakın.
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

      <h2>Premium Abonelik (Mobil Uygulama)</h2>
      <p>
        Yöresel Tarif mobil uygulamasındaki Premium, aylık veya yıllık otomatik yenilenen bir aboneliktir ve
        reklamsız kullanım ile ek özellikler sunar. Ödeme, satın alma onaylandığında App Store veya Google Play
        hesabınızdan alınır. Abonelik, dönem bitiminden en az 24 saat önce iptal edilmedikçe aynı ücretle
        otomatik olarak yenilenir; yenileme ücreti dönem bitiminden önceki 24 saat içinde tahsil edilir.
      </p>
      <p>
        Aboneliğinizi App Store veya Google Play hesap ayarlarından yönetebilir ve iptal edebilirsiniz; iptal,
        mevcut dönemin sonunda geçerli olur ve o tarihe kadar Premium özellikleri kullanmaya devam edersiniz.
        İade talepleri ilgili mağazanın (Apple veya Google) iade politikasına tabidir. Uygulamayı silmek
        aboneliği iptal etmez.
      </p>

      <h2>Kişisel Veriler</h2>
      <p>
        Kişisel verileriniz <a href="/kvkk" className="underline">KVKK Aydınlatma Metni</a> ve{' '}
        <a href="/gizlilik-politikasi" className="underline">Gizlilik Politikası</a> kapsamında işlenir.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Bu koşullar zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır.
      </p>
    </LegalPageLayout>
  )
}
