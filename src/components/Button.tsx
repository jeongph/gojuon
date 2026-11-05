import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'large'
}

export function Button({ variant = 'secondary', size = 'default', className = '', type = 'button', ...rest }: Props) {
  const classes = ['btn', `btn--${variant}`, size === 'large' ? 'btn--large' : '', className].filter(Boolean).join(' ')
  return <button type={type} className={classes} {...rest} />
}
