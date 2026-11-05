import { canSpeak, speak } from '../lib/speech'
import { SpeakerIcon } from './Icons'

type Props = { text: string; label?: string }

export function SpeakButton({ text, label = '듣기' }: Props) {
  if (!canSpeak()) return null
  return (
    <button type="button" className="speak" onClick={() => speak(text)} aria-label={`${text} 발음 듣기`}>
      <SpeakerIcon />
      {label}
    </button>
  )
}
