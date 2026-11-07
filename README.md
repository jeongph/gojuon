# 오십음 ごじゅうおん

일본어를 처음 배우는 사람을 위한 히라가나 암기 연습장입니다. 로그인도, 저장도 없이 브라우저에서 바로 씁니다.

**https://jeongph.github.io/gojuon/**

## 할 수 있는 것

- **표**: 오십음도를 기본 46자, 탁음·반탁음, 요음으로 나눠 봅니다. 글자를 누르면 로마자, 한국어 발음, 획순, 발음 메모, 예시 단어가 나오고 브라우저 음성으로 들을 수 있습니다. 획순은 번호가 붙은 도안으로 보이고, 재생을 누르면 획이 순서대로 그려집니다.
- **학습**: 행 단위로 범위를 골라 카드를 넘깁니다. 바로 떠오르지 않은 글자는 뒤로 밀려 다시 나옵니다. 카드 뒷면에서 획순을 확인하고 재생할 수 있습니다. 가나를 보고 소리를 떠올리거나, 소리를 보고 가나를 떠올리는 방향을 고를 수 있습니다.
- **퀴즈**: 가나 보고 소리 고르기, 소리 보고 가나 고르기, 로마자로 입력하기 세 방식. 오답 선택지는 같은 행·단의 비슷한 글자에서 골라 변별 연습이 됩니다. 틀린 글자만 다시 풀 수 있습니다.

모든 진행 상황은 창을 닫으면 사라집니다. 계정이나 추적 없이 가볍게 쓰려고 그렇게 두었습니다.

## 개발

```bash
npm install
npm run dev      # http://localhost:5173/gojuon/
npm test
npm run build
```

획순 데이터는 `npm run strokes:fetch`로 KanjiVG에서 받아 `src/data/strokes.ts`로 생성합니다 (Node 23.6 이상). 생성 결과를 커밋하므로 앱은 런타임에 외부 요청을 하지 않습니다.

Vite + React + TypeScript로 만들었고, `main` 브랜치에 푸시하면 GitHub Actions가 GitHub Pages로 배포합니다.

## 라이선스

코드는 MIT입니다.

획순 데이터(`src/data/strokes.ts`)는 [KanjiVG](https://kanjivg.tagaini.net)(Copyright Ulrich Apel)에서 생성했으며, 원 저작물과 같은 [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) 라이선스를 따릅니다.
