import { useState } from 'react'
import { CloseIcon } from '../../components/Icons'
import { SpeakButton } from '../../components/SpeakButton'
import { StrokeOrder, StrokePlayButton, strokeCountLabel } from '../../components/StrokeOrder'
import type { Kana } from '../../data/types'
import { strokeGlyphs } from '../../lib/strokes'

type Props = {
  kana: Kana | null
  asSheet?: boolean
  onClose?: () => void
}

export function KanaDetail({ kana, asSheet = false, onClose }: Props) {
  const className = asSheet ? 'detail detail--sheet' : 'detail'

  if (!kana) {
    return (
      <aside className={className} aria-live="polite">
        <p className="detail__empty">표에서 글자를 누르면 발음과 모양 힌트가 여기에 나옵니다.</p>
      </aside>
    )
  }

  return (
    <aside className={className} aria-live="polite" aria-label={`${kana.kana} 상세`}>
      {asSheet && onClose && (
        <button type="button" className="icon-button detail__close" onClick={onClose} aria-label="닫기">
          <CloseIcon />
        </button>
      )}
      <div className="detail__head">
        <span className="detail__glyph kana" lang="ja">
          {kana.kana}
        </span>
        <div className="detail__reading">
          <span className="detail__romaji">{kana.romaji}</span>
          <span className="detail__korean">{kana.korean}</span>
          {kana.alt.length > 0 && <span className="detail__alt">또는 {kana.alt.join(', ')}</span>}
        </div>
      </div>

      <div className="detail__actions">
        <SpeakButton text={kana.kana} />
      </div>

      {/* 글자가 바뀌면 재생 상태를 처음으로 되돌리기 위해 key를 건다 */}
      <StrokeBlock key={kana.id} kana={kana} />

      {kana.hint && (
        <div className="detail__block">
          <span className="detail__block-title">모양 힌트</span>
          <p className="detail__text">{kana.hint}</p>
        </div>
      )}

      {kana.note && (
        <div className="detail__block">
          <span className="detail__block-title">발음 메모</span>
          <p className="detail__text">{kana.note}</p>
        </div>
      )}

      {kana.example && (
        <div className="detail__block">
          <span className="detail__block-title">예시 단어</span>
          <div className="detail__example">
            <span className="detail__example-word" lang="ja">
              {kana.example.word}
            </span>
            <span className="detail__example-reading">{kana.example.reading}</span>
            <span className="detail__example-meaning">{kana.example.meaning}</span>
          </div>
          <div className="detail__actions">
            <SpeakButton text={kana.example.word} label="단어 듣기" />
          </div>
        </div>
      )}
    </aside>
  )
}

function StrokeBlock({ kana }: { kana: Kana }) {
  const [run, setRun] = useState(0)
  const glyphs = strokeGlyphs(kana.kana)
  if (glyphs.length === 0) return null

  return (
    <div className="detail__block">
      <span className="detail__block-title">획순</span>
      <div className="detail__strokes">
        <StrokeOrder kana={kana.kana} size={glyphs.length > 1 ? 88 : 112} run={run} />
        <div className="detail__strokes-side">
          <span className="detail__strokes-count">{strokeCountLabel(kana.kana)}</span>
          <StrokePlayButton again={run > 0} onClick={() => setRun((r) => r + 1)} />
        </div>
      </div>
    </div>
  )
}
