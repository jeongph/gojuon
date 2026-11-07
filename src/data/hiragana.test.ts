import { describe, expect, it } from 'vitest'
import { HIRAGANA, HIRAGANA_BASIC, HIRAGANA_DAKUON, HIRAGANA_HANDAKUON, HIRAGANA_YOON } from './hiragana'

const flat = (rows: { kana: unknown[] }[]) => rows.flatMap((r) => r.kana)

describe('히라가나 데이터', () => {
  it('세트별 글자 수가 표준 오십음도와 같다', () => {
    expect(flat(HIRAGANA_BASIC)).toHaveLength(46)
    expect(flat(HIRAGANA_DAKUON)).toHaveLength(20)
    expect(flat(HIRAGANA_HANDAKUON)).toHaveLength(5)
    expect(flat(HIRAGANA_YOON)).toHaveLength(33)
    expect(HIRAGANA).toHaveLength(104)
  })

  it('id와 글자가 모두 고유하다', () => {
    expect(new Set(HIRAGANA.map((k) => k.id)).size).toBe(HIRAGANA.length)
    expect(new Set(HIRAGANA.map((k) => k.kana)).size).toBe(HIRAGANA.length)
  })

  it('기본 46자는 한국어 발음과 예시 단어를 모두 갖는다', () => {
    for (const k of flat(HIRAGANA_BASIC) as typeof HIRAGANA) {
      expect(k.korean, k.kana).toBeTruthy()
      expect(k.example, k.kana).toBeTruthy()
    }
  })

  it('대체 로마자에 대표 로마자가 중복되지 않는다', () => {
    for (const k of HIRAGANA) {
      expect(k.alt, k.kana).not.toContain(k.romaji)
    }
  })

  it('예시 단어는 그 글자를 실제로 포함한다', () => {
    for (const k of HIRAGANA) {
      if (k.example) expect(k.example.word, k.kana).toContain(k.kana)
    }
  })
})
