import LegalPageLayout from '@/components/LegalPageLayout'
import ConsentPreferencesButton from '@/components/ConsentPreferencesButton'
// @ts-ignore
import { LEGAL_UPDATED_AT } from '@shared/legalTexts'

export const metadata = { title: 'Çerez Politikası — Yöresel Tarif' }

export default function CerezPolitikasiPage() {
  return (
    <LegalPageLayout emoji="🍪" title="Çerez Politikası" updatedAt={LEGAL_UPDATED_AT}>
      <p>
        Bu sayfa, Yöresel Tarif sitesinde kullanılan çerezleri (cookie) ve tarayıcı depolama alanı
        (localStorage / IndexedDB) gibi benzeri teknolojileri açıklar.
      </p>

      <h2>Çerez Nedir?</h2>
      <p>
        Çerezler ve yerel depolama, bir siteyi ziyaret ettiğinizde tarayıcınıza kaydedilen küçük veri
        parçalarıdır. Sitenin çalışması, tercihlerinizin hatırlanması ve reklam gösterimi için kullanılırlar.
      </p>

      <h2>Zorunlu Depolama (rızaya bağlı değildir)</h2>
      <ul>
        <li><strong>Oturum:</strong> giriş yaptığınızı hatırlamak (Firebase Authentication, IndexedDB)</li>
        <li><strong>Tercihler:</strong> açık/koyu tema ve hızlı filtre tercihleriniz</li>
        <li><strong>İşlevsellik:</strong> giriş yapmadıysanız favorileriniz ve alışveriş listeniz</li>
        <li><strong>Rıza kaydı:</strong> bu sayfadaki çerez/reklam tercihiniz</li>
        <li><strong>Görüntülenme sayacı:</strong> bir tarif veya yazının aynı tarayıcıdan tekrar tekrar sayılmaması için tutulan, kimliğinizi içermeyen yerel kayıt</li>
      </ul>

      <h2>Reklam Çerezleri</h2>
      <p>
        Site, Google AdSense aracılığıyla reklam gösterir. Google, reklam sunmak, gösterim sıklığını
        sınırlamak ve sahtekârlığı önlemek için çerez kullanır.
      </p>
      <ul>
        <li><strong>Açık rıza verirseniz:</strong> ilgi alanlarınıza göre kişiselleştirilmiş reklam gösterilir.</li>
        <li><strong>Rıza vermezseniz veya seçim yapmazsanız:</strong> yalnızca kişiselleştirilmemiş reklam gösterilir.</li>
      </ul>
      <p>
        Ayrıntılar için <a href="/acik-riza-metni" className="underline">Reklam Açık Rıza Metni</a> ve{' '}
        <a href="https://policies.google.com/technologies/ads?hl=tr" className="underline" target="_blank" rel="noopener noreferrer">
          Google&apos;ın reklam politikaları
        </a>
        &apos;na bakabilirsiniz. Sitemizde analitik/izleme çerezi kullanılmamaktadır.
      </p>

      <h2>Tercihlerinizi Yönetme</h2>
      <p>
        Reklam tercihinizi istediğiniz zaman değiştirebilirsiniz: <ConsentPreferencesButton />. Ayrıca
        tarayıcınızın ayarlarından çerezleri ve yerel depolama verilerini silebilirsiniz; bu durumda tema
        tercihiniz ve giriş yapmamış durumdaki favori/alışveriş listeniz sıfırlanır.
      </p>
    </LegalPageLayout>
  )
}
