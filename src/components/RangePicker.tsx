import { useMemo } from 'react'
import { HIRAGANA_BASIC, HIRAGANA_DAKUON, HIRAGANA_HANDAKUON, HIRAGANA_YOON } from '../data/hiragana'
import type { Kana, KanaRow } from '../data/types'

/**
 * 학습·퀴즈 범위 선택. 행 단위 토글이 시장의 공통 패턴이다.
 * 선택 상태는 행 id 집합으로 들고, 실제 글자 풀은 selectedKana()로 꺼낸다.
 */
export const RANGE_GROUPS: { title: string; rows: KanaRow[] }[] = [
  { title: '기본', rows: HIRAGANA_BASIC },
  { title: '탁음·반탁음', rows: [...HIRAGANA_DAKUON, ...HIRAGANA_HANDAKUON] },
  { title: '요음', rows: HIRAGANA_YOON },
]

const ALL_ROWS = RANGE_GROUPS.flatMap((g) => g.rows)

export function defaultSelection(): Set<string> {
  return new Set(HIRAGANA_BASIC.map((r) => r.id))
}

export function selectedKana(selection: Set<string>): Kana[] {
  return ALL_ROWS.filter((r) => selection.has(r.id)).flatMap((r) => r.kana)
}

type Props = {
  selection: Set<string>
  onChange: (next: Set<string>) => void
}

export function RangePicker({ selection, onChange }: Props) {
  const total = useMemo(() => selectedKana(selection).length, [selection])

  const toggle = (id: string) => {
    const next = new Set(selection)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange(next)
  }

  const setGroup = (rows: KanaRow[], on: boolean) => {
    const next = new Set(selection)
    rows.forEach((r) => (on ? next.add(r.id) : next.delete(r.id)))
    onChange(next)
  }

  return (
    <div className="range">
      {RANGE_GROUPS.map((group) => {
        const count = group.rows.reduce((n, r) => n + r.kana.length, 0)
        return (
          <div className="range__group" key={group.title}>
            <div className="range__group-head">
              <span className="range__group-title">{group.title}</span>
              <span className="range__group-count">{count}자</span>
              <span className="range__group-actions">
                <button type="button" className="range__text-button" onClick={() => setGroup(group.rows, true)}>
                  모두 선택
                </button>
                <button type="button" className="range__text-button" onClick={() => setGroup(group.rows, false)}>
                  해제
                </button>
              </span>
            </div>
            <div className="range__chips">
              {group.rows.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  className="chip"
                  aria-pressed={selection.has(row.id)}
                  onClick={() => toggle(row.id)}
                >
                  <span className="chip__kana">{row.kana[0].kana}</span>
                  {row.id === 'n' ? '' : '행'}
                </button>
              ))}
            </div>
          </div>
        )
      })}
      <p className="range__summary">
        선택한 글자 <strong>{total}자</strong>
      </p>
    </div>
  )
}
