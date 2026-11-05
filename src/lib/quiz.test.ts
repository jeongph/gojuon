import { describe, expect, it } from 'vitest'
import { HIRAGANA, HIRAGANA_BASIC } from '../data/hiragana'
import { buildQuestions, createRng, pickDistractors } from './quiz'

const basic = HIRAGANA_BASIC.flatMap((r) => r.kana)
const find = (kana: string) => HIRAGANA.find((k) => k.kana === kana)!

describe('createRng', () => {
  it('같은 시드는 같은 수열을 만든다', () => {
    const a = createRng(42)
    const b = createRng(42)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })
})

describe('pickDistractors', () => {
  it('정답을 제외한 서로 다른 글자를 요청한 수만큼 고른다', () => {
    const answer = find('か')
    const d = pickDistractors(answer, basic, 3, createRng(1))
    expect(d).toHaveLength(3)
    expect(d).not.toContain(answer)
    expect(new Set(d.map((k) => k.id)).size).toBe(3)
  })

  it('정답과 로마자가 같은 글자(じ/ぢ, ず/づ)는 오답 선택지로 쓰지 않는다', () => {
    const ji = find('じ')
    for (let seed = 0; seed < 50; seed++) {
      const d = pickDistractors(ji, HIRAGANA, 3, createRng(seed))
      expect(d.map((k) => k.romaji)).not.toContain('ji')
    }
  })

  it('오답끼리도 로마자가 겹치지 않는다', () => {
    const a = find('あ')
    for (let seed = 0; seed < 50; seed++) {
      const d = pickDistractors(a, HIRAGANA, 3, createRng(seed))
      expect(new Set(d.map((k) => k.romaji)).size).toBe(3)
    }
  })

  it('풀이 작으면 가능한 만큼만 고른다', () => {
    const pool = basic.slice(0, 3)
    expect(pickDistractors(pool[0], pool, 3, createRng(1))).toHaveLength(2)
  })
})

describe('buildQuestions', () => {
  it('요청한 개수만큼, 같은 글자가 반복되지 않게 문제를 만든다', () => {
    const qs = buildQuestions(basic, { count: 10, mode: 'kana-to-reading', rng: createRng(7) })
    expect(qs).toHaveLength(10)
    expect(new Set(qs.map((q) => q.answer.id)).size).toBe(10)
  })

  it('개수가 풀보다 크면 풀 크기로 맞춘다', () => {
    const pool = basic.slice(0, 5)
    const qs = buildQuestions(pool, { count: 20, mode: 'typing', rng: createRng(1) })
    expect(qs).toHaveLength(5)
  })

  it('선택형 문제는 정답을 포함한 4개의 선택지를 갖는다', () => {
    const qs = buildQuestions(basic, { count: 46, mode: 'reading-to-kana', rng: createRng(3) })
    for (const q of qs) {
      expect(q.choices).toHaveLength(4)
      expect(q.choices.map((c) => c.id)).toContain(q.answer.id)
    }
  })

  it('입력형 문제는 선택지가 없다', () => {
    const qs = buildQuestions(basic, { count: 3, mode: 'typing', rng: createRng(3) })
    for (const q of qs) expect(q.choices).toHaveLength(0)
  })
})
