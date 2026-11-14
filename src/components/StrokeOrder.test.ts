import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { StrokeOrder } from './StrokeOrder'

const render = (kana: string) => renderToStaticMarkup(createElement(StrokeOrder, { kana }))
const count = (html: string, cls: string) => html.split(`class="${cls}"`).length - 1

describe('StrokeOrder 십자 칸', () => {
  it('글자마다 테두리 하나와 가운데 십자선 두 개를 그린다', () => {
    const html = render('あ')
    expect(count(html, 'strokes__frame')).toBe(1)
    expect(count(html, 'strokes__cross')).toBe(2)
  })

  it('요음은 글자마다 칸을 하나씩 그린다', () => {
    const html = render('きゃ')
    expect(count(html, 'strokes__frame')).toBe(2)
    expect(count(html, 'strokes__cross')).toBe(4)
  })

  it('칸은 획보다 먼저 그려 획 뒤에 깔린다', () => {
    const html = render('あ')
    const grid = html.indexOf('strokes__grid')
    expect(grid).toBeGreaterThanOrEqual(0)
    expect(grid).toBeLessThan(html.indexOf('strokes__path'))
  })
})
