// `@shared/legalTexts` blok dizisini (h / p / ul) LegalPageLayout içinde
// render eder -- mobil uygulama aynı diziyi kendi ekranında gösteriyor.
export type LegalBlock = { h?: string; p?: string; ul?: string[] }

export default function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.h) return <h2 key={i}>{b.h}</h2>
        if (b.ul) return <ul key={i}>{b.ul.map((item, j) => <li key={j}>{item}</li>)}</ul>
        return <p key={i}>{b.p}</p>
      })}
    </>
  )
}
