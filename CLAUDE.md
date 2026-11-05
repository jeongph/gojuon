# gojuon (오십음)

일본어를 처음 배우는 한국어 사용자를 위한 히라가나 암기 웹앱. 로그인·저장 없이 브라우저에서 바로 쓴다.

- 배포 주소: https://jeongph.github.io/gojuon/
- 상위 워크스페이스 정책(`../../CLAUDE.md`)의 커밋·주석·언어 컨벤션을 따른다.

## 개발 명령어

```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 (http://localhost:5173/gojuon/)
npm test           # 단위 테스트 (vitest)
npm run typecheck  # 타입 검사
npm run build      # 타입 검사 + 프로덕션 빌드 (dist/)
```

## 스택

- Vite + React 19 + TypeScript
- 스타일은 순수 CSS. `src/styles/tokens.css`의 CSS 변수가 디자인 토큰이고, 라이브러리 없이 BEM식 클래스를 쓴다.
- 폰트: UI는 Pretendard(jsdelivr), 가나 표시는 Klee One(Google Fonts). 둘 다 CDN이며 번들에 포함하지 않는다.
- 라우팅은 `src/hooks/useHashRoute.ts`의 해시 라우팅(`#/chart`, `#/learn`, `#/quiz`). GitHub Pages가 SPA 리라이트를 지원하지 않아서다.

## 구조

```
src/
  data/        가나 데이터. types.ts의 Kana/KanaRow 모델, hiragana.ts의 실제 데이터
  lib/         순수 로직 (romaji 매칭, quiz 문제 생성, session 통계, speech 음성)
  hooks/       해시 라우팅, 테마, 미디어쿼리
  components/  공용 UI (TopBar, Segmented, Button, RangePicker 등)
  features/    화면 단위. chart(표) / learn(카드 학습) / quiz(퀴즈)
  styles/      tokens.css(디자인 토큰), global.css, components.css
```

## 설계 원칙

- `Kana` 모델은 `script` 축을 가진다. 가타카나를 추가할 때 데이터 파일만 늘리고 UI는 재사용하는 것이 목표.
- 로직(`src/lib`)은 React에 의존하지 않는 순수 함수로 두고 vitest로 테스트한다. 난수는 `rng` 주입으로 재현 가능하게 한다.
- 상태는 모두 메모리. localStorage 등 영속 저장은 쓰지 않는다 (요구사항).
- 디자인: 차가운 회백색 종이 바탕, 먹색 글자, 강조색은 쪽빛(`--ai`) 하나. 정답·오답 색은 퀴즈 피드백에만 쓴다. 장식용 그림자·그라데이션·입장 애니메이션을 넣지 않는다.

## Git 워크플로우

이 레포는 워크스페이스 기본값(Git Flow) 대신 **GitHub Flow**를 쓴다.

- `main`이 배포 브랜치. push 시 GitHub Actions(`.github/workflows/deploy.yml`)가 테스트·빌드 후 Pages에 배포한다.
- 작업은 `feature/<이름>` 브랜치에서 하고 `main`으로 PR을 만든 뒤 바로 머지한다.

## 작업 관리

- 작업 상태판: `docs/tasks.md`
- 설계 문서: `docs/superpowers/specs/`
