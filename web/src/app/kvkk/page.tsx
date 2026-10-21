import LegalPageLayout from '@/components/LegalPageLayout'
import LegalBlocks, { LegalBlock } from '@/components/LegalBlocks'
// @ts-ignore
import { KVKK_AYDINLATMA, LEGAL_UPDATED_AT } from '@shared/legalTexts'

export const metadata = { title: 'KVKK Aydınlatma Metni — Yöresel Tarif' }

export default function KvkkPage() {
  return (
    <LegalPageLayout emoji="🛡️" title="KVKK Aydınlatma Metni" updatedAt={LEGAL_UPDATED_AT}>
      <LegalBlocks blocks={KVKK_AYDINLATMA as LegalBlock[]} />
    </LegalPageLayout>
  )
}
