/**
 * KanjiVG에서 히라가나 획순 SVG를 받아 src/data/strokes.ts를 생성한다.
 *
 * 실행: npm run strokes:fetch  (Node 23.6+, 타입 스트리핑으로 .ts를 바로 실행)
 * 네트워크가 필요하며 생성 결과는 커밋한다. 앱 런타임에는 외부 요청이 없다.
 * 가타카나를 추가하면 데이터 파일에서 글자 목록을 자동으로 읽어 함께 생성된다.
 */
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { HIRAGANA } from '../src/data/hiragana.ts'
import type { StrokeGlyph } from '../src/data/types.ts'

const RELEASE = 'r20260714'
const BASE = `https://raw.githubusercontent.com/KanjiVG/kanjivg/${RELEASE}/kanji`
const OUT = fileURLToPath(new URL('../src/data/strokes.ts', import.meta.url))
const CONCURRENCY = 8

const chars = [...new Set(HIRAGANA.flatMap((k) => Array.from(k.kana)))].sort()

function fileName(ch: string): string {
  return ch.codePointAt(0)!.toString(16).padStart(5, '0') + '.svg'
}

/** KanjiVG SVG에서 획 path(순서대로)와 획 번호 좌표를 뽑는다. */
function parse(svg: string, ch: string): StrokeGlyph {
  const strokes: string[] = []
  for (const m of svg.matchAll(/<path id="kvg:[0-9a-f]+-s(\d+)" d="([^"]+)"/g)) {
    strokes[Number(m[1]) - 1] = m[2]
  }
  const numbers: [number, number][] = []
  for (const m of svg.matchAll(/<text transform="matrix\(1 0 0 1 (-?[\d.]+) (-?[\d.]+)\)">(\d+)<\/text>/g)) {
    numbers[Number(m[3]) - 1] = [Number(m[1]), Number(m[2])]
  }
  const broken = strokes.length === 0 || strokes.length !== numbers.length || strokes.some((s) => !s) || numbers.some((n) => !n)
  if (broken) throw new Error(`${ch}: 획 ${strokes.length}개, 번호 ${numbers.length}개로 맞지 않음`)
  return { strokes, numbers }
}

async function fetchGlyph(ch: string): Promise<[string, StrokeGlyph]> {
  const url = `${BASE}/${fileName(ch)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${ch}: ${url} → HTTP ${res.status}`)
  return [ch, parse(await res.text(), ch)]
}

async function fetchAll(): Promise<Map<string, StrokeGlyph>> {
  const result = new Map<string, StrokeGlyph>()
  for (let i = 0; i < chars.length; i += CONCURRENCY) {
    const batch = await Promise.all(chars.slice(i, i + CONCURRENCY).map(fetchGlyph))
    for (const [ch, glyph] of batch) result.set(ch, glyph)
  }
  return result
}

function render(glyphs: Map<string, StrokeGlyph>): string {
  const lines = [...glyphs.entries()].map(
    ([ch, g]) => `  '${ch}': { strokes: ${JSON.stringify(g.strokes)}, numbers: ${JSON.stringify(g.numbers)} },`,
  )
  return `/*
 * 히라가나 획순 데이터. scripts/fetch-strokes.ts가 생성한 파일이므로 직접 고치지 않는다.
 *
 * 출처: KanjiVG ${RELEASE} (https://kanjivg.tagaini.net), Copyright (C) Ulrich Apel.
 * 원 저작물은 Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0) 라이선스이며,
 * 이 파일의 획순 데이터도 같은 라이선스를 따른다. https://creativecommons.org/licenses/by-sa/3.0/
 */
import type { StrokeGlyph } from './types'

/** KanjiVG 좌표계의 한 변 길이 */
export const STROKE_VIEWBOX = 109

export const STROKES: Record<string, StrokeGlyph> = {
${lines.join('\n')}
}
`
}

const glyphs = await fetchAll()
await writeFile(OUT, render(glyphs))
const strokeCount = [...glyphs.values()].reduce((n, g) => n + g.strokes.length, 0)
console.log(`${glyphs.size}자, ${strokeCount}획 → ${OUT}`)
