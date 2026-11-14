import type { Kana } from '../data/types'

/** 사용자 입력을 비교 가능한 형태로 정리한다. 전각 영문(ｓｈｉ)은 반각으로 바꾼다. */
export function normalizeRomaji(input: string): string {
  return input
    .replace(/[Ａ-Ｚａ-ｚ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .trim()
    .toLowerCase()
}

/** 대표 로마자 또는 대체 표기 중 하나와 일치하면 정답으로 본다. */
export function matchesRomaji(input: string, kana: Kana): boolean {
  const value = normalizeRomaji(input)
  if (!value) return false
  return value === kana.romaji || kana.alt.includes(value)
}

/**
 * 입력한 로마자가 어떤 글자의 소리인지 거꾸로 찾는다 (입력 퀴즈에서 오답을 설명할 때).
 * o처럼 여러 글자에 걸리면 대표 로마자가 같은 글자(お)를 대체 표기(を)보다 먼저 고르고,
 * ji처럼 대표 로마자가 같은 글자끼리는 pool 순서(じ가 ぢ보다 앞)를 따른다.
 */
export function findKanaByRomaji(input: string, pool: readonly Kana[]): Kana | null {
  const value = normalizeRomaji(input)
  if (!value) return null
  return pool.find((k) => k.romaji === value) ?? pool.find((k) => k.alt.includes(value)) ?? null
}
