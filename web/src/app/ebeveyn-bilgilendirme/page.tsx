import LegalPageLayout from '@/components/LegalPageLayout'
import LegalBlocks, { LegalBlock } from '@/components/LegalBlocks'
// @ts-ignore
import { PARENT_INFO, LEGAL_UPDATED_AT } from '@shared/legalTexts'

export const metadata = { title: 'Ebeveyn Bilgilendirme ve Yaş Sınırı — Yöresel Tarif' }

// Yaş Doğrulama Yönetmeliği md.8/6 ve md.9/5: çocuklara yönelik tedbirler ve
// ebeveyn kontrol araçları sağlayıcının internet sitesinde yayınlanır.
export default function EbeveynBilgilendirmePage() {
  return (
    <LegalPageLayout emoji="👨‍👩‍👧" title="Ebeveyn Bilgilendirme ve Yaş Sınırı" updatedAt={LEGAL_UPDATED_AT}>
      <LegalBlocks blocks={PARENT_INFO as LegalBlock[]} />
    </LegalPageLayout>
  )
}
