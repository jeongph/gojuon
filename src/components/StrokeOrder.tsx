import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { STROKE_VIEWBOX } from '../data/strokes'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { strokeGlyphs, strokeTimeline } from '../lib/strokes'
import { PlayIcon } from './Icons'

type Props = {
  kana: string
  /** 글자 한 개의 표시 크기(px) */
  size?: number
  /** 0이면 번호만 붙은 정지 도안. 1 이상이면 값이 바뀔 때마다 처음부터 다시 그린다. */
  run?: number
  /** 마지막 획까지 그려졌을 때 */
  onEnd?: () => void
  className?: string
}

/**
 * 획순 도안. 글자마다 SVG 하나를 그리고, 요음처럼 두 글자면 나란히 둔다.
 * 재생 중에는 아직 안 그린 획을 흐리게 깔고, 그리는 획만 쪽빛으로 강조한 뒤 먹색으로 가라앉힌다.
 * 획 길이는 DOM에서만 알 수 있어 마운트 후 한 번 측정해 획마다 재생 시간을 정한다.
 */
export function StrokeOrder({ kana, size = 120, run = 0, onEnd, className = '' }: Props) {
  const glyphs = useMemo(() => strokeGlyphs(kana), [kana])
  const total = glyphs.reduce((n, g) => n + g.glyph.strokes.length, 0)
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const [lengths, setLengths] = useState<number[]>([])

  useLayoutEffect(() => {
    setLengths(pathRefs.current.slice(0, total).map((p) => p?.getTotalLength() ?? 0))
  }, [kana, total])

  if (glyphs.length === 0) return null

  const playing = run > 0 && lengths.length === total
  const { steps } = strokeTimeline(lengths)
  let index = 0

  return (
    <div className={`strokes ${className}`.trim()} style={{ '--stroke-size': `${size}px` } as CSSProperties}>
      {glyphs.map(({ char, glyph }) => (
        <svg
          key={char}
          className="strokes__glyph"
          viewBox={`0 0 ${STROKE_VIEWBOX} ${STROKE_VIEWBOX}`}
          role="img"
          aria-label={`${char} 획순, ${glyph.strokes.length}획`}
        >
          <StrokeGrid />
          {playing && glyph.strokes.map((d, i) => <path key={`guide-${i}`} className="strokes__guide" d={d} />)}
          {glyph.strokes.map((d, i) => {
            const k = index++
            const step = steps[k]
            // dasharray를 길이보다 살짝 크게 잡아 반올림으로 끝이 덜 그려지는 일을 막는다
            const len = Math.ceil(lengths[k] ?? 0) + 1
            const style =
              playing && step
                ? ({ '--len': len, '--dur': `${step.duration}ms`, '--delay': `${step.delay}ms` } as CSSProperties)
                : undefined
            return (
              <path
                key={playing ? `run-${run}-${i}` : `static-${i}`}
                ref={(el) => {
                  pathRefs.current[k] = el
                }}
                className={playing ? 'strokes__path strokes__path--draw' : 'strokes__path'}
                d={d}
                style={style}
                onAnimationEnd={
                  k === total - 1
                    ? (e) => {
                        if (e.animationName === 'strokes-draw') onEnd?.()
                      }
                    : undefined
                }
              />
            )
          })}
          {glyph.numbers.map(([x, y], i) => (
            <text key={`n-${i}`} className="strokes__num" x={x} y={y}>
              {i + 1}
            </text>
          ))}
        </svg>
      ))}
    </div>
  )
}

const GRID_CENTER = STROKE_VIEWBOX / 2
/** 테두리 선이 뷰박스 밖으로 잘리지 않게 선 굵기 절반만큼 안쪽으로 들인다 (CSS stroke-width와 맞춘다) */
const GRID_INSET = 0.6

/**
 * 일본 초등 국어 공책의 十字リーダー 칸. 테두리와 가운데 점선 십자로 획이 칸의 어디쯤에서
 * 시작하고 끝나는지 가늠하게 한다. KanjiVG 글자는 109 뷰박스 가운데를 기준으로 그려져 있다.
 */
function StrokeGrid() {
  const end = STROKE_VIEWBOX - GRID_INSET
  return (
    <g className="strokes__grid" aria-hidden="true">
      <rect
        className="strokes__frame"
        x={GRID_INSET}
        y={GRID_INSET}
        width={STROKE_VIEWBOX - GRID_INSET * 2}
        height={STROKE_VIEWBOX - GRID_INSET * 2}
      />
      <line className="strokes__cross" x1={GRID_CENTER} y1={GRID_INSET} x2={GRID_CENTER} y2={end} />
      <line className="strokes__cross" x1={GRID_INSET} y1={GRID_CENTER} x2={end} y2={GRID_CENTER} />
    </g>
  )
}

type PlayProps = {
  /** 한 번이라도 재생했으면 "다시 재생"으로 바꾼다 */
  again?: boolean
  onClick: () => void
}

/** 획순 재생 버튼. 동작 줄이기 설정에서는 정지 도안만 보이므로 버튼을 숨긴다. */
export function StrokePlayButton({ again = false, onClick }: PlayProps) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  if (reduceMotion) return null
  return (
    <button type="button" className="pill" onClick={onClick}>
      <PlayIcon />
      {again ? '다시 재생' : '획순 재생'}
    </button>
  )
}

/** "3획" 또는 "き 4획, ゃ 3획" 같은 획수 설명 */
export function strokeCountLabel(kana: string): string {
  const glyphs = strokeGlyphs(kana)
  if (glyphs.length === 1) return `${glyphs[0].glyph.strokes.length}획`
  return glyphs.map((g) => `${g.char} ${g.glyph.strokes.length}획`).join(', ')
}
