import LegalPageLayout from '@/components/LegalPageLayout'
import LegalBlocks, { LegalBlock } from '@/components/LegalBlocks'
import ConsentPreferencesButton from '@/components/ConsentPreferencesButton'
// @ts-ignore
import { AD_CONSENT_TEXT, LEGAL_UPDATED_AT } from '@shared/legalTexts'

export const metadata = { title: 'Reklam Açık Rıza Metni — Yöresel Tarif' }

export default function AcikRizaMetniPage() {
  return (
    <LegalPageLayout emoji="✅" title="Kişiselleştirilmiş Reklam Açık Rıza Metni" updatedAt={LEGAL_UPDATED_AT}>
      <LegalBlocks blocks={AD_CONSENT_TEXT as LegalBlock[]} />
      <p>
        <ConsentPreferencesButton />
      </p>
    </LegalPageLayout>
  )
}
