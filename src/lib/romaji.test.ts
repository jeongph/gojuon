import { describe, expect, it } from 'vitest'
import { HIRAGANA } from '../data/hiragana'
import { findKanaByRomaji, matchesRomaji, normalizeRomaji } from './romaji'

const find = (kana: string) => HIRAGANA.find((k) => k.kana === kana)!

describe('normalizeRomaji', () => {
  it('앞뒤 공백을 제거하고 소문자로 바꾼다', () => {
    expect(normalizeRomaji('  SHI ')).toBe('shi')
  })
  it('전각 영문을 반각으로 바꾼다 (일본어 IME 상태에서 입력한 경우)', () => {
    expect(normalizeRomaji('ｓｈｉ')).toBe('shi')
  })
})

describe('matchesRomaji', () => {
  it('대표 로마자와 대체 표기를 모두 정답으로 인정한다', () => {
    const shi = find('し')
    expect(matchesRomaji('shi', shi)).toBe(true)
    expect(matchesRomaji('si', shi)).toBe(true)
    expect(matchesRomaji('su', shi)).toBe(false)
  })
  it('ん은 n과 nn, を는 wo와 o를 인정한다', () => {
    expect(matchesRomaji('nn', find('ん'))).toBe(true)
    expect(matchesRomaji('n', find('ん'))).toBe(true)
    expect(matchesRomaji('o', find('を'))).toBe(true)
  })
  it('빈 입력은 오답이다', () => {
    expect(matchesRomaji('   ', find('あ'))).toBe(false)
  })
})

describe('findKanaByRomaji', () => {
  const kanaOf = (input: string) => findKanaByRomaji(input, HIRAGANA)?.kana ?? null

  it('입력한 로마자에 맞는 글자를 찾는다', () => {
    expect(kanaOf('nu')).toBe('ぬ')
    expect(kanaOf('kya')).toBe('きゃ')
  })
  it('공백·대소문자를 정리하고, 대체 표기로도 찾는다', () => {
    expect(kanaOf(' SHI ')).toBe('し')
    expect(kanaOf('si')).toBe('し')
    expect(kanaOf('di')).toBe('ぢ')
  })
  it('여러 글자에 걸리면 대표 로마자가 같은 글자, 그다음 표 순서를 먼저 고른다', () => {
    expect(kanaOf('o')).toBe('お')
    expect(kanaOf('ji')).toBe('じ')
    expect(kanaOf('zu')).toBe('ず')
  })
  it('맞는 글자가 없거나 빈 입력이면 null이다', () => {
    expect(kanaOf('xyz')).toBeNull()
    expect(kanaOf('  ')).toBeNull()
  })
})
