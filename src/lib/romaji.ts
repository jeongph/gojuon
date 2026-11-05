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
