import type { Kana } from '../data/types'

export type QuizMode = 'kana-to-reading' | 'reading-to-kana' | 'typing'

export interface Question {
  mode: QuizMode
  answer: Kana
  /** 선택형에서만 채워진다. 입력형은 빈 배열. */
  choices: Kana[]
}

export interface BuildOptions {
  count: number
  mode: QuizMode
  rng?: () => number
}

export const CHOICE_COUNT = 4

/** 테스트 재현을 위한 시드 기반 난수 (mulberry32). */
export function createRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * 오답 선택지를 고른다.
 * 같은 행 또는 같은 단의 글자를 먼저 쓰면 모양·소리가 비슷한 것끼리 섞여 변별 연습이 된다.
 * 로마자가 같은 글자(じ/ぢ, ず/づ)는 둘 다 정답이 되므로 제외한다.
 */
export function pickDistractors(
  answer: Kana,
  pool: readonly Kana[],
  n: number,
  rng: () => number = Math.random,
): Kana[] {
  const usedRomaji = new Set([answer.romaji])
  const candidates = pool.filter((k) => k.id !== answer.id)
  const related = shuffle(candidates.filter((k) => k.row === answer.row || k.col === answer.col), rng)
  const others = shuffle(candidates.filter((k) => k.row !== answer.row && k.col !== answer.col), rng)

  const picked: Kana[] = []
  for (const k of [...related, ...others]) {
    if (picked.length >= n) break
    if (usedRomaji.has(k.romaji)) continue
    usedRomaji.add(k.romaji)
    picked.push(k)
  }
  return picked
}

export function buildQuestions(pool: readonly Kana[], opts: BuildOptions): Question[] {
  const rng = opts.rng ?? Math.random
  const count = Math.min(opts.count, pool.length)
  const answers = shuffle(pool, rng).slice(0, count)

  return answers.map((answer) => {
    const choices =
      opts.mode === 'typing'
        ? []
        : shuffle([answer, ...pickDistractors(answer, pool, CHOICE_COUNT - 1, rng)], rng)
    return { mode: opts.mode, answer, choices }
  })
}
