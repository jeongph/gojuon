import type { Kana } from '../data/types'

export function KanaPill({ kana }: { kana: Kana }) {
  return (
    <span className="kana-pill">
      <span className="kana-pill__glyph">{kana.kana}</span>
      <span className="kana-pill__reading">
        <b>{kana.romaji}</b>
        {kana.korean}
      </span>
    </span>
  )
}
