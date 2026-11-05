type Option<T extends string> = { value: T; label: string }

type Props<T extends string> = {
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
  'aria-label': string
}

export function Segmented<T extends string>({ value, options, onChange, ...rest }: Props<T>) {
  return (
    <div className="segmented" role="group" aria-label={rest['aria-label']}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="segmented__item"
          aria-pressed={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
