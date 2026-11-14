import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { HIRAGANA } from '../../data/hiragana'
import type { Question, QuizMode } from '../../lib/quiz'
import { Choices } from './QuizPage'

const find = (kana: string) => HIRAGANA.find((k) => k.kana === kana)!

function render(mode: QuizMode, chosen: string | null) {
  const q: Question = { mode, answer: find('ちゅ'), choices: ['ちゅ', 'ぎゅ', 'ひゅ', 'ちょ'].map(find) }
  const answered = chosen ? { chosen: find(chosen), typed: '', correct: chosen === 'ちゅ' } : null
  return renderToStaticMarkup(createElement(Choices, { q, answered, onPick: () => {} }))
}

const reveals = (html: string) => html.match(/<span class="choice__reveal[^"]*"[^>]*>/g) ?? []

describe('선택지의 오답 짝 표시', () => {
  it('답하기 전에도 모든 선택지에 짝 표시 자리를 잡아 둔다 (답한 뒤 버튼 높이가 바뀌지 않게)', () => {
    expect(reveals(render('kana-to-reading', null))).toHaveLength(4)
    expect(reveals(render('reading-to-kana', null))).toHaveLength(4)
  })

  it('고른 오답의 짝만 드러나고 나머지는 숨긴다', () => {
    const html = render('kana-to-reading', 'ぎゅ')
    const shown = reveals(html).filter((tag) => !tag.includes('aria-hidden="true"'))
    expect(shown).toHaveLength(1)
    expect(html).toMatch(/choice is-wrong[\s\S]*?<span class="choice__reveal[^"]*"[^>]*>ぎゅ<\/span>/)
  })
})
