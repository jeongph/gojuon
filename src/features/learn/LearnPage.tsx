import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { KanaPill } from '../../components/KanaPill'
import { Progress } from '../../components/Progress'
import { RangePicker, defaultSelection, selectedKana } from '../../components/RangePicker'
import { Segmented } from '../../components/Segmented'
import { SpeakButton } from '../../components/SpeakButton'
import { StrokeOrder, StrokePlayButton } from '../../components/StrokeOrder'
import type { Kana } from '../../data/types'
import { hrefFor } from '../../hooks/useHashRoute'
import { shuffle } from '../../lib/quiz'
import { strokeGlyphs } from '../../lib/strokes'

type Front = 'kana' | 'reading'
type Order = 'chart' | 'shuffle'
type Phase = 'setup' | 'study' | 'done'

type StudyState = {
  queue: Kana[]
  total: number
  known: Kana[]
  again: Kana[]
  flipped: boolean
}

export function LearnPage() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [selection, setSelection] = useState<Set<string>>(defaultSelection)
  const [front, setFront] = useState<Front>('kana')
  const [order, setOrder] = useState<Order>('chart')
  const [study, setStudy] = useState<StudyState | null>(null)

  const pool = useMemo(() => selectedKana(selection), [selection])

  const begin = useCallback(
    (cards: Kana[]) => {
      const queue = order === 'shuffle' ? shuffle(cards) : cards.slice()
      setStudy({ queue, total: queue.length, known: [], again: [], flipped: false })
      setPhase('study')
    },
    [order],
  )

  const answer = useCallback((knew: boolean) => {
    setStudy((s) => {
      if (!s || s.queue.length === 0) return s
      const [current, ...rest] = s.queue
      const alreadyAgain = s.again.some((k) => k.id === current.id)
      const next: StudyState = {
        ...s,
        flipped: false,
        queue: knew ? rest : [...rest, current],
        known: knew && !alreadyAgain ? [...s.known, current] : s.known,
        again: !knew && !alreadyAgain ? [...s.again, current] : s.again,
      }
      return next
    })
  }, [])

  useEffect(() => {
    if (phase === 'study' && study && study.queue.length === 0) setPhase('done')
  }, [phase, study])

  useEffect(() => {
    if (phase !== 'study') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setStudy((s) => (s ? { ...s, flipped: !s.flipped } : s))
      } else if (e.key === '1' || e.key === 'ArrowLeft') {
        answer(false)
      } else if (e.key === '2' || e.key === 'ArrowRight') {
        answer(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, answer])

  if (phase === 'study' && study && study.queue.length > 0) {
    const current = study.queue[0]
    const done = study.total - study.queue.length
    return (
      <section className="learn" aria-labelledby="learn-title">
        <h1 className="visually-hidden" id="learn-title">
          카드 학습
        </h1>
        <div className="learn__status">
          <span>
            <strong>{done + 1}</strong> / {study.total}
          </span>
          <span className="learn__status-right">
            {study.again.length > 0 && <span>다시 볼 카드 {study.again.length}장</span>}
            <Button variant="ghost" onClick={() => setPhase('setup')}>
              그만하기
            </Button>
          </span>
        </div>
        <Progress value={done} max={study.total} label="학습 진행" />

        <div className="card-stage">
          <Flashcard key={current.id} kana={current} front={front} flipped={study.flipped} onFlip={() => setStudy((s) => (s ? { ...s, flipped: !s.flipped } : s))} />
          <div className="learn__answers">
            <Button onClick={() => answer(false)}>
              다시 볼게요 <kbd>1</kbd>
            </Button>
            <Button variant="primary" onClick={() => answer(true)}>
              알아요 <kbd>2</kbd>
            </Button>
          </div>
          <p className="learn__keys">스페이스로 뒤집고, 1과 2로 답합니다</p>
        </div>
      </section>
    )
  }

  if (phase === 'done' && study) {
    const firstTry = study.known.length
    return (
      <section className="summary" aria-labelledby="learn-title">
        <div>
          <h1 className="page-title" id="learn-title">
            한 바퀴 끝
          </h1>
          <p className="page-lead">선택한 {study.total}자를 모두 넘겼습니다.</p>
        </div>
        <div className="summary__score">
          <span className="summary__score-value">{firstTry}</span>
          <span className="summary__score-label">자는 한 번에 알아봤습니다</span>
        </div>
        {study.again.length > 0 && (
          <div>
            <p className="summary__section-title">다시 본 글자 {study.again.length}자</p>
            <div className="summary__kana-list">
              {study.again.map((k) => (
                <KanaPill key={k.id} kana={k} />
              ))}
            </div>
          </div>
        )}
        <div className="btn-row">
          {study.again.length > 0 && (
            <Button variant="primary" size="large" onClick={() => begin(study.again)}>
              다시 본 글자만 복습
            </Button>
          )}
          <Button size="large" onClick={() => begin(pool)}>
            처음부터 다시
          </Button>
          <Button variant="ghost" size="large" onClick={() => setPhase('setup')}>
            범위 바꾸기
          </Button>
          <a className="btn btn--ghost btn--large" href={hrefFor('quiz')}>
            퀴즈로 확인하기
          </a>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="learn-title">
      <div className="page-head">
        <h1 className="page-title" id="learn-title">
          카드 학습
        </h1>
        <p className="page-lead">
          카드를 뒤집기 전에 소리를 먼저 떠올려 보세요. 바로 떠오르지 않은 글자는 뒤로 밀려 다시 나옵니다.
        </p>
      </div>
      <div className="setup">
        <div className="setup__section">
          <span className="setup__label">범위</span>
          <RangePicker selection={selection} onChange={setSelection} />
        </div>
        <div className="setup__section">
          <span className="setup__label">앞면</span>
          <p className="setup__hint">처음에는 가나를 보고 소리를 떠올리고, 익숙해지면 반대로 연습합니다.</p>
          <Segmented
            value={front}
            onChange={setFront}
            aria-label="카드 앞면"
            options={[
              { value: 'kana', label: '가나를 보고 소리 떠올리기' },
              { value: 'reading', label: '소리를 보고 가나 떠올리기' },
            ]}
          />
        </div>
        <div className="setup__section">
          <span className="setup__label">순서</span>
          <Segmented
            value={order}
            onChange={setOrder}
            aria-label="카드 순서"
            options={[
              { value: 'chart', label: '표 순서대로' },
              { value: 'shuffle', label: '섞어서' },
            ]}
          />
        </div>
        <div className="setup__footer">
          <Button variant="primary" size="large" disabled={pool.length === 0} onClick={() => begin(pool)}>
            {pool.length}장으로 시작
          </Button>
          {pool.length === 0 && <span className="setup__hint">행을 하나 이상 선택하세요.</span>}
        </div>
      </div>
    </section>
  )
}

function Flashcard({ kana, front, flipped, onFlip }: { kana: Kana; front: Front; flipped: boolean; onFlip: () => void }) {
  const [strokeRun, setStrokeRun] = useState(0)
  const glyphCount = strokeGlyphs(kana.kana).length

  const kanaFace = (
    <>
      <span className="card__glyph kana" lang="ja">
        {kana.kana}
      </span>
      <span className="card__tap">눌러서 뒤집기</span>
    </>
  )
  const readingFace = (
    <>
      <span className="card__romaji">{kana.romaji}</span>
      <span className="card__korean">{kana.korean}</span>
      <span className="card__tap">눌러서 뒤집기</span>
    </>
  )
  // 뒷면은 어느 방향이든 글자 모양을 획순 도안으로 보여 준다. 도안이 글자 자체이므로 글리프를 따로 두지 않는다.
  const back = (
    <>
      <div className="card__answer">
        {glyphCount > 0 ? (
          <StrokeOrder kana={kana.kana} size={glyphCount > 1 ? 72 : 96} run={strokeRun} />
        ) : (
          <span className="card__glyph card__glyph--small kana" lang="ja">
            {kana.kana}
          </span>
        )}
        <div className="card__reading">
          <span className="card__romaji">{kana.romaji}</span>
          <span className="card__korean">{kana.korean}</span>
        </div>
      </div>
      {kana.hint && <p className="card__hint">{kana.hint}</p>}
      <div className="card__actions" onClick={(e) => e.stopPropagation()}>
        <SpeakButton text={kana.kana} />
        {glyphCount > 0 && <StrokePlayButton again={strokeRun > 0} onClick={() => setStrokeRun((r) => r + 1)} />}
      </div>
    </>
  )

  return (
    <div
      className={`card${flipped ? ' is-flipped' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={flipped ? '카드 뒷면' : '카드 앞면. 눌러서 뒤집기'}
      onClick={onFlip}
    >
      <div className="card__inner">
        <div className="card__face card__face--front" aria-hidden={flipped}>
          {front === 'kana' ? kanaFace : readingFace}
        </div>
        <div className="card__face card__face--back" aria-hidden={!flipped}>
          {back}
        </div>
      </div>
    </div>
  )
}
