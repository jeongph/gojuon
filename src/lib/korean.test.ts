import { describe, expect, it } from 'vitest'
import { topicParticle } from './korean'

describe('topicParticle', () => {
  it('받침 없는 한글로 끝나면 는', () => {
    expect(topicParticle('오')).toBe('는')
    expect(topicParticle('캬')).toBe('는')
  })
  it('받침 있는 한글로 끝나면 은 (ん=응)', () => {
    expect(topicParticle('응')).toBe('은')
  })
  it('한글로 끝나지 않으면 는', () => {
    expect(topicParticle('천(옷감)')).toBe('는')
    expect(topicParticle('')).toBe('는')
  })
})
