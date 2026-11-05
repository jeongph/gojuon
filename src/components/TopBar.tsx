import type { Route } from '../hooks/useHashRoute'
import { hrefFor } from '../hooks/useHashRoute'
import type { Theme } from '../hooks/useTheme'
import { MoonIcon, SunIcon } from './Icons'

const NAV: { route: Route; label: string }[] = [
  { route: 'chart', label: '표' },
  { route: 'learn', label: '학습' },
  { route: 'quiz', label: '퀴즈' },
]

type Props = {
  route: Route
  theme: Theme
  onToggleTheme: () => void
}

export function TopBar({ route, theme, onToggleTheme }: Props) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="wordmark" href={hrefFor('chart')}>
          <span className="wordmark__ko">오십음</span>
          <span className="wordmark__ja">ごじゅうおん</span>
        </a>
        <nav className="nav" aria-label="주요 화면">
          {NAV.map((item) => (
            <a
              key={item.route}
              className="nav__link"
              href={hrefFor(item.route)}
              aria-current={route === item.route ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="icon-button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? '밝은 화면으로 바꾸기' : '어두운 화면으로 바꾸기'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  )
}
