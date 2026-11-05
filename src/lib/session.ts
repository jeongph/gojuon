/** 글자별 세션 통계. 새로고침하면 사라지는 메모리 전용 데이터다. */
export type KanaStats = Record<string, { correct: number; wrong: number }>

export function emptyStats(): KanaStats {
  return {}
}

export function recordAnswer(stats: KanaStats, kanaId: string, correct: boolean): KanaStats {
  const prev = stats[kanaId] ?? { correct: 0, wrong: 0 }
  return {
    ...stats,
    [kanaId]: {
      correct: prev.correct + (correct ? 1 : 0),
      wrong: prev.wrong + (correct ? 0 : 1),
    },
  }
}

/** 오답이 한 번 이상 있는 글자를 오답 많은 순으로 돌려준다. */
export function weakestKana(stats: KanaStats): string[] {
  return Object.entries(stats)
    .filter(([, s]) => s.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong || a[1].correct - b[1].correct)
    .map(([id]) => id)
}
