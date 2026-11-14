import { describe, expect, it } from 'vitest'
import { HIRAGANA, HIRAGANA_BASIC, HIRAGANA_DAKUON, HIRAGANA_HANDAKUON, HIRAGANA_YOON } from './hiragana'
import type { Kana } from './types'

const flat = (rows: { kana: Kana[] }[]) => rows.flatMap((r) => r.kana)

const SMALL_YOON = new Set(['ゃ', 'ゅ', 'ょ'])

/** 요음(2글자)을 먼저 맞추도록 긴 글자부터 정렬한 표 */
const TABLE = [...HIRAGANA].sort((a, b) => b.kana.length - a.kana.length)

/**
 * 예시 단어를 글자 표의 대표 로마자로 바꾼다. reading 오타를 잡기 위한 테스트 전용 변환이다.
 * っ는 다음 소리의 첫 자음을 겹치고(ch는 t), を는 조사 발음대로 o로 읽는다.
 */
function toRomaji(word: string): string {
  let out = ''
  let geminate = false
  for (let i = 0; i < word.length; ) {
    if (word[i] === 'っ') {
      geminate = true
      i++
      continue
    }
    if (word[i] === 'を') {
      out += 'o'
      i++
      continue
    }
    const k = TABLE.find((t) => word.startsWith(t.kana, i))
    if (!k) throw new Error(`글자 표에 없는 글자: ${word[i]} (${word})`)
    let r = k.romaji
    if (geminate) {
      r = (r.startsWith('ch') ? 't' : r[0]) + r
      geminate = false
    }
    out += r
    i += k.kana.length
  }
  return out
}

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

  it('모든 글자가 한국어 발음을 갖는다', () => {
    for (const k of HIRAGANA) expect(k.korean, k.kana).toBeTruthy()
  })

  it('대체 로마자에 대표 로마자가 중복되지 않는다', () => {
    for (const k of HIRAGANA) {
      expect(k.alt, k.kana).not.toContain(k.romaji)
    }
  })
})

describe('예시 단어', () => {
  it('기본 46자와 탁음·반탁음은 예시 단어가 정확히 3개다', () => {
    for (const k of flat([...HIRAGANA_BASIC, ...HIRAGANA_DAKUON, ...HIRAGANA_HANDAKUON])) {
      expect(k.examples, k.kana).toHaveLength(3)
    }
  })

  it('요음은 みゅ를 빼고 예시 단어가 하나 이상이다', () => {
    for (const k of flat(HIRAGANA_YOON)) {
      if (k.kana === 'みゅ') continue
      expect(k.examples.length, k.kana).toBeGreaterThan(0)
    }
  })

  it('예시 단어는 3개를 넘지 않고, 한 글자 안에서 겹치지 않는다', () => {
    for (const k of HIRAGANA) {
      expect(k.examples.length, k.kana).toBeLessThanOrEqual(3)
      expect(new Set(k.examples.map((e) => e.word)).size, k.kana).toBe(k.examples.length)
    }
  })

  it('예시 단어는 그 글자를 실제로 포함한다', () => {
    for (const k of HIRAGANA) {
      for (const e of k.examples) expect(e.word, k.kana).toContain(k.kana)
    }
  })

  it('요음이 아닌 글자는 요음의 일부가 아닌 자리에 나온다 (き 예시가 きょう뿐이면 안 됨)', () => {
    for (const k of HIRAGANA) {
      if (k.group === 'yoon') continue
      for (const e of k.examples) {
        const chars = Array.from(e.word)
        const plain = chars.some((ch, i) => ch === k.kana && !SMALL_YOON.has(chars[i + 1]))
        expect(plain, `${k.kana}: ${e.word}`).toBe(true)
      }
    }
  })

  it('예시 3개가 모두 같은 자리(첫머리·가운데·끝)에 글자를 두지는 않는다', () => {
    // を는 조사라서 늘 명사 뒤에, づ는 연탁(つ→づ)으로만 생겨 늘 단어 가운데에 온다.
    // ぎゃ는 첫머리가 아닌 자리에 쓰는 쉬운 고유어가 없다. 셋은 예외로 둔다.
    const EXCEPT = new Set(['を', 'づ', 'ぎゃ'])
    const position = (word: string, kana: string) => {
      const i = word.indexOf(kana)
      if (i === 0) return 'start'
      return i + kana.length === word.length ? 'end' : 'middle'
    }
    for (const k of HIRAGANA) {
      if (k.examples.length < 3 || EXCEPT.has(k.kana)) continue
      const positions = new Set(k.examples.map((e) => position(e.word, k.kana)))
      expect(positions.size, `${k.kana}: ${k.examples.map((e) => e.word).join(', ')}`).toBeGreaterThan(1)
    }
  })

  it('로마자 읽기가 글자 표와 맞는다', () => {
    for (const k of HIRAGANA) {
      for (const e of k.examples) {
        expect(e.reading.replace(/[\s'-]/g, ''), `${k.kana}: ${e.word}`).toBe(toRomaji(e.word))
      }
    }
  })

  it('뜻이 비어 있지 않다', () => {
    for (const k of HIRAGANA) {
      for (const e of k.examples) expect(e.meaning.trim(), `${k.kana}: ${e.word}`).not.toBe('')
    }
  })
})
