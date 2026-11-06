import { useState } from 'react'
import { TopBar } from './components/TopBar'
import { ChartPage } from './features/chart/ChartPage'
import { LearnPage } from './features/learn/LearnPage'
import { QuizPage } from './features/quiz/QuizPage'
import { useHashRoute } from './hooks/useHashRoute'
import { useTheme } from './hooks/useTheme'
import { emptyStats, type KanaStats } from './lib/session'

export default function App() {
  const [route] = useHashRoute()
  const [theme, toggleTheme] = useTheme()
  // 퀴즈 결과는 세션 동안만 기억한다. 새로고침하면 사라진다.
  const [stats, setStats] = useState<KanaStats>(emptyStats)

  return (
    <>
      <TopBar route={route} theme={theme} onToggleTheme={toggleTheme} />
      <main className="app-main">
        {route === 'chart' && <ChartPage />}
        {route === 'learn' && <LearnPage />}
        {route === 'quiz' && <QuizPage stats={stats} onStatsChange={setStats} />}
      </main>
      <footer className="app-footer">
        획순 도안은{' '}
        <a href="https://kanjivg.tagaini.net" target="_blank" rel="noreferrer">
          KanjiVG
        </a>
        의 데이터를 바탕으로 합니다. CC BY-SA 3.0
      </footer>
    </>
  )
}
