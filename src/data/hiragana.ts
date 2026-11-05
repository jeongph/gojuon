import type { Kana, KanaGroup, KanaRow, Vowel } from './types'

type Cell = {
  kana: string
  romaji: string
  korean: string
  alt?: string[]
  hint?: string
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
      hint: cell.hint,
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
    { kana: 'あ', romaji: 'a', korean: '아', hint: '십자 위에 동그라미를 두른 모양. "아!" 하고 두 팔을 벌린 사람.', example: ['あめ', 'ame', '비'] },
    { kana: 'い', romaji: 'i', korean: '이', hint: '짧은 두 획이 나란히 선 모양. 한글 ㅣ가 두 개 서 있다고 기억.', example: ['いぬ', 'inu', '개'] },
    { kana: 'う', romaji: 'u', korean: '우', hint: '입을 "우" 하고 내민 옆얼굴. 위의 점이 코, 아래 획이 턱.', example: ['うみ', 'umi', '바다'] },
    { kana: 'え', romaji: 'e', korean: '에', hint: '아랫부분이 ㄷ처럼 꺾인다. "에?" 하고 고개를 꺾는 모습.', example: ['えき', 'eki', '역'] },
    { kana: 'お', romaji: 'o', korean: '오', hint: 'あ와 닮았지만 오른쪽 위에 점이 하나 더 있다. 점이 붙으면 "오".', example: ['おかね', 'okane', '돈'] },
  ]),
  row('ka', 'basic', 'か행', V, [
    { kana: 'か', romaji: 'ka', korean: '카', hint: '한자 力(힘)에 점 하나. "카!" 하고 힘을 주는 소리. 가타카나 カ와 거의 같다.', note: KATA_NOTE, example: ['かさ', 'kasa', '우산'] },
    { kana: 'き', romaji: 'ki', korean: '키', hint: '영어 key와 소리가 같다. 가로획 두 개가 열쇠의 홈 모양.', note: KATA_NOTE, example: ['きつね', 'kitsune', '여우'] },
    { kana: 'く', romaji: 'ku', korean: '쿠', hint: '입을 벌린 새의 부리. "쿠쿠" 하고 운다고 기억.', note: KATA_NOTE, example: ['くも', 'kumo', '구름'] },
    { kana: 'け', romaji: 'ke', korean: '케', hint: '세로획 옆에 十를 세운 모양. 한자 計(계)를 흘려 쓴 글자라 소리도 "케".', note: KATA_NOTE, example: ['けむり', 'kemuri', '연기'] },
    { kana: 'こ', romaji: 'ko', korean: '코', hint: '두 획이 위아래로 놓인 모양. 한글 ㄷ을 벌려 놓은 것 같다.', note: KATA_NOTE, example: ['こころ', 'kokoro', '마음'] },
  ]),
  row('sa', 'basic', 'さ행', V, [
    { kana: 'さ', romaji: 'sa', korean: '사', hint: 'き에서 가로획 하나가 빠진 모양. 가로획 하나면 "사", 둘이면 "키".', example: ['さかな', 'sakana', '물고기'] },
    { kana: 'し', romaji: 'shi', korean: '시', alt: ['si'], hint: '아래로 쭉 내려가 끝이 휘는 낚싯바늘 한 획.', note: '영어 she처럼 "시". 혀를 세워 "스ㅣ"로 발음하지 않는다. 로마자는 shi(헵번식)와 si(훈령식) 둘 다 쓴다.', example: ['しお', 'shio', '소금'] },
    { kana: 'す', romaji: 'su', korean: '스', hint: '가로획에 매듭을 지은 모양. "스"프링처럼 꼬였다.', example: ['すし', 'sushi', '초밥'] },
    { kana: 'せ', romaji: 'se', korean: '세', hint: '가로획 하나에 세로획 둘, 오른쪽이 꺾인다. 한자 世(세)에서 왔고 소리도 "세".', example: ['せかい', 'sekai', '세계'] },
    { kana: 'そ', romaji: 'so', korean: '소', hint: '지그재그로 내려오는 한 획. 번개가 "소"리치며 떨어지는 모양.', example: ['そら', 'sora', '하늘'] },
  ]),
  row('ta', 'basic', 'た행', V, [
    { kana: 'た', romaji: 'ta', korean: '타', hint: '왼쪽은 ナ, 오른쪽은 こ. 가타카나 タ와 같은 한자 太에서 왔다.', note: TATA_NOTE, example: ['たこ', 'tako', '문어'] },
    { kana: 'ち', romaji: 'chi', korean: '치', alt: ['ti'], hint: '숫자 5를 닮았다. さ와 좌우가 반대로, 아래가 오른쪽으로 휜다.', note: '로마자는 chi(헵번식)와 ti(훈령식) 둘 다 쓴다. 영어 cheese의 "치".', example: ['ちかてつ', 'chikatetsu', '지하철'] },
    { kana: 'つ', romaji: 'tsu', korean: '츠', alt: ['tu'], hint: '파도(쓰나미, tsunami)의 물결 한 번.', note: '"츠"와 "쓰"의 중간 소리. 혀끝을 윗니 뒤에 대고 짧게. 로마자는 tsu(헵번식)와 tu(훈령식).', example: ['つき', 'tsuki', '달'] },
    { kana: 'て', romaji: 'te', korean: '테', hint: '가로획에서 왼쪽 아래로 미끄러지는 모양. 일본어로 손(手)이 "て".', note: TATA_NOTE, example: ['てんき', 'tenki', '날씨'] },
    { kana: 'と', romaji: 'to', korean: '토', hint: '세로획 끝이 둥글게 말리고 위에 짧은 획이 걸린다. "토"마토 꼭지.', note: TATA_NOTE, example: ['とり', 'tori', '새'] },
  ]),
  row('na', 'basic', 'な행', V, [
    { kana: 'な', romaji: 'na', korean: '나', hint: '왼쪽 위 ナ, 오른쪽 위 점, 아래에 매듭. 매듭이 "나"비 리본.', example: ['なつ', 'natsu', '여름'] },
    { kana: 'に', romaji: 'ni', korean: '니', hint: '왼쪽 세로획과 오른쪽 こ. 가타카나 ニ(획 두 개)와 같은 소리.', example: ['にく', 'niku', '고기'] },
    { kana: 'ぬ', romaji: 'nu', korean: '누', hint: 'め에 꼬리 매듭이 붙은 모양. 국수(누들, noodle)가 꼬여 있다.', example: ['ぬの', 'nuno', '천(옷감)'] },
    { kana: 'ね', romaji: 'ne', korean: '네', hint: '꼬리를 둥글게 말고 앉은 고양이(ねこ).', example: ['ねこ', 'neko', '고양이'] },
    { kana: 'の', romaji: 'no', korean: '노', hint: '소용돌이 한 번. 금지 표시 ⊘와 닮아 "노(no)".', example: ['のり', 'nori', '김'] },
  ]),
  row('ha', 'basic', 'は행', V, [
    { kana: 'は', romaji: 'ha', korean: '하', hint: '왼쪽 세로획, 오른쪽에 十와 매듭. ほ보다 가로획이 "하"나 적다.', note: '조사(~은/는)로 쓰일 때는 "와(wa)"로 읽는다.', example: ['はな', 'hana', '꽃'] },
    { kana: 'ひ', romaji: 'hi', korean: '히', hint: '"히히" 웃는 입 모양 한 획.', example: ['ひと', 'hito', '사람'] },
    { kana: 'ふ', romaji: 'fu', korean: '후', alt: ['hu'], hint: '네 획이 흩어져 "후" 하고 바람에 날리는 모양. 후지산(ふじさん)의 ふ.', note: '입술을 둥글게 모으지 않고 "후". 영어 f와 h의 중간 소리. 로마자는 fu와 hu 둘 다 쓴다.', example: ['ふね', 'fune', '배(선박)'] },
    { kana: 'へ', romaji: 'he', korean: '헤', hint: '낮은 산봉우리 하나. 한글 ㅅ을 납작하게 누른 모양.', note: '조사(~에/으로)로 쓰일 때는 "에(e)"로 읽는다.', example: ['へや', 'heya', '방'] },
    { kana: 'ほ', romaji: 'ho', korean: '호', hint: 'は에 가로획 하나를 더한 모양. 가로획 두 개면 "호".', example: ['ほし', 'hoshi', '별'] },
  ]),
  row('ma', 'basic', 'ま행', V, [
    { kana: 'ま', romaji: 'ma', korean: '마', hint: '가로획 둘을 세로획이 뚫고 내려와 매듭. "마"법 지팡이 끝의 구슬.', example: ['まち', 'machi', '마을, 거리'] },
    { kana: 'み', romaji: 'mi', korean: '미', hint: '숫자 21을 한 번에 이어 쓴 모양.', example: ['みみ', 'mimi', '귀'] },
    { kana: 'む', romaji: 'mu', korean: '무', hint: '소가 "무~" 하고 울 때 코에 코뚜레(매듭)를 건 모습.', example: ['むし', 'mushi', '벌레'] },
    { kana: 'め', romaji: 'me', korean: '메', hint: 'ぬ에서 꼬리 매듭을 뗀 모양. 일본어로 눈(目)이 "め".', example: ['ゆめ', 'yume', '꿈'] },
    { kana: 'も', romaji: 'mo', korean: '모', hint: '낚싯바늘 し에 가로획 둘을 더한 모양. 가타카나 モ와 거의 같다.', example: ['もり', 'mori', '숲'] },
  ]),
  row('ya', 'basic', 'や행', V, [
    { kana: 'や', romaji: 'ya', korean: '야', hint: '활에 화살(矢, や) 하나가 걸린 모양. 가타카나 ヤ와 거의 같다.', example: ['やま', 'yama', '산'] },
    null,
    { kana: 'ゆ', romaji: 'yu', korean: '유', hint: '한 획으로 둥글게 감고 세로획이 가운데를 가른다. 일본 목욕탕(湯, ゆ) 입구 천에 적힌 글자.', example: ['ゆき', 'yuki', '눈(雪)'] },
    null,
    { kana: 'よ', romaji: 'yo', korean: '요', hint: '세로획 옆에 짧은 가로획, 아래에 매듭. 요요(yo-yo) 줄이 감긴 모양.', example: ['よる', 'yoru', '밤'] },
  ]),
  row('ra', 'basic', 'ら행', V, [
    { kana: 'ら', romaji: 'ra', korean: '라', hint: '위의 점과 둥글게 말린 아래 획. ち와 헷갈리기 쉬운데, 윗부분이 점이면 "라", 긴 가로획이면 "치".', example: ['らいねん', 'rainen', '내년'] },
    { kana: 'り', romaji: 'ri', korean: '리', hint: '세로획 두 개, 오른쪽이 더 길고 왼쪽으로 휜다. い와 비교해 오른쪽이 길다.', example: ['りす', 'risu', '다람쥐'] },
    { kana: 'る', romaji: 'ru', korean: '루', hint: 'ろ 아래에 매듭이 붙은 모양. 매듭이 있으면 "루", 없으면 "로".', example: ['くるま', 'kuruma', '자동차'] },
    { kana: 'れ', romaji: 're', korean: '레', hint: 'ね와 닮았지만 끝이 매듭 없이 오른쪽 위로 뻗는다. "레"이저처럼 뻗는 끝.', example: ['れきし', 'rekishi', '역사'] },
    { kana: 'ろ', romaji: 'ro', korean: '로', hint: '숫자 3을 닮았다. る에서 매듭을 뺀 모양.', example: ['ろく', 'roku', '여섯(6)'] },
  ]),
  row('wa', 'basic', 'わ행', V, [
    { kana: 'わ', romaji: 'wa', korean: '와', hint: 'ね·れ와 왼쪽은 같고 오른쪽이 둥글게 닫힌다. 둥글면 "와", 매듭이면 "네", 뻗으면 "레".', example: ['わたし', 'watashi', '나, 저'] },
    null,
    null,
    null,
    { kana: 'を', romaji: 'wo', korean: '오', alt: ['o'], hint: '가로획 아래로 지그재그 매듭. 조사 "~을/를"에만 쓰인다.', note: '발음은 お와 같은 "오". 단어 안에는 거의 쓰이지 않고 목적격 조사로만 쓴다. 키보드 입력은 wo.', example: ['ほんをよむ', 'hon o yomu', '책을 읽다'] },
  ]),
  row('n', 'basic', 'ん', ['a'], [
    { kana: 'ん', romaji: 'n', korean: '응', alt: ['nn'], hint: '알파벳 h를 흘려 쓴 모양. 혼자서는 소리를 못 내고 받침 역할만 한다.', note: '뒤에 오는 소리에 따라 ㄴ·ㅁ·ㅇ 받침으로 들린다. 키보드 입력은 nn.', example: ['ほん', 'hon', '책'] },
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
    { kana: 'じ', romaji: 'ji', korean: '지', alt: ['zi'], note: '영어 j에 가까운 "지". ぢ와 발음이 같다.' },
    { kana: 'ず', romaji: 'zu', korean: '즈', note: 'づ와 발음이 같다.' },
    { kana: 'ぜ', romaji: 'ze', korean: '제', note: DAKU_NOTE },
    { kana: 'ぞ', romaji: 'zo', korean: '조', note: DAKU_NOTE },
  ]),
  row('da', 'dakuon', 'だ행', V, [
    { kana: 'だ', romaji: 'da', korean: '다', note: DAKU_NOTE },
    { kana: 'ぢ', romaji: 'ji', korean: '지', alt: ['di'], note: 'じ와 발음이 같다. 현대 일본어에서는 몇 단어에서만 쓰인다. 키보드 입력은 di.' },
    { kana: 'づ', romaji: 'zu', korean: '즈', alt: ['du'], note: 'ず와 발음이 같다. 현대 일본어에서는 몇 단어에서만 쓰인다. 키보드 입력은 du.' },
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
    { kana: 'びゃ', romaji: 'bya', korean: '뱨', note: YOON_NOTE },
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
