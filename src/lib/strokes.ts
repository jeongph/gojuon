import { STROKES } from '../data/strokes'
import type { StrokeGlyph } from '../data/types'

export type GlyphStrokes = { char: string; glyph: StrokeGlyph }

/**
 * 가나 문자열을 글자 단위로 나눠 획순 데이터를 붙인다 (요음 きゃ → き, ゃ).
 * 하나라도 데이터가 없으면 빈 배열을 돌려 도안 자체를 숨기게 한다.
 */
export function strokeGlyphs(kana: string): GlyphStrokes[] {
  const out: GlyphStrokes[] = []
  for (const char of Array.from(kana)) {
    const glyph = STROKES[char]
    if (!glyph) return []
    out.push({ char, glyph })
  }
  return out
}

/** 획 그리기 속도. 길이 단위는 KanjiVG 뷰박스 좌표(109 기준). */
export const STROKE_TIMING = { msPerUnit: 7, minMs: 260, maxMs: 900, gapMs: 140 }

export type StrokeStep = { delay: number; duration: number }

/** 획 길이 목록을 받아 순서대로 이어지는 재생 타임라인을 만든다. */
export function strokeTimeline(lengths: number[], t = STROKE_TIMING): { steps: StrokeStep[]; total: number } {
  const steps: StrokeStep[] = []
  let cursor = 0
  for (const len of lengths) {
    const duration = Math.min(t.maxMs, Math.max(t.minMs, Math.round(len * t.msPerUnit)))
    steps.push({ delay: cursor, duration })
    cursor += duration + t.gapMs
  }
  return { steps, total: steps.length > 0 ? cursor - t.gapMs : 0 }
}
