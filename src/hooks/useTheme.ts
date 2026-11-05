import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

function systemTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** 시스템 설정을 따르되 세션 안에서만 토글할 수 있다. 저장하지 않으므로 새로고침하면 시스템 값으로 돌아간다. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(systemTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}
