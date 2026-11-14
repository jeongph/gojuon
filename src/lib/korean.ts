const HANGUL_FIRST = 0xac00
const HANGUL_LAST = 0xd7a3
/** 한글 음절 하나가 갖는 종성(받침) 경우의 수. 0이면 받침 없음 */
const FINAL_COUNT = 28

/**
 * 앞말의 받침에 맞춰 보조사 '은/는'을 고른다 ("고른 ん은", "고른 お는").
 * 한글로 끝나지 않으면 '는'으로 둔다.
 */
export function topicParticle(word: string): '은' | '는' {
  const code = word.charCodeAt(word.length - 1)
  if (Number.isNaN(code) || code < HANGUL_FIRST || code > HANGUL_LAST) return '는'
  return (code - HANGUL_FIRST) % FINAL_COUNT === 0 ? '는' : '은'
}
