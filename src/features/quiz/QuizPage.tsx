import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { KanaPill } from '../../components/KanaPill'
import { Progress } from '../../components/Progress'
import { RangePicker, defaultSelection, selectedKana } from '../../components/RangePicker'
import { Segmented } from '../../components/Segmented'
import { HIRAGANA } from '../../data/hiragana'
import type { Kana } from '../../data/types'
import { buildQuestions, type Question, type QuizMode } from '../../lib/quiz'
import { topicParticle } from '../../lib/korean'
import { findKanaByRomaji, matchesRomaji, normalizeRomaji } from '../../lib/romaji'
import { recordAnswer, weakestKana, type KanaStats } from '../../lib/session'

type Phase = 'setup' | 'run' | 'result'
type CountOption = '10' | '20' | 'all'

type Run = {
  questions: Question[]
  index: number
  /** 현재 문제에 대한 답. null이면 아직 답하지 않음 */
  answered: { chosen: Kana | null; typed: string; correct: boolean } | null
  wrong: Kana[]
  streak: number
  bestStreak: number
  startedAt: number
  finishedAt: number | null
}

const MODE_OPTIONS: { value: QuizMode; label: string }[] = [
  { value: 'kana-to-reading', label: '가나 보고 소리 고르기' },
  { value: 'reading-to-kana', label: '소리 보고 가나 고르기' },
  { value: 'typing', label: '로마자로 입력하기' },
]

const COUNT_OPTIONS: { value: CountOption; label: string }[] = [
  { value: '10', label: '10문제' },
  { value: '20', label: '20문제' },
  { value: 'all', label: '전부' },
]

const CORRECT_ADVANCE_MS = 650

type Props = {
  stats: KanaStats
  onStatsChange: (next: KanaStats) => void
}

export function QuizPage({ stats, onStatsChange }: Props) {
  const [phase, setPhase] = useState<Phase>('setup')
  const [selection, setSelection] = useState<Set<string>>(defaultSelection)
  const [mode, setMode] = useState<QuizMode>('kana-to-reading')
  const [countOpt, setCountOpt] = useState<CountOption>('10')
  const [run, setRun] = useState<Run | null>(null)
  const roundAnswers = useRef(0)

  const pool = useMemo(() => selectedKana(selection), [selection])
  const count = countOpt === 'all' ? pool.length : Number(countOpt)

  const start = useCallback(
    (cards: Kana[], n: number) => {
      const questions = buildQuestions(cards, { count: n, mode })
      setRun({
        questions,
        index: 0,
        answered: null,
        wrong: [],
        streak: 0,
        bestStreak: 0,
        startedAt: Date.now(),
        finishedAt: null,
      })
      roundAnswers.current = 0
      setPhase('run')
    },
    [mode],
  )

  // 부모 상태(stats) 갱신은 setRun 업데이터 밖에서 해야 렌더 중 setState 경고가 나지 않는다.
  const submit = useCallback(
    (chosen: Kana | null, typed: string) => {
      if (!run || run.answered) return
      const q = run.questions[run.index]
      const correct = chosen ? chosen.id === q.answer.id : matchesRomaji(typed, q.answer)
      onStatsChange(recordAnswer(stats, q.answer.id, correct))
      roundAnswers.current += 1
      const streak = correct ? run.streak + 1 : 0
      setRun({
        ...run,
        answered: { chosen, typed, correct },
        wrong: correct ? run.wrong : [...run.wrong, q.answer],
        streak,
        bestStreak: Math.max(run.bestStreak, streak),
      })
    },
    [run, onStatsChange, stats],
  )

  const next = useCallback(() => {
    setRun((r) => {
      if (!r || !r.answered) return r
      if (r.index + 1 >= r.questions.length) {
        return { ...r, finishedAt: Date.now() }
      }
      return { ...r, index: r.index + 1, answered: null }
    })
  }, [])

  // 정답이면 잠깐 보여 주고 자동으로 넘어간다. 오답은 사용자가 확인하고 넘긴다.
  useEffect(() => {
    if (!run?.answered?.correct || run.finishedAt) return
    const t = window.setTimeout(next, CORRECT_ADVANCE_MS)
    return () => window.clearTimeout(t)
  }, [run?.answered, run?.finishedAt, next])

  useEffect(() => {
    if (run?.finishedAt) setPhase('result')
  }, [run?.finishedAt])

  useEffect(() => {
    if (phase !== 'run' || !run) return
    const q = run.questions[run.index]
    const onKey = (e: KeyboardEvent) => {
      if (run.answered) {
        if (e.key === 'Enter' && !run.answered.correct) next()
        return
      }
      if (q.mode === 'typing') return
      const n = Number(e.key)
      if (n >= 1 && n <= q.choices.length) submit(q.choices[n - 1], '')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, run, next, submit])

  if (phase === 'run' && run) {
    const q = run.questions[run.index]
    return (
      <section className="quiz" aria-labelledby="quiz-title">
        <h1 className="visually-hidden" id="quiz-title">
          퀴즈
        </h1>
        <div className="quiz__status">
          <span>
            <strong>{run.index + 1}</strong> / {run.questions.length}
          </span>
          <span className="quiz__status-right">
            {run.streak >= 3 && <span className="quiz__streak">연속 {run.streak}</span>}
            <Button variant="ghost" onClick={() => setPhase('setup')}>
              그만하기
            </Button>
          </span>
        </div>
        <Progress value={run.index + (run.answered ? 1 : 0)} max={run.questions.length} label="퀴즈 진행" />

        <div className="quiz__stage">
          <Prompt q={q} />
          {q.mode === 'typing' ? (
            <TypingAnswer key={q.answer.id} q={q} answered={run.answered} onSubmit={(typed) => submit(null, typed)} onNext={next} />
          ) : (
            <Choices q={q} answered={run.answered} onPick={(k) => submit(k, '')} />
          )}
          <Feedback q={q} answered={run.answered} onNext={next} />
          <p className="quiz__keys">{q.mode === 'typing' ? 'Enter로 확인하고 넘어갑니다' : '숫자키 1에서 4로 고를 수 있습니다'}</p>
        </div>
      </section>
    )
  }

  if (phase === 'result' && run) {
    const total = run.questions.length
    const correct = total - run.wrong.length
    const seconds = Math.max(1, Math.round(((run.finishedAt ?? Date.now()) - run.startedAt) / 1000))
    const sessionWeak = weakestKana(stats)
      .map((id) => HIRAGANA.find((k) => k.id === id)!)
      .filter(Boolean)
    const totalAnswers = Object.values(stats).reduce((n, s) => n + s.correct + s.wrong, 0)
    const showSession = totalAnswers > roundAnswers.current && sessionWeak.length > 0

    return (
      <section className="summary" aria-labelledby="quiz-title">
        <div>
          <h1 className="page-title" id="quiz-title">
            {run.wrong.length === 0 ? '전부 맞혔습니다' : '퀴즈 끝'}
          </h1>
        </div>
        <div>
          <div className="result__ratio">
            {correct}
            <small>/ {total}</small>
          </div>
        </div>
        <div className="result__facts">
          <span>
            정답률 <strong>{Math.round((correct / total) * 100)}%</strong>
          </span>
          <span>
            걸린 시간 <strong>{formatSeconds(seconds)}</strong>
          </span>
          <span>
            최고 연속 <strong>{run.bestStreak}</strong>
          </span>
        </div>
        {run.wrong.length > 0 && (
          <div>
            <p className="summary__section-title">이번에 틀린 글자 {run.wrong.length}자</p>
            <div className="summary__kana-list">
              {run.wrong.map((k) => (
                <KanaPill key={k.id} kana={k} />
              ))}
            </div>
          </div>
        )}
        {showSession && (
          <div>
            <p className="summary__section-title">이 세션에서 자주 틀린 글자</p>
            <div className="summary__kana-list">
              {sessionWeak.slice(0, 8).map((k) => (
                <KanaPill key={k.id} kana={k} />
              ))}
            </div>
          </div>
        )}
        <div className="btn-row">
          {run.wrong.length > 0 && (
            <Button variant="primary" size="large" onClick={() => start(run.wrong, run.wrong.length)}>
              틀린 글자만 다시
            </Button>
          )}
          <Button variant={run.wrong.length > 0 ? 'secondary' : 'primary'} size="large" onClick={() => start(pool, count)}>
            같은 설정으로 다시
          </Button>
          <Button variant="ghost" size="large" onClick={() => setPhase('setup')}>
            범위 바꾸기
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="quiz-title">
      <div className="page-head">
        <h1 className="page-title" id="quiz-title">
          퀴즈
        </h1>
        <p className="page-lead">
          고르기로 눈에 익히고, 입력으로 떠올리는 연습까지 하면 외운 것이 오래 갑니다. 결과는 이 창을 닫으면 사라집니다.
        </p>
      </div>
      <div className="setup">
        <div className="setup__section">
          <span className="setup__label">범위</span>
          <RangePicker selection={selection} onChange={setSelection} />
        </div>
        <div className="setup__section">
          <span className="setup__label">방식</span>
          <Segmented value={mode} onChange={setMode} options={MODE_OPTIONS} aria-label="퀴즈 방식" />
        </div>
        <div className="setup__section">
          <span className="setup__label">문제 수</span>
          <Segmented value={countOpt} onChange={setCountOpt} options={COUNT_OPTIONS} aria-label="문제 수" />
        </div>
        <div className="setup__footer">
          <Button variant="primary" size="large" disabled={pool.length < 2} onClick={() => start(pool, count)}>
            {Math.min(count, pool.length)}문제 시작
          </Button>
          {pool.length < 2 && <span className="setup__hint">행을 하나 이상 선택하세요.</span>}
        </div>
      </div>
    </section>
  )
}

function Prompt({ q }: { q: Question }) {
  if (q.mode === 'reading-to-kana') {
    return (
      <div className="quiz__prompt">
        <span className="quiz__prompt-romaji">{q.answer.romaji}</span>
        <span className="quiz__prompt-korean">{q.answer.korean}</span>
      </div>
    )
  }
  return (
    <div className="quiz__prompt">
      <span className="quiz__prompt-glyph kana" lang="ja">
        {q.answer.kana}
      </span>
    </div>
  )
}

export function Choices({ q, answered, onPick }: { q: Question; answered: Run['answered']; onPick: (k: Kana) => void }) {
  return (
    <div className="choices" role="group" aria-label="선택지">
      {q.choices.map((c, i) => {
        let state = ''
        if (answered) {
          if (c.id === q.answer.id) state = 'is-correct'
          else if (answered.chosen?.id === c.id) state = 'is-wrong'
          else state = 'is-dim'
        }
        // 고른 오답에는 그 답의 짝(가나면 소리, 소리면 가나)을 한 줄 더 보여 무엇을 골랐는지 알려 준다.
        // 답한 뒤 버튼 높이가 바뀌지 않도록 모든 선택지에 같은 줄을 미리 두고, 고른 오답에서만 드러낸다.
        const hidden = state !== 'is-wrong'
        const reveal =
          q.mode === 'reading-to-kana' ? (
            <span className="choice__reveal" aria-hidden={hidden || undefined}>
              {c.romaji} {c.korean}
            </span>
          ) : (
            <span className="choice__reveal choice__reveal--kana kana" lang="ja" aria-hidden={hidden || undefined}>
              {c.kana}
            </span>
          )
        return (
          <button
            key={c.id}
            type="button"
            className={`choice ${state}`}
            disabled={!!answered}
            onClick={() => onPick(c)}
            aria-label={q.mode === 'reading-to-kana' ? `${c.kana}` : `${c.romaji} ${c.korean}`}
          >
            <span className="choice__key" aria-hidden="true">
              {i + 1}
            </span>
            {q.mode === 'reading-to-kana' ? (
              <span className="choice__glyph kana" lang="ja">
                {c.kana}
              </span>
            ) : (
              <>
                <span className="choice__romaji">{c.romaji}</span>
                <span className="choice__korean">{c.korean}</span>
              </>
            )}
            {reveal}
          </button>
        )
      })}
    </div>
  )
}

function TypingAnswer({
  q,
  answered,
  onSubmit,
  onNext,
}: {
  q: Question
  answered: Run['answered']
  onSubmit: (typed: string) => void
  onNext: () => void
}) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [q])

  const state = answered ? (answered.correct ? 'is-correct' : 'is-wrong') : ''

  return (
    <form
      className="typing"
      onSubmit={(e) => {
        e.preventDefault()
        if (answered) {
          if (!answered.correct) onNext()
          return
        }
        if (value.trim()) onSubmit(value)
      }}
    >
      <div className="typing__row">
        <input
          ref={inputRef}
          className={`typing__input ${state}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="로마자"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          readOnly={!!answered}
          aria-label="로마자 입력"
        />
        {!answered && (
          <Button type="submit" variant="primary" disabled={!value.trim()}>
            확인
          </Button>
        )}
      </div>
    </form>
  )
}

function Feedback({ q, answered, onNext }: { q: Question; answered: Run['answered']; onNext: () => void }) {
  if (!answered) return <div className="feedback" aria-live="polite" />
  if (answered.correct) {
    return (
      <div className="feedback" aria-live="polite">
        <span className="feedback__text feedback__text--ok">맞았습니다</span>
      </div>
    )
  }
  return (
    <div className="feedback" aria-live="polite">
      <span className="feedback__text feedback__text--bad">
        틀렸습니다.{' '}
        <span className="feedback__answer">
          정답은 <span className="kana" lang="ja">{q.answer.kana}</span> {q.answer.romaji} {q.answer.korean}
        </span>
      </span>
      <PickedNote q={q} answered={answered} />
      <Button variant="primary" onClick={onNext} autoFocus={q.mode !== 'typing'}>
        다음
      </Button>
    </div>
  )
}

/** 오답일 때 내가 고른(입력한) 답이 무슨 글자·소리였는지 한 줄로 알려 준다. */
function PickedNote({ q, answered }: { q: Question; answered: NonNullable<Run['answered']> }) {
  if (q.mode === 'typing') {
    const typed = normalizeRomaji(answered.typed)
    const match = findKanaByRomaji(typed, HIRAGANA)
    if (!match) return <span className="feedback__picked">입력한 {typed}에 맞는 글자는 없습니다</span>
    return (
      <span className="feedback__picked">
        입력한 {typed}
        {topicParticle(match.korean)}{' '}
        <span className="kana" lang="ja">
          {match.kana}
        </span>
        입니다
      </span>
    )
  }
  const picked = answered.chosen
  if (!picked) return null
  if (q.mode === 'reading-to-kana') {
    return (
      <span className="feedback__picked">
        고른{' '}
        <span className="kana" lang="ja">
          {picked.kana}
        </span>
        {topicParticle(picked.korean)} {picked.romaji} {picked.korean}입니다
      </span>
    )
  }
  return (
    <span className="feedback__picked">
      고른 {picked.romaji} {picked.korean}
      {topicParticle(picked.korean)}{' '}
      <span className="kana" lang="ja">
        {picked.kana}
      </span>
      입니다
    </span>
  )
}

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return m > 0 ? `${m}분 ${s}초` : `${s}초`
}
