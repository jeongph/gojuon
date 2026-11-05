/** 가나 문자 체계. 지금은 히라가나만 있지만 가타카나 확장을 염두에 둔 축이다. */
export type Script = 'hiragana' | 'katakana'

/** 오십음도의 세트 구분. 기본(청음) / 탁음 / 반탁음 / 요음 */
export type KanaGroup = 'basic' | 'dakuon' | 'handakuon' | 'yoon'

/** 오십음도의 단(모음 열). 요음은 ya/yu/yo 열을 쓴다. */
export type Vowel = 'a' | 'i' | 'u' | 'e' | 'o' | 'ya' | 'yu' | 'yo'

export interface KanaExample {
  word: string
  reading: string
  meaning: string
}

export interface Kana {
  /** 'h-ka' 같은 안정적인 식별자. script 접두어로 가타카나와 충돌을 피한다. */
  id: string
  script: Script
  group: KanaGroup
  /** 소속 행 id (예: 'ka', 'ga', 'kya') */
  row: string
  col: Vowel
  kana: string
  /** 대표 로마자 (헵번식) */
  romaji: string
  /** 정답으로 인정하는 다른 로마자 표기 (훈령식, 입력 편의 등) */
  alt: string[]
  /** 한국어 발음 표기 */
  korean: string
  /** 모양을 기억하는 힌트 (기본 46자 + ん) */
  hint?: string
  /** 발음·용법 메모 */
  note?: string
  example?: KanaExample
}

export interface KanaRow {
  id: string
  script: Script
  group: KanaGroup
  /** 표에 보이는 행 이름 (예: 'か행') */
  label: string
  kana: Kana[]
}
