import { useEffect, useMemo, useState } from 'react'
import { Segmented } from '../../components/Segmented'
import { HIRAGANA_BASIC, HIRAGANA_DAKUON, HIRAGANA_HANDAKUON, HIRAGANA_YOON } from '../../data/hiragana'
import type { Kana, Vowel } from '../../data/types'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { KanaDetail } from './KanaDetail'
import { KanaGrid } from './KanaGrid'

type Tab = 'basic' | 'daku' | 'yoon'

const TABS: { value: Tab; label: string }[] = [
  { value: 'basic', label: '기본 46자' },
  { value: 'daku', label: '탁음·반탁음' },
  { value: 'yoon', label: '요음' },
]

const GOJUON: Vowel[] = ['a', 'i', 'u', 'e', 'o']
const YOON: Vowel[] = ['ya', 'yu', 'yo']

function rowsFor(tab: Tab) {
  switch (tab) {
    case 'basic':
      return { rows: HIRAGANA_BASIC, cols: GOJUON }
    case 'daku':
      return { rows: [...HIRAGANA_DAKUON, ...HIRAGANA_HANDAKUON], cols: GOJUON }
    case 'yoon':
      return { rows: HIRAGANA_YOON, cols: YOON }
  }
}

export function ChartPage() {
  const [tab, setTab] = useState<Tab>('basic')
  const { rows, cols } = useMemo(() => rowsFor(tab), [tab])
  const flat = useMemo(() => rows.flatMap((r) => r.kana), [rows])
  const isDesktop = useMediaQuery('(min-width: 900px)')

  // 데스크톱은 첫 글자를 미리 보여 주고, 모바일은 사용자가 누를 때만 시트를 연다.
  const [selected, setSelected] = useState<Kana | null>(() => (isDesktop ? HIRAGANA_BASIC[0].kana[0] : null))
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    setSelected(isDesktop ? flat[0] : null)
    setSheetOpen(false)
  }, [tab, isDesktop, flat])

  useEffect(() => {
    if (!isDesktop) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (document.activeElement instanceof HTMLInputElement) return
      const idx = selected ? flat.findIndex((k) => k.id === selected.id) : -1
      const next = e.key === 'ArrowRight' ? Math.min(flat.length - 1, idx + 1) : Math.max(0, idx - 1)
      setSelected(flat[next])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flat, selected, isDesktop])

  const select = (k: Kana) => {
    setSelected(k)
    if (!isDesktop) setSheetOpen(true)
  }

  const closeSheet = () => {
    setSheetOpen(false)
    setSelected(null)
  }

  return (
    <section aria-labelledby="chart-title">
      <div className="page-head">
        <h1 className="page-title" id="chart-title">
          오십음도
        </h1>
        <p className="page-lead">
          가로는 같은 자음(행), 세로는 같은 모음(단)입니다. 글자를 누르면 발음과 획순을 볼 수 있습니다.
        </p>
      </div>

      <div className="chart__toolbar">
        <Segmented value={tab} options={TABS} onChange={setTab} aria-label="글자 세트" />
        {isDesktop && <span className="chart__tip">방향키로 글자를 옮겨 볼 수 있습니다</span>}
      </div>

      <div className="chart">
        <KanaGrid rows={rows} cols={cols} selectedId={selected?.id ?? null} onSelect={select} />

        {isDesktop && <KanaDetail kana={selected} />}

        {!isDesktop && sheetOpen && (
          <>
            <div className="sheet-backdrop" onClick={closeSheet} aria-hidden="true" />
            <KanaDetail kana={selected} asSheet onClose={closeSheet} />
          </>
        )}
      </div>
    </section>
  )
}
