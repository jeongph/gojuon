import type { CSSProperties } from 'react'
import type { Kana, KanaRow, Vowel } from '../../data/types'

const COL_LABELS: Record<Vowel, { kana: string; romaji: string }> = {
  a: { kana: 'あ', romaji: 'a' },
  i: { kana: 'い', romaji: 'i' },
  u: { kana: 'う', romaji: 'u' },
  e: { kana: 'え', romaji: 'e' },
  o: { kana: 'お', romaji: 'o' },
  ya: { kana: 'ゃ', romaji: 'ya' },
  yu: { kana: 'ゅ', romaji: 'yu' },
  yo: { kana: 'ょ', romaji: 'yo' },
}

type Props = {
  rows: KanaRow[]
  cols: Vowel[]
  selectedId: string | null
  onSelect: (kana: Kana) => void
}

export function KanaGrid({ rows, cols, selectedId, onSelect }: Props) {
  return (
    <div className="grid" style={{ '--cols': cols.length } as CSSProperties} role="grid" aria-label="오십음도">
      <div className="grid__corner" aria-hidden="true" />
      {cols.map((c) => (
        <div className="grid__col-head" key={c} role="columnheader">
          <span className="kana">{COL_LABELS[c].kana}</span>
          {COL_LABELS[c].romaji}
        </div>
      ))}
      {rows.map((row) => (
        <Row key={row.id} row={row} cols={cols} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  )
}

/** 행 머리글에 쓸 자음 부분. あ행처럼 자음이 없으면 빈 문자열. */
function consonantOf(romaji: string): string {
  return romaji.replace(/[aiueo]+$/, '')
}

function Row({ row, cols, selectedId, onSelect }: { row: KanaRow } & Omit<Props, 'rows'>) {
  const byCol = new Map(row.kana.map((k) => [k.col, k]))
  const isN = row.id === 'n'
  return (
    <>
      <div className="grid__row-head" role="rowheader">
        {isN ? (
          <small>받침</small>
        ) : (
          <>
            <span className="kana">{row.kana[0].kana}</span>
            {consonantOf(row.kana[0].romaji) && <small>{consonantOf(row.kana[0].romaji)}</small>}
          </>
        )}
      </div>
      {cols.map((c) => {
        const k = byCol.get(c)
        if (!k) return <div className="cell cell--empty" key={c} aria-hidden="true" />
        return (
          <button
            key={k.id}
            type="button"
            role="gridcell"
            className="cell"
            aria-pressed={k.id === selectedId}
            aria-label={`${k.kana} ${k.romaji} ${k.korean}`}
            onClick={() => onSelect(k)}
          >
            <span className="cell__kana kana">{k.kana}</span>
            <span className="cell__romaji">{k.romaji}</span>
          </button>
        )
      })}
    </>
  )
}
