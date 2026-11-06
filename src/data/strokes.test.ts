import { describe, expect, it } from 'vitest'
import { HIRAGANA } from './hiragana'
import { STROKES, STROKE_VIEWBOX } from './strokes'

describe('획순 데이터', () => {
  it('모든 히라가나 글자에 획순이 있다 (요음은 글자별로)', () => {
    const chars = new Set(HIRAGANA.flatMap((k) => Array.from(k.kana)))
    for (const ch of chars) expect(STROKES[ch], ch).toBeDefined()
  })

  it('획마다 path와 번호 좌표가 하나씩 있고 좌표는 뷰박스 안에 있다', () => {
    for (const [ch, glyph] of Object.entries(STROKES)) {
      expect(glyph.strokes.length, ch).toBeGreaterThan(0)
      expect(glyph.numbers, ch).toHaveLength(glyph.strokes.length)
      for (const d of glyph.strokes) expect(d, ch).toMatch(/^M/)
      for (const [x, y] of glyph.numbers) {
        expect(x, ch).toBeGreaterThanOrEqual(0)
        expect(x, ch).toBeLessThanOrEqual(STROKE_VIEWBOX)
        expect(y, ch).toBeGreaterThanOrEqual(0)
        expect(y, ch).toBeLessThanOrEqual(STROKE_VIEWBOX)
      }
    }
  })

  it('획수가 표준 획수와 같다', () => {
    const expected: Record<string, number> = { あ: 3, い: 2, つ: 1, ぬ: 2, ん: 1, が: 5, ぱ: 4, ゃ: 3 }
    for (const [ch, n] of Object.entries(expected)) expect(STROKES[ch].strokes, ch).toHaveLength(n)
  })
})
