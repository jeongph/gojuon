import { describe, expect, it } from 'vitest'
import { emptyStats, recordAnswer, weakestKana } from './session'

describe('세션 통계', () => {
  it('정답과 오답을 글자별로 누적한다', () => {
    let s = emptyStats()
    s = recordAnswer(s, 'h-ka-a', true)
    s = recordAnswer(s, 'h-ka-a', false)
    s = recordAnswer(s, 'h-sa-a', false)
    expect(s['h-ka-a']).toEqual({ correct: 1, wrong: 1 })
    expect(s['h-sa-a']).toEqual({ correct: 0, wrong: 1 })
  })

  it('오답이 많은 글자부터 정렬해 돌려준다', () => {
    let s = emptyStats()
    s = recordAnswer(s, 'a', false)
    s = recordAnswer(s, 'b', false)
    s = recordAnswer(s, 'b', false)
    s = recordAnswer(s, 'c', true)
    expect(weakestKana(s)).toEqual(['b', 'a'])
  })
})
