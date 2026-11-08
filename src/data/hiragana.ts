import type { Kana, KanaGroup, KanaRow, Vowel } from './types'

type Cell = {
  kana: string
  romaji: string
  korean: string
  alt?: string[]
  note?: string
  example?: [word: string, reading: string, meaning: string]
}

/** 행 하나를 선언적으로 적는다. null은 해당 단이 비어 있다는 뜻(や행 い단 등). */
function row(
  id: string,
  group: KanaGroup,
  label: string,
  cols: Vowel[],
  cells: (Cell | null)[],
): KanaRow {
  const kana: Kana[] = []
  cells.forEach((cell, i) => {
    if (!cell) return
    const col = cols[i]
    kana.push({
      id: `h-${id}-${col}`,
      script: 'hiragana',
      group,
      row: id,
      col,
      kana: cell.kana,
      romaji: cell.romaji,
      alt: cell.alt ?? [],
      korean: cell.korean,
      note: cell.note,
      example: cell.example
        ? { word: cell.example[0], reading: cell.example[1], meaning: cell.example[2] }
        : undefined,
    })
  })
  return { id, script: 'hiragana', group, label, kana }
}

const V: Vowel[] = ['a', 'i', 'u', 'e', 'o']
const Y: Vowel[] = ['ya', 'yu', 'yo']

const KATA_NOTE = '단어 첫머리에서는 ㄱ에 가깝게, 단어 중간에서는 ㅋ에 가깝게 들린다.'
const TATA_NOTE = '단어 첫머리에서는 ㄷ에 가깝게, 단어 중간에서는 ㅌ에 가깝게 들린다.'

export const HIRAGANA_BASIC: KanaRow[] = [
  row('a', 'basic', 'あ행', V, [
    { kana: 'あ', romaji: 'a', korean: '아', example: ['あめ', 'ame', '비'] },
    { kana: 'い', romaji: 'i', korean: '이', example: ['いぬ', 'inu', '개'] },
    { kana: 'う', romaji: 'u', korean: '우', example: ['うみ', 'umi', '바다'] },
    { kana: 'え', romaji: 'e', korean: '에', example: ['えき', 'eki', '역'] },
    { kana: 'お', romaji: 'o', korean: '오', example: ['おかね', 'okane', '돈'] },
  ]),
  row('ka', 'basic', 'か행', V, [
    { kana: 'か', romaji: 'ka', korean: '카', note: KATA_NOTE, example: ['かさ', 'kasa', '우산'] },
    { kana: 'き', romaji: 'ki', korean: '키', note: KATA_NOTE, example: ['きつね', 'kitsune', '여우'] },
    { kana: 'く', romaji: 'ku', korean: '쿠', note: KATA_NOTE, example: ['くも', 'kumo', '구름'] },
    { kana: 'け', romaji: 'ke', korean: '케', note: KATA_NOTE, example: ['けむり', 'kemuri', '연기'] },
    { kana: 'こ', romaji: 'ko', korean: '코', note: KATA_NOTE, example: ['こころ', 'kokoro', '마음'] },
  ]),
  row('sa', 'basic', 'さ행', V, [
    { kana: 'さ', romaji: 'sa', korean: '사', example: ['さかな', 'sakana', '물고기'] },
    { kana: 'し', romaji: 'shi', korean: '시', alt: ['si'], note: '영어 she처럼 "시". 혀를 세워 "스ㅣ"로 발음하지 않는다. 로마자는 shi(헵번식)와 si(훈령식) 둘 다 쓴다.', example: ['しお', 'shio', '소금'] },
    { kana: 'す', romaji: 'su', korean: '스', example: ['すし', 'sushi', '초밥'] },
    { kana: 'せ', romaji: 'se', korean: '세', example: ['せかい', 'sekai', '세계'] },
    { kana: 'そ', romaji: 'so', korean: '소', example: ['そら', 'sora', '하늘'] },
  ]),
  row('ta', 'basic', 'た행', V, [
    { kana: 'た', romaji: 'ta', korean: '타', note: TATA_NOTE, example: ['たこ', 'tako', '문어'] },
    { kana: 'ち', romaji: 'chi', korean: '치', alt: ['ti'], note: '로마자는 chi(헵번식)와 ti(훈령식) 둘 다 쓴다. 영어 cheese의 "치".', example: ['ちかてつ', 'chikatetsu', '지하철'] },
    { kana: 'つ', romaji: 'tsu', korean: '츠', alt: ['tu'], note: '"츠"와 "쓰"의 중간 소리. 혀끝을 윗니 뒤에 대고 짧게. 로마자는 tsu(헵번식)와 tu(훈령식).', example: ['つき', 'tsuki', '달'] },
    { kana: 'て', romaji: 'te', korean: '테', note: TATA_NOTE, example: ['てんき', 'tenki', '날씨'] },
    { kana: 'と', romaji: 'to', korean: '토', note: TATA_NOTE, example: ['とり', 'tori', '새'] },
  ]),
  row('na', 'basic', 'な행', V, [
    { kana: 'な', romaji: 'na', korean: '나', example: ['なつ', 'natsu', '여름'] },
    { kana: 'に', romaji: 'ni', korean: '니', example: ['にく', 'niku', '고기'] },
    { kana: 'ぬ', romaji: 'nu', korean: '누', example: ['ぬの', 'nuno', '천(옷감)'] },
    { kana: 'ね', romaji: 'ne', korean: '네', example: ['ねこ', 'neko', '고양이'] },
    { kana: 'の', romaji: 'no', korean: '노', example: ['のり', 'nori', '김'] },
  ]),
  row('ha', 'basic', 'は행', V, [
    { kana: 'は', romaji: 'ha', korean: '하', note: '조사(~은/는)로 쓰일 때는 "와(wa)"로 읽는다.', example: ['はな', 'hana', '꽃'] },
    { kana: 'ひ', romaji: 'hi', korean: '히', example: ['ひと', 'hito', '사람'] },
    { kana: 'ふ', romaji: 'fu', korean: '후', alt: ['hu'], note: '입술을 둥글게 모으지 않고 "후". 영어 f와 h의 중간 소리. 로마자는 fu와 hu 둘 다 쓴다.', example: ['ふね', 'fune', '배(선박)'] },
    { kana: 'へ', romaji: 'he', korean: '헤', note: '조사(~에/으로)로 쓰일 때는 "에(e)"로 읽는다.', example: ['へや', 'heya', '방'] },
    { kana: 'ほ', romaji: 'ho', korean: '호', example: ['ほし', 'hoshi', '별'] },
  ]),
  row('ma', 'basic', 'ま행', V, [
    { kana: 'ま', romaji: 'ma', korean: '마', example: ['まち', 'machi', '마을, 거리'] },
    { kana: 'み', romaji: 'mi', korean: '미', example: ['みみ', 'mimi', '귀'] },
    { kana: 'む', romaji: 'mu', korean: '무', example: ['むし', 'mushi', '벌레'] },
    { kana: 'め', romaji: 'me', korean: '메', example: ['ゆめ', 'yume', '꿈'] },
    { kana: 'も', romaji: 'mo', korean: '모', example: ['もり', 'mori', '숲'] },
  ]),
  row('ya', 'basic', 'や행', V, [
    { kana: 'や', romaji: 'ya', korean: '야', example: ['やま', 'yama', '산'] },
    null,
    { kana: 'ゆ', romaji: 'yu', korean: '유', example: ['ゆき', 'yuki', '눈(雪)'] },
    null,
    { kana: 'よ', romaji: 'yo', korean: '요', example: ['よる', 'yoru', '밤'] },
  ]),
  row('ra', 'basic', 'ら행', V, [
    { kana: 'ら', romaji: 'ra', korean: '라', example: ['らいねん', 'rainen', '내년'] },
    { kana: 'り', romaji: 'ri', korean: '리', example: ['りす', 'risu', '다람쥐'] },
    { kana: 'る', romaji: 'ru', korean: '루', example: ['くるま', 'kuruma', '자동차'] },
    { kana: 'れ', romaji: 're', korean: '레', example: ['れきし', 'rekishi', '역사'] },
    { kana: 'ろ', romaji: 'ro', korean: '로', example: ['ろく', 'roku', '여섯(6)'] },
  ]),
  row('wa', 'basic', 'わ행', V, [
    { kana: 'わ', romaji: 'wa', korean: '와', example: ['わたし', 'watashi', '나, 저'] },
    null,
    null,
    null,
    { kana: 'を', romaji: 'wo', korean: '오', alt: ['o'], note: '발음은 お와 같은 "오". 단어 안에는 거의 쓰이지 않고 목적격 조사로만 쓴다. 키보드 입력은 wo.', example: ['ほんをよむ', 'hon o yomu', '책을 읽다'] },
  ]),
  row('n', 'basic', 'ん', ['a'], [
    { kana: 'ん', romaji: 'n', korean: '응', alt: ['nn'], note: '뒤에 오는 소리에 따라 ㄴ·ㅁ·ㅇ 받침으로 들린다. 키보드 입력은 nn.', example: ['ほん', 'hon', '책'] },
  ]),
]

const DAKU_NOTE = '청음에 탁점(゛)을 붙여 소리를 울리게 한 글자.'

export const HIRAGANA_DAKUON: KanaRow[] = [
  row('ga', 'dakuon', 'が행', V, [
    { kana: 'が', romaji: 'ga', korean: '가', note: DAKU_NOTE },
    { kana: 'ぎ', romaji: 'gi', korean: '기', note: DAKU_NOTE },
    { kana: 'ぐ', romaji: 'gu', korean: '구', note: DAKU_NOTE },
    { kana: 'げ', romaji: 'ge', korean: '게', note: DAKU_NOTE },
    { kana: 'ご', romaji: 'go', korean: '고', note: DAKU_NOTE },
  ]),
  row('za', 'dakuon', 'ざ행', V, [
    { kana: 'ざ', romaji: 'za', korean: '자', note: DAKU_NOTE },
    { kana: 'じ', romaji: 'ji', korean: '지', alt: ['zi'], note: '영어 j에 가까운 "지". ぢ와 소리가 완전히 같아 로마자도 둘 다 ji다. 보통은 じ를 쓴다.' },
    { kana: 'ず', romaji: 'zu', korean: '즈', note: 'づ와 소리가 완전히 같아 로마자도 둘 다 zu다. 보통은 ず를 쓴다.' },
    { kana: 'ぜ', romaji: 'ze', korean: '제', note: DAKU_NOTE },
    { kana: 'ぞ', romaji: 'zo', korean: '조', note: DAKU_NOTE },
  ]),
  row('da', 'dakuon', 'だ행', V, [
    { kana: 'だ', romaji: 'da', korean: '다', note: DAKU_NOTE },
    { kana: 'ぢ', romaji: 'ji', korean: '지', alt: ['di', 'zi'], note: 'じ와 소리가 완전히 같다. 표준어에서는 두 글자의 구별이 사라져 로마자도 같은 ji를 쓴다. はなぢ(코피), ちぢむ(줄어들다)처럼 ち가 탁음으로 바뀐 자리에만 쓴다. 키보드 입력은 di.' },
    { kana: 'づ', romaji: 'zu', korean: '즈', alt: ['du'], note: 'ず와 소리가 완전히 같다. 표준어에서는 두 글자의 구별이 사라져 로마자도 같은 zu를 쓴다. つづく(계속되다), みかづき(초승달)처럼 つ가 탁음으로 바뀐 자리에만 쓴다. 키보드 입력은 du.' },
    { kana: 'で', romaji: 'de', korean: '데', note: DAKU_NOTE },
    { kana: 'ど', romaji: 'do', korean: '도', note: DAKU_NOTE },
  ]),
  row('ba', 'dakuon', 'ば행', V, [
    { kana: 'ば', romaji: 'ba', korean: '바', note: DAKU_NOTE },
    { kana: 'び', romaji: 'bi', korean: '비', note: DAKU_NOTE },
    { kana: 'ぶ', romaji: 'bu', korean: '부', note: DAKU_NOTE },
    { kana: 'べ', romaji: 'be', korean: '베', note: DAKU_NOTE },
    { kana: 'ぼ', romaji: 'bo', korean: '보', note: DAKU_NOTE },
  ]),
]

const HANDAKU_NOTE = 'は행에 반탁점(゜)을 붙인 글자. ㅍ 소리.'

export const HIRAGANA_HANDAKUON: KanaRow[] = [
  row('pa', 'handakuon', 'ぱ행', V, [
    { kana: 'ぱ', romaji: 'pa', korean: '파', note: HANDAKU_NOTE },
    { kana: 'ぴ', romaji: 'pi', korean: '피', note: HANDAKU_NOTE },
    { kana: 'ぷ', romaji: 'pu', korean: '푸', note: HANDAKU_NOTE },
    { kana: 'ぺ', romaji: 'pe', korean: '페', note: HANDAKU_NOTE },
    { kana: 'ぽ', romaji: 'po', korean: '포', note: HANDAKU_NOTE },
  ]),
]

const YOON_NOTE = 'い단 글자 뒤에 작은 ゃ·ゅ·ょ를 붙여 한 음절로 읽는다.'

export const HIRAGANA_YOON: KanaRow[] = [
  row('kya', 'yoon', 'きゃ행', Y, [
    { kana: 'きゃ', romaji: 'kya', korean: '캬', note: YOON_NOTE },
    { kana: 'きゅ', romaji: 'kyu', korean: '큐', note: YOON_NOTE },
    { kana: 'きょ', romaji: 'kyo', korean: '쿄', note: YOON_NOTE },
  ]),
  row('sha', 'yoon', 'しゃ행', Y, [
    { kana: 'しゃ', romaji: 'sha', korean: '샤', alt: ['sya'], note: YOON_NOTE },
    { kana: 'しゅ', romaji: 'shu', korean: '슈', alt: ['syu'], note: YOON_NOTE },
    { kana: 'しょ', romaji: 'sho', korean: '쇼', alt: ['syo'], note: YOON_NOTE },
  ]),
  row('cha', 'yoon', 'ちゃ행', Y, [
    { kana: 'ちゃ', romaji: 'cha', korean: '챠', alt: ['tya'], note: YOON_NOTE },
    { kana: 'ちゅ', romaji: 'chu', korean: '츄', alt: ['tyu'], note: YOON_NOTE },
    { kana: 'ちょ', romaji: 'cho', korean: '쵸', alt: ['tyo'], note: YOON_NOTE },
  ]),
  row('nya', 'yoon', 'にゃ행', Y, [
    { kana: 'にゃ', romaji: 'nya', korean: '냐', note: YOON_NOTE },
    { kana: 'にゅ', romaji: 'nyu', korean: '뉴', note: YOON_NOTE },
    { kana: 'にょ', romaji: 'nyo', korean: '뇨', note: YOON_NOTE },
  ]),
  row('hya', 'yoon', 'ひゃ행', Y, [
    { kana: 'ひゃ', romaji: 'hya', korean: '햐', note: YOON_NOTE },
    { kana: 'ひゅ', romaji: 'hyu', korean: '휴', note: YOON_NOTE },
    { kana: 'ひょ', romaji: 'hyo', korean: '효', note: YOON_NOTE },
  ]),
  row('mya', 'yoon', 'みゃ행', Y, [
    { kana: 'みゃ', romaji: 'mya', korean: '먀', note: YOON_NOTE },
    { kana: 'みゅ', romaji: 'myu', korean: '뮤', note: YOON_NOTE },
    { kana: 'みょ', romaji: 'myo', korean: '묘', note: YOON_NOTE },
  ]),
  row('rya', 'yoon', 'りゃ행', Y, [
    { kana: 'りゃ', romaji: 'rya', korean: '랴', note: YOON_NOTE },
    { kana: 'りゅ', romaji: 'ryu', korean: '류', note: YOON_NOTE },
    { kana: 'りょ', romaji: 'ryo', korean: '료', note: YOON_NOTE },
  ]),
  row('gya', 'yoon', 'ぎゃ행', Y, [
    { kana: 'ぎゃ', romaji: 'gya', korean: '갸', note: YOON_NOTE },
    { kana: 'ぎゅ', romaji: 'gyu', korean: '규', note: YOON_NOTE },
    { kana: 'ぎょ', romaji: 'gyo', korean: '교', note: YOON_NOTE },
  ]),
  row('ja', 'yoon', 'じゃ행', Y, [
    { kana: 'じゃ', romaji: 'ja', korean: '자', alt: ['jya', 'zya'], note: YOON_NOTE },
    { kana: 'じゅ', romaji: 'ju', korean: '주', alt: ['jyu', 'zyu'], note: YOON_NOTE },
    { kana: 'じょ', romaji: 'jo', korean: '조', alt: ['jyo', 'zyo'], note: YOON_NOTE },
  ]),
  row('bya', 'yoon', 'びゃ행', Y, [
    { kana: 'びゃ', romaji: 'bya', korean: '뱌', note: YOON_NOTE },
    { kana: 'びゅ', romaji: 'byu', korean: '뷰', note: YOON_NOTE },
    { kana: 'びょ', romaji: 'byo', korean: '뵤', note: YOON_NOTE },
  ]),
  row('pya', 'yoon', 'ぴゃ행', Y, [
    { kana: 'ぴゃ', romaji: 'pya', korean: '퍄', note: YOON_NOTE },
    { kana: 'ぴゅ', romaji: 'pyu', korean: '퓨', note: YOON_NOTE },
    { kana: 'ぴょ', romaji: 'pyo', korean: '표', note: YOON_NOTE },
  ]),
]

export const HIRAGANA_ROWS: KanaRow[] = [
  ...HIRAGANA_BASIC,
  ...HIRAGANA_DAKUON,
  ...HIRAGANA_HANDAKUON,
  ...HIRAGANA_YOON,
]

export const HIRAGANA: Kana[] = HIRAGANA_ROWS.flatMap((r) => r.kana)
