import { canSpeak, speak } from '../lib/speech'
import { SpeakerIcon } from './Icons'

type Props = {
  text: string
  label?: string
  /** 목록 줄마다 붙일 때처럼 라벨 없이 아이콘만 보인다. 읽어 주는 이름은 그대로다. */
  compact?: boolean
}

export function SpeakButton({ text, label = '듣기', compact = false }: Props) {
  if (!canSpeak()) return null
  return (
    <button
      type="button"
      className={compact ? 'pill pill--icon' : 'pill'}
      onClick={() => speak(text)}
      aria-label={`${text} 발음 듣기`}
    >
      <SpeakerIcon />
      {!compact && label}
    </button>
  )
}
