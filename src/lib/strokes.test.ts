import { describe, expect, it } from 'vitest'
import { STROKE_TIMING, strokeGlyphs, strokeTimeline } from './strokes'

describe('strokeGlyphs', () => {
  it('요음은 큰 글자와 작은 글자로 나눠 순서대로 돌려준다', () => {
    const glyphs = strokeGlyphs('きゃ')
    expect(glyphs.map((g) => g.char)).toEqual(['き', 'ゃ'])
    for (const g of glyphs) expect(g.glyph.strokes.length).toBeGreaterThan(0)
  })

  it('획순 데이터가 없는 글자가 섞이면 빈 배열이다', () => {
    expect(strokeGlyphs('A')).toEqual([])
    expect(strokeGlyphs('あA')).toEqual([])
  })
})

describe('strokeTimeline', () => {
  it('긴 획은 오래, 짧은 획은 짧게 그리되 최소·최대 시간 안에 머문다', () => {
    const { steps } = strokeTimeline([10, 100, 1000])
    expect(steps[0].duration).toBe(STROKE_TIMING.minMs)
    expect(steps[1].duration).toBe(100 * STROKE_TIMING.msPerUnit)
    expect(steps[2].duration).toBe(STROKE_TIMING.maxMs)
  })

  it('각 획은 앞 획이 끝나고 간격만큼 쉰 뒤 시작한다', () => {
    const { steps, total } = strokeTimeline([100, 50])
    expect(steps[0].delay).toBe(0)
    expect(steps[1].delay).toBe(steps[0].duration + STROKE_TIMING.gapMs)
    expect(total).toBe(steps[1].delay + steps[1].duration)
  })

  it('획이 없으면 길이 0인 타임라인이다', () => {
    expect(strokeTimeline([])).toEqual({ steps: [], total: 0 })
  })
})
