/** 브라우저 음성 합성으로 가나를 읽어 준다. 데이터 파일 없이 발음을 제공하기 위한 선택. */

let cachedVoice: SpeechSynthesisVoice | null | undefined

function pickJapaneseVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice
  const voices = window.speechSynthesis?.getVoices?.() ?? []
  const ja = voices.filter((v) => v.lang.toLowerCase().startsWith('ja'))
  // 기기 기본 음성을 우선하되, 없으면 첫 일본어 음성을 쓴다.
  cachedVoice = ja.find((v) => v.default) ?? ja[0] ?? null
  return cachedVoice
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string): void {
  if (!canSpeak()) return
  const synth = window.speechSynthesis
  synth.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'ja-JP'
  utter.rate = 0.85
  const voice = pickJapaneseVoice()
  if (voice) utter.voice = voice
  synth.speak(utter)
}

/** 일부 브라우저는 음성 목록을 비동기로 채우므로 바뀔 때 캐시를 비운다. */
if (canSpeak()) {
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    cachedVoice = undefined
  })
}
