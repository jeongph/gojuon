type Props = { value: number; max: number; label: string }

export function Progress({ value, max, label }: Props) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <div className="progress__fill" style={{ width: `${pct}%` }} />
    </div>
  )
}
