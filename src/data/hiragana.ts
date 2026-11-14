import type { Kana, KanaGroup, KanaRow, Vowel } from './types'

type Cell = {
  kana: string
  romaji: string
  korean: string
  alt?: string[]
  note?: string
  /** 최대 3개. 고유어가 드문 요음(みゅ 등)은 있는 만큼만 */
  examples?: [word: string, reading: string, meaning: string][]
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
      examples: (cell.examples ?? []).map(([word, reading, meaning]) => ({ word, reading, meaning })),
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
    { kana: 'あ', romaji: 'a', korean: '아', examples: [['あめ', 'ame', '비'], ['あさ', 'asa', '아침'], ['おかあさん', 'okaasan', '어머니']] },
    { kana: 'い', romaji: 'i', korean: '이', examples: [['いぬ', 'inu', '개'], ['いえ', 'ie', '집'], ['あおい', 'aoi', '파랗다']] },
    { kana: 'う', romaji: 'u', korean: '우', examples: [['うみ', 'umi', '바다'], ['うた', 'uta', '노래'], ['くうき', 'kuuki', '공기']] },
    { kana: 'え', romaji: 'e', korean: '에', examples: [['えき', 'eki', '역'], ['えほん', 'ehon', '그림책'], ['まえ', 'mae', '앞']] },
    { kana: 'お', romaji: 'o', korean: '오', examples: [['おかね', 'okane', '돈'], ['おと', 'oto', '소리'], ['かお', 'kao', '얼굴']] },
  ]),
  row('ka', 'basic', 'か행', V, [
    { kana: 'か', romaji: 'ka', korean: '카', note: KATA_NOTE, examples: [['かさ', 'kasa', '우산'], ['かばん', 'kaban', '가방'], ['あかい', 'akai', '빨갛다']] },
    { kana: 'き', romaji: 'ki', korean: '키', note: KATA_NOTE, examples: [['きつね', 'kitsune', '여우'], ['きって', 'kitte', '우표'], ['あき', 'aki', '가을']] },
    { kana: 'く', romaji: 'ku', korean: '쿠', note: KATA_NOTE, examples: [['くも', 'kumo', '구름'], ['くつ', 'kutsu', '신발'], ['きく', 'kiku', '듣다']] },
    { kana: 'け', romaji: 'ke', korean: '케', note: KATA_NOTE, examples: [['けむり', 'kemuri', '연기'], ['けしごむ', 'keshigomu', '지우개'], ['たけ', 'take', '대나무']] },
    { kana: 'こ', romaji: 'ko', korean: '코', note: KATA_NOTE, examples: [['こころ', 'kokoro', '마음'], ['こども', 'kodomo', '아이'], ['すこし', 'sukoshi', '조금']] },
  ]),
  row('sa', 'basic', 'さ행', V, [
    { kana: 'さ', romaji: 'sa', korean: '사', examples: [['さかな', 'sakana', '물고기'], ['さくら', 'sakura', '벚꽃'], ['うさぎ', 'usagi', '토끼']] },
    { kana: 'し', romaji: 'shi', korean: '시', alt: ['si'], note: '영어 she처럼 "시". 혀를 세워 "스ㅣ"로 발음하지 않는다. 로마자는 shi(헵번식)와 si(훈령식) 둘 다 쓴다.', examples: [['しお', 'shio', '소금'], ['しま', 'shima', '섬'], ['あし', 'ashi', '다리, 발']] },
    { kana: 'す', romaji: 'su', korean: '스', examples: [['すし', 'sushi', '초밥'], ['すいか', 'suika', '수박'], ['いす', 'isu', '의자']] },
    { kana: 'せ', romaji: 'se', korean: '세', examples: [['せかい', 'sekai', '세계'], ['せなか', 'senaka', '등(신체)'], ['あせ', 'ase', '땀']] },
    { kana: 'そ', romaji: 'so', korean: '소', examples: [['そら', 'sora', '하늘'], ['そと', 'soto', '바깥'], ['うそ', 'uso', '거짓말']] },
  ]),
  row('ta', 'basic', 'た행', V, [
    { kana: 'た', romaji: 'ta', korean: '타', note: TATA_NOTE, examples: [['たこ', 'tako', '문어'], ['たまご', 'tamago', '달걀'], ['かた', 'kata', '어깨']] },
    { kana: 'ち', romaji: 'chi', korean: '치', alt: ['ti'], note: '로마자는 chi(헵번식)와 ti(훈령식) 둘 다 쓴다. 영어 cheese의 "치".', examples: [['ちかてつ', 'chikatetsu', '지하철'], ['ちず', 'chizu', '지도'], ['くち', 'kuchi', '입']] },
    { kana: 'つ', romaji: 'tsu', korean: '츠', alt: ['tu'], note: '"츠"와 "쓰"의 중간 소리. 혀끝을 윗니 뒤에 대고 짧게. 로마자는 tsu(헵번식)와 tu(훈령식).', examples: [['つき', 'tsuki', '달'], ['つくえ', 'tsukue', '책상'], ['あつい', 'atsui', '덥다']] },
    { kana: 'て', romaji: 'te', korean: '테', note: TATA_NOTE, examples: [['てんき', 'tenki', '날씨'], ['てがみ', 'tegami', '편지'], ['あさって', 'asatte', '모레']] },
    { kana: 'と', romaji: 'to', korean: '토', note: TATA_NOTE, examples: [['とり', 'tori', '새'], ['とけい', 'tokei', '시계'], ['いもうと', 'imouto', '여동생']] },
  ]),
  row('na', 'basic', 'な행', V, [
    { kana: 'な', romaji: 'na', korean: '나', examples: [['なつ', 'natsu', '여름'], ['なまえ', 'namae', '이름'], ['みんな', 'minna', '모두']] },
    { kana: 'に', romaji: 'ni', korean: '니', examples: [['にく', 'niku', '고기'], ['にわ', 'niwa', '마당'], ['かに', 'kani', '게']] },
    { kana: 'ぬ', romaji: 'nu', korean: '누', examples: [['ぬの', 'nuno', '천(옷감)'], ['ぬいぐるみ', 'nuigurumi', '봉제 인형'], ['いぬ', 'inu', '개']] },
    { kana: 'ね', romaji: 'ne', korean: '네', examples: [['ねこ', 'neko', '고양이'], ['ねつ', 'netsu', '열(체온)'], ['あね', 'ane', '언니, 누나']] },
    { kana: 'の', romaji: 'no', korean: '노', examples: [['のり', 'nori', '김'], ['のど', 'nodo', '목(목구멍)'], ['きのこ', 'kinoko', '버섯']] },
  ]),
  row('ha', 'basic', 'は행', V, [
    { kana: 'は', romaji: 'ha', korean: '하', note: '조사(~은/는)로 쓰일 때는 "와(wa)"로 읽는다.', examples: [['はな', 'hana', '꽃'], ['はし', 'hashi', '젓가락'], ['ごはん', 'gohan', '밥']] },
    { kana: 'ひ', romaji: 'hi', korean: '히', examples: [['ひと', 'hito', '사람'], ['ひかり', 'hikari', '빛'], ['あさひ', 'asahi', '아침 해']] },
    { kana: 'ふ', romaji: 'fu', korean: '후', alt: ['hu'], note: '입술을 둥글게 모으지 않고 "후". 영어 f와 h의 중간 소리. 로마자는 fu와 hu 둘 다 쓴다.', examples: [['ふね', 'fune', '배(선박)'], ['ふゆ', 'fuyu', '겨울'], ['さいふ', 'saifu', '지갑']] },
    { kana: 'へ', romaji: 'he', korean: '헤', note: '조사(~에/으로)로 쓰일 때는 "에(e)"로 읽는다.', examples: [['へや', 'heya', '방'], ['へび', 'hebi', '뱀'], ['おへそ', 'oheso', '배꼽']] },
    { kana: 'ほ', romaji: 'ho', korean: '호', examples: [['ほし', 'hoshi', '별'], ['ほん', 'hon', '책'], ['ほね', 'hone', '뼈']] },
  ]),
  row('ma', 'basic', 'ま행', V, [
    { kana: 'ま', romaji: 'ma', korean: '마', examples: [['まち', 'machi', '마을, 거리'], ['まど', 'mado', '창문'], ['くま', 'kuma', '곰']] },
    { kana: 'み', romaji: 'mi', korean: '미', examples: [['みみ', 'mimi', '귀'], ['みず', 'mizu', '물'], ['かみ', 'kami', '종이']] },
    { kana: 'む', romaji: 'mu', korean: '무', examples: [['むし', 'mushi', '벌레'], ['むら', 'mura', '마을'], ['さむい', 'samui', '춥다']] },
    { kana: 'め', romaji: 'me', korean: '메', examples: [['ゆめ', 'yume', '꿈'], ['めがね', 'megane', '안경'], ['まめ', 'mame', '콩']] },
    { kana: 'も', romaji: 'mo', korean: '모', examples: [['もり', 'mori', '숲'], ['もも', 'momo', '복숭아'], ['ともだち', 'tomodachi', '친구']] },
  ]),
  row('ya', 'basic', 'や행', V, [
    { kana: 'や', romaji: 'ya', korean: '야', examples: [['やま', 'yama', '산'], ['やさい', 'yasai', '채소'], ['はやい', 'hayai', '빠르다']] },
    null,
    { kana: 'ゆ', romaji: 'yu', korean: '유', examples: [['ゆき', 'yuki', '눈(雪)'], ['ゆび', 'yubi', '손가락'], ['まゆ', 'mayu', '눈썹']] },
    null,
    { kana: 'よ', romaji: 'yo', korean: '요', examples: [['よる', 'yoru', '밤'], ['よこ', 'yoko', '옆'], ['つよい', 'tsuyoi', '강하다']] },
  ]),
  row('ra', 'basic', 'ら행', V, [
    { kana: 'ら', romaji: 'ra', korean: '라', examples: [['らいねん', 'rainen', '내년'], ['からだ', 'karada', '몸'], ['とら', 'tora', '호랑이']] },
    { kana: 'り', romaji: 'ri', korean: '리', examples: [['りす', 'risu', '다람쥐'], ['りんご', 'ringo', '사과'], ['くすり', 'kusuri', '약']] },
    { kana: 'る', romaji: 'ru', korean: '루', examples: [['くるま', 'kuruma', '자동차'], ['はる', 'haru', '봄'], ['るす', 'rusu', '집을 비움, 부재중']] },
    { kana: 'れ', romaji: 're', korean: '레', examples: [['れきし', 'rekishi', '역사'], ['れいぞうこ', 'reizouko', '냉장고'], ['これ', 'kore', '이것']] },
    { kana: 'ろ', romaji: 'ro', korean: '로', examples: [['ろく', 'roku', '여섯(6)'], ['いろ', 'iro', '색'], ['うしろ', 'ushiro', '뒤']] },
  ]),
  row('wa', 'basic', 'わ행', V, [
    { kana: 'わ', romaji: 'wa', korean: '와', examples: [['わたし', 'watashi', '나, 저'], ['かわ', 'kawa', '강'], ['でんわ', 'denwa', '전화']] },
    null,
    null,
    null,
    { kana: 'を', romaji: 'wo', korean: '오', alt: ['o'], note: '발음은 お와 같은 "오". 단어 안에는 거의 쓰이지 않고 목적격 조사로만 쓴다. 키보드 입력은 wo.', examples: [['ほんをよむ', 'hon o yomu', '책을 읽다'], ['みずをのむ', 'mizu o nomu', '물을 마시다'], ['てをあらう', 'te o arau', '손을 씻다']] },
  ]),
  row('n', 'basic', 'ん', ['a'], [
    { kana: 'ん', romaji: 'n', korean: '응', alt: ['nn'], note: '뒤에 오는 소리에 따라 ㄴ·ㅁ·ㅇ 받침으로 들린다. 키보드 입력은 nn.', examples: [['ほん', 'hon', '책'], ['みかん', 'mikan', '귤'], ['せんせい', 'sensei', '선생님']] },
  ]),
]

const DAKU_NOTE = '청음에 탁점(゛)을 붙여 소리를 울리게 한 글자.'

export const HIRAGANA_DAKUON: KanaRow[] = [
  row('ga', 'dakuon', 'が행', V, [
    { kana: 'が', romaji: 'ga', korean: '가', note: DAKU_NOTE, examples: [['がっこう', 'gakkou', '학교'], ['めがね', 'megane', '안경'], ['まんが', 'manga', '만화']] },
    { kana: 'ぎ', romaji: 'gi', korean: '기', note: DAKU_NOTE, examples: [['ぎんこう', 'ginkou', '은행'], ['かぎ', 'kagi', '열쇠'], ['うさぎ', 'usagi', '토끼']] },
    { kana: 'ぐ', romaji: 'gu', korean: '구', note: DAKU_NOTE, examples: [['どうぐ', 'dougu', '도구'], ['かぐ', 'kagu', '가구'], ['すぐ', 'sugu', '곧, 바로']] },
    { kana: 'げ', romaji: 'ge', korean: '게', note: DAKU_NOTE, examples: [['げんき', 'genki', '건강함, 기운'], ['ひげ', 'hige', '수염'], ['かげ', 'kage', '그림자']] },
    { kana: 'ご', romaji: 'go', korean: '고', note: DAKU_NOTE, examples: [['ごはん', 'gohan', '밥'], ['たまご', 'tamago', '달걀'], ['いちご', 'ichigo', '딸기']] },
  ]),
  row('za', 'dakuon', 'ざ행', V, [
    { kana: 'ざ', romaji: 'za', korean: '자', note: DAKU_NOTE, examples: [['ざっし', 'zasshi', '잡지'], ['ひざ', 'hiza', '무릎'], ['かざり', 'kazari', '장식']] },
    { kana: 'じ', romaji: 'ji', korean: '지', alt: ['zi'], note: '영어 j에 가까운 "지". ぢ와 소리가 완전히 같아 로마자도 둘 다 ji다. 보통은 じ를 쓴다.', examples: [['じかん', 'jikan', '시간'], ['かじ', 'kaji', '불, 화재'], ['ひつじ', 'hitsuji', '양']] },
    { kana: 'ず', romaji: 'zu', korean: '즈', note: 'づ와 소리가 완전히 같아 로마자도 둘 다 zu다. 보통은 ず를 쓴다.', examples: [['ずっと', 'zutto', '줄곧, 계속'], ['みず', 'mizu', '물'], ['すずめ', 'suzume', '참새']] },
    { kana: 'ぜ', romaji: 'ze', korean: '제', note: DAKU_NOTE, examples: [['ぜんぶ', 'zenbu', '전부'], ['かぜ', 'kaze', '바람, 감기'], ['なぜ', 'naze', '왜']] },
    { kana: 'ぞ', romaji: 'zo', korean: '조', note: DAKU_NOTE, examples: [['ぞう', 'zou', '코끼리'], ['かぞく', 'kazoku', '가족'], ['なぞ', 'nazo', '수수께끼']] },
  ]),
  row('da', 'dakuon', 'だ행', V, [
    { kana: 'だ', romaji: 'da', korean: '다', note: DAKU_NOTE, examples: [['だいがく', 'daigaku', '대학'], ['からだ', 'karada', '몸'], ['ともだち', 'tomodachi', '친구']] },
    { kana: 'ぢ', romaji: 'ji', korean: '지', alt: ['di', 'zi'], note: 'じ와 소리가 완전히 같다. 표준어에서는 두 글자의 구별이 사라져 로마자도 같은 ji를 쓴다. はなぢ(코피), ちぢむ(줄어들다)처럼 ち가 탁음으로 바뀐 자리에만 쓴다. 키보드 입력은 di.', examples: [['はなぢ', 'hanaji', '코피'], ['ちぢむ', 'chijimu', '줄어들다'], ['まぢか', 'majika', '바로 가까이, 코앞']] },
    { kana: 'づ', romaji: 'zu', korean: '즈', alt: ['du'], note: 'ず와 소리가 완전히 같다. 표준어에서는 두 글자의 구별이 사라져 로마자도 같은 zu를 쓴다. つづく(계속되다), みかづき(초승달)처럼 つ가 탁음으로 바뀐 자리에만 쓴다. 키보드 입력은 du.', examples: [['つづく', 'tsuzuku', '계속되다'], ['みかづき', 'mikazuki', '초승달'], ['こづつみ', 'kozutsumi', '소포']] },
    { kana: 'で', romaji: 'de', korean: '데', note: DAKU_NOTE, examples: [['でんわ', 'denwa', '전화'], ['でぐち', 'deguchi', '출구'], ['うで', 'ude', '팔']] },
    { kana: 'ど', romaji: 'do', korean: '도', note: DAKU_NOTE, examples: [['どうぶつ', 'doubutsu', '동물'], ['まど', 'mado', '창문'], ['こども', 'kodomo', '아이']] },
  ]),
  row('ba', 'dakuon', 'ば행', V, [
    { kana: 'ば', romaji: 'ba', korean: '바', note: DAKU_NOTE, examples: [['ばら', 'bara', '장미'], ['かばん', 'kaban', '가방'], ['ことば', 'kotoba', '말, 단어']] },
    { kana: 'び', romaji: 'bi', korean: '비', note: DAKU_NOTE, examples: [['びん', 'bin', '병(유리병)'], ['ゆび', 'yubi', '손가락'], ['へび', 'hebi', '뱀']] },
    { kana: 'ぶ', romaji: 'bu', korean: '부', note: DAKU_NOTE, examples: [['ぶた', 'buta', '돼지'], ['しんぶん', 'shinbun', '신문'], ['てぶくろ', 'tebukuro', '장갑']] },
    { kana: 'べ', romaji: 'be', korean: '베', note: DAKU_NOTE, examples: [['べんとう', 'bentou', '도시락'], ['かべ', 'kabe', '벽'], ['なべ', 'nabe', '냄비']] },
    { kana: 'ぼ', romaji: 'bo', korean: '보', note: DAKU_NOTE, examples: [['ぼうし', 'boushi', '모자'], ['つぼ', 'tsubo', '항아리'], ['とんぼ', 'tonbo', '잠자리']] },
  ]),
]

const HANDAKU_NOTE = 'は행에 반탁점(゜)을 붙인 글자. ㅍ 소리.'

export const HIRAGANA_HANDAKUON: KanaRow[] = [
  row('pa', 'handakuon', 'ぱ행', V, [
    { kana: 'ぱ', romaji: 'pa', korean: '파', note: HANDAKU_NOTE, examples: [['かんぱい', 'kanpai', '건배'], ['しんぱい', 'shinpai', '걱정'], ['いっぱい', 'ippai', '가득']] },
    { kana: 'ぴ', romaji: 'pi', korean: '피', note: HANDAKU_NOTE, examples: [['えんぴつ', 'enpitsu', '연필'], ['しんぴ', 'shinpi', '신비'], ['ぴかぴか', 'pikapika', '반짝반짝 (의태어)']] },
    { kana: 'ぷ', romaji: 'pu', korean: '푸', note: HANDAKU_NOTE, examples: [['てんぷら', 'tenpura', '튀김'], ['きっぷ', 'kippu', '표, 승차권'], ['さんぷん', 'sanpun', '3분']] },
    { kana: 'ぺ', romaji: 'pe', korean: '페', note: HANDAKU_NOTE, examples: [['かんぺき', 'kanpeki', '완벽'], ['てっぺん', 'teppen', '꼭대기'], ['ぺこぺこ', 'pekopeko', '배가 몹시 고픈 모양 (의태어)']] },
    { kana: 'ぽ', romaji: 'po', korean: '포', note: HANDAKU_NOTE, examples: [['さんぽ', 'sanpo', '산책'], ['しっぽ', 'shippo', '꼬리'], ['たんぽぽ', 'tanpopo', '민들레']] },
  ]),
]

const YOON_NOTE = 'い단 글자 뒤에 작은 ゃ·ゅ·ょ를 붙여 한 음절로 읽는다.'

export const HIRAGANA_YOON: KanaRow[] = [
  row('kya', 'yoon', 'きゃ행', Y, [
    { kana: 'きゃ', romaji: 'kya', korean: '캬', note: YOON_NOTE, examples: [['おきゃくさん', 'okyakusan', '손님'], ['かんきゃく', 'kankyaku', '관객'], ['じょうきゃく', 'joukyaku', '승객']] },
    { kana: 'きゅ', romaji: 'kyu', korean: '큐', note: YOON_NOTE, examples: [['きゅうり', 'kyuuri', '오이'], ['きゅう', 'kyuu', '아홉(9)'], ['やきゅう', 'yakyuu', '야구']] },
    { kana: 'きょ', romaji: 'kyo', korean: '쿄', note: YOON_NOTE, examples: [['きょう', 'kyou', '오늘'], ['きょうしつ', 'kyoushitsu', '교실'], ['べんきょう', 'benkyou', '공부']] },
  ]),
  row('sha', 'yoon', 'しゃ행', Y, [
    { kana: 'しゃ', romaji: 'sha', korean: '샤', alt: ['sya'], note: YOON_NOTE, examples: [['しゃしん', 'shashin', '사진'], ['かいしゃ', 'kaisha', '회사'], ['でんしゃ', 'densha', '전철']] },
    { kana: 'しゅ', romaji: 'shu', korean: '슈', alt: ['syu'], note: YOON_NOTE, examples: [['しゅくだい', 'shukudai', '숙제'], ['しゅみ', 'shumi', '취미'], ['かしゅ', 'kashu', '가수']] },
    { kana: 'しょ', romaji: 'sho', korean: '쇼', alt: ['syo'], note: YOON_NOTE, examples: [['しょくじ', 'shokuji', '식사'], ['としょかん', 'toshokan', '도서관'], ['いっしょ', 'issho', '함께']] },
  ]),
  row('cha', 'yoon', 'ちゃ행', Y, [
    { kana: 'ちゃ', romaji: 'cha', korean: '챠', alt: ['tya'], note: YOON_NOTE, examples: [['おちゃ', 'ocha', '차(마시는 차)'], ['おもちゃ', 'omocha', '장난감'], ['ちゃわん', 'chawan', '밥공기, 찻잔']] },
    { kana: 'ちゅ', romaji: 'chu', korean: '츄', alt: ['tyu'], note: YOON_NOTE, examples: [['ちゅうい', 'chuui', '주의'], ['ちゅうごく', 'chuugoku', '중국'], ['うちゅう', 'uchuu', '우주']] },
    { kana: 'ちょ', romaji: 'cho', korean: '쵸', alt: ['tyo'], note: YOON_NOTE, examples: [['ちょっと', 'chotto', '조금, 잠깐'], ['ちょきん', 'chokin', '저금'], ['ちょうし', 'choushi', '상태, 컨디션']] },
  ]),
  row('nya', 'yoon', 'にゃ행', Y, [
    { kana: 'にゃ', romaji: 'nya', korean: '냐', note: YOON_NOTE, examples: [['こんにゃく', 'konnyaku', '곤약'], ['にゃあ', 'nyaa', '야옹 (의성어)'], ['ふにゃふにゃ', 'funyafunya', '흐물흐물 (의태어)']] },
    { kana: 'にゅ', romaji: 'nyu', korean: '뉴', note: YOON_NOTE, examples: [['にゅうがく', 'nyuugaku', '입학'], ['にゅういん', 'nyuuin', '입원'], ['ぎゅうにゅう', 'gyuunyuu', '우유']] },
    { kana: 'にょ', romaji: 'nyo', korean: '뇨', note: YOON_NOTE, examples: [['にょろにょろ', 'nyoronyoro', '꿈틀꿈틀 기어가는 모양 (의태어)'], ['にょきにょき', 'nyokinyoki', '쑥쑥 솟아나는 모양 (의태어)']] },
  ]),
  row('hya', 'yoon', 'ひゃ행', Y, [
    { kana: 'ひゃ', romaji: 'hya', korean: '햐', note: YOON_NOTE, examples: [['ひゃく', 'hyaku', '백(100)'], ['ひゃくえん', 'hyakuen', '100엔'], ['ひゃっかてん', 'hyakkaten', '백화점']] },
    { kana: 'ひゅ', romaji: 'hyu', korean: '휴', note: YOON_NOTE, examples: [['ひゅうひゅう', 'hyuuhyuu', '바람이 휭휭 부는 소리 (의성어)']] },
    { kana: 'ひょ', romaji: 'hyo', korean: '효', note: YOON_NOTE, examples: [['ひょうじょう', 'hyoujou', '표정'], ['ひょうし', 'hyoushi', '표지(책 겉면)'], ['だいひょう', 'daihyou', '대표']] },
  ]),
  row('mya', 'yoon', 'みゃ행', Y, [
    { kana: 'みゃ', romaji: 'mya', korean: '먀', note: YOON_NOTE, examples: [['みゃく', 'myaku', '맥, 맥박'], ['さんみゃく', 'sanmyaku', '산맥'], ['どうみゃく', 'doumyaku', '동맥']] },
    { kana: 'みゅ', romaji: 'myu', korean: '뮤', note: `${YOON_NOTE} 일본 고유어에는 거의 없고, ミュージック(음악) 같은 가타카나 외래어에서 주로 쓴다.` },
    { kana: 'みょ', romaji: 'myo', korean: '묘', note: YOON_NOTE, examples: [['みょうじ', 'myouji', '성(姓)'], ['みょうにち', 'myounichi', '내일(격식 있는 말)'], ['きみょう', 'kimyou', '기묘함']] },
  ]),
  row('rya', 'yoon', 'りゃ행', Y, [
    { kana: 'りゃ', romaji: 'rya', korean: '랴', note: YOON_NOTE, examples: [['りゃくご', 'ryakugo', '약어, 줄임말'], ['りゃくず', 'ryakuzu', '약도'], ['しょうりゃく', 'shouryaku', '생략']] },
    { kana: 'りゅ', romaji: 'ryu', korean: '류', note: YOON_NOTE, examples: [['りゅう', 'ryuu', '용'], ['りゅうがく', 'ryuugaku', '유학'], ['こうりゅう', 'kouryuu', '교류']] },
    { kana: 'りょ', romaji: 'ryo', korean: '료', note: YOON_NOTE, examples: [['りょこう', 'ryokou', '여행'], ['りょうり', 'ryouri', '요리'], ['りょうしん', 'ryoushin', '부모님']] },
  ]),
  row('gya', 'yoon', 'ぎゃ행', Y, [
    { kana: 'ぎゃ', romaji: 'gya', korean: '갸', note: YOON_NOTE, examples: [['ぎゃく', 'gyaku', '반대, 거꾸로'], ['ぎゃくてん', 'gyakuten', '역전'], ['ぎゃっこう', 'gyakkou', '역광']] },
    { kana: 'ぎゅ', romaji: 'gyu', korean: '규', note: YOON_NOTE, examples: [['ぎゅうにゅう', 'gyuunyuu', '우유'], ['ぎゅうにく', 'gyuuniku', '소고기'], ['ぎゅうどん', 'gyuudon', '소고기덮밥']] },
    { kana: 'ぎょ', romaji: 'gyo', korean: '교', note: YOON_NOTE, examples: [['きんぎょ', 'kingyo', '금붕어'], ['ぎょうざ', 'gyouza', '교자(군만두)'], ['ぎょうれつ', 'gyouretsu', '행렬, 줄']] },
  ]),
  row('ja', 'yoon', 'じゃ행', Y, [
    { kana: 'じゃ', romaji: 'ja', korean: '자', alt: ['jya', 'zya'], note: YOON_NOTE, examples: [['じゃま', 'jama', '방해'], ['じゃがいも', 'jagaimo', '감자'], ['にんじゃ', 'ninja', '닌자']] },
    { kana: 'じゅ', romaji: 'ju', korean: '주', alt: ['jyu', 'zyu'], note: YOON_NOTE, examples: [['じゅぎょう', 'jugyou', '수업'], ['じゅう', 'juu', '열(10)'], ['じゅんばん', 'junban', '순서']] },
    { kana: 'じょ', romaji: 'jo', korean: '조', alt: ['jyo', 'zyo'], note: YOON_NOTE, examples: [['じょうず', 'jouzu', '능숙함, 잘함'], ['じょせい', 'josei', '여성'], ['かのじょ', 'kanojo', '그녀']] },
  ]),
  row('bya', 'yoon', 'びゃ행', Y, [
    { kana: 'びゃ', romaji: 'bya', korean: '뱌', note: YOON_NOTE, examples: [['さんびゃく', 'sanbyaku', '삼백(300)'], ['びゃくや', 'byakuya', '백야']] },
    { kana: 'びゅ', romaji: 'byu', korean: '뷰', note: YOON_NOTE, examples: [['びゅうびゅう', 'byuubyuu', '바람이 세차게 부는 소리 (의성어)'], ['びゅんびゅん', 'byunbyun', '빠르게 휙휙 지나가는 모양 (의태어)']] },
    { kana: 'びょ', romaji: 'byo', korean: '뵤', note: YOON_NOTE, examples: [['びょういん', 'byouin', '병원'], ['びょうき', 'byouki', '병'], ['びょうどう', 'byoudou', '평등']] },
  ]),
  row('pya', 'yoon', 'ぴゃ행', Y, [
    { kana: 'ぴゃ', romaji: 'pya', korean: '퍄', note: YOON_NOTE, examples: [['ろっぴゃく', 'roppyaku', '육백(600)'], ['はっぴゃく', 'happyaku', '팔백(800)']] },
    { kana: 'ぴゅ', romaji: 'pyu', korean: '퓨', note: YOON_NOTE, examples: [['ぴゅうぴゅう', 'pyuupyuu', '바람이 쌩쌩 부는 소리 (의성어)']] },
    { kana: 'ぴょ', romaji: 'pyo', korean: '표', note: YOON_NOTE, examples: [['はっぴょう', 'happyou', '발표'], ['いっぴょう', 'ippyou', '한 표'], ['ぴょんぴょん', 'pyonpyon', '깡충깡충 (의태어)']] },
  ]),
]

export const HIRAGANA_ROWS: KanaRow[] = [
  ...HIRAGANA_BASIC,
  ...HIRAGANA_DAKUON,
  ...HIRAGANA_HANDAKUON,
  ...HIRAGANA_YOON,
]

export const HIRAGANA: Kana[] = HIRAGANA_ROWS.flatMap((r) => r.kana)
