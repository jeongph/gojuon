import { useCallback, useEffect, useState } from 'react'

export type Route = 'chart' | 'learn' | 'quiz'

const ROUTES: Route[] = ['chart', 'learn', 'quiz']
const DEFAULT_ROUTE: Route = 'chart'

function parse(hash: string): Route {
  const name = hash.replace(/^#\/?/, '').split(/[/?]/)[0]
  return (ROUTES as string[]).includes(name) ? (name as Route) : DEFAULT_ROUTE
}

/**
 * GitHub Pages는 SPA 리라이트를 지원하지 않으므로 해시 라우팅을 쓴다.
 * 라우터 라이브러리 없이 3개 화면만 다루기에 충분하다.
 */
export function useHashRoute(): [Route, (next: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((next: Route) => {
    window.location.hash = `/${next}`
  }, [])

  return [route, navigate]
}

export function hrefFor(route: Route): string {
  return `#/${route}`
}
