import { Check, Clock, CalendarPlus } from 'lucide-react'
import { formatSlotLabel } from './StepCalendar'

// ── Génère le lien Google Calendar ────────────────────────────────
const MONTH_MAP: Record<string, number> = {
  jan: 0, fév: 1, mars: 2, avr: 3, mai: 4, juin: 5,
  juil: 6, août: 7, sep: 8, oct: 9, nov: 10, déc: 11,
}

function buildGCalUrl(slot: string, firstName: string, company: string): string {
  const match = slot.match(/\w+ (\d+) (\w+) à (\d+)h(\d*)/)
  const now = new Date()

  let start: Date
  if (match) {
    const day   = parseInt(match[1], 10)
    const month = MONTH_MAP[match[2].toLowerCase()] ?? now.getMonth()
    const hour  = parseInt(match[3], 10)
    const min   = parseInt(match[4] || '0', 10)
    let year = now.getFullYear()
    const candidate = new Date(year, month, day, hour, min)
    if (candidate < now) year += 1
    start = new Date(year, month, day, hour, min)
  } else {
    start = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    start.setHours(10, 0, 0, 0)
  }

  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const params = new URLSearchParams({
    action:   'TEMPLATE',
    text:     `Audit Uptide — ${firstName} (${company})`,
    dates:    `${fmt(start)}/${fmt(end)}`,
    details:  'Audit de croissance offert avec Uptide.\n\nLien visio envoyé par email.',
    location: 'Visioconférence',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Ré-exporte pour que l'import reste disponible
export { formatSlotLabel }

// ── Textes modifiables ────────────────────────────────────────────
const TITLE    = "C'est confirmé ! 🎯"
const SUBTITLE = 'Votre audit de 20 minutes est réservé.'

// Ce qui se passe ensuite (modifiable)
const NEXT_STEPS = [
  'Vous recevez un email avec le lien visio',
  "On étudie votre questionnaire avant l'appel",
  'On arrive préparés, avec des premières pistes concrètes',
]

// ── Props ─────────────────────────────────────────────────────────
interface Props {
  firstName:    string
  companyName?: string
  selectedSlot: string
  onClose:      () => void
}

// ── Composant ─────────────────────────────────────────────────────
export default function StepConfirmation({ firstName, companyName = '', selectedSlot, onClose }: Props) {
  const calendarUrl = buildGCalUrl(selectedSlot, firstName, companyName)
  return (
    <div className="flex flex-col items-center text-center py-4">

      {/* ── Checkmark animé ─────────────────────────────────────── */}
      <div className="relative mb-8">
        <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
          {/* Cercle de fond */}
          <circle
            cx="44" cy="44" r="40"
            stroke="rgba(0,216,255,0.12)"
            strokeWidth="3"
          />
          {/* Cercle animé qui se dessine */}
          <circle
            cx="44" cy="44" r="40"
            stroke="#00D8FF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="251"
            strokeDashoffset="251"
            style={{ animation: 'drawCircle 0.9s ease-out 0.1s forwards' }}
            transform="rotate(-90 44 44)"
          />
        </svg>

        {/* Icône check qui pop-in */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.5s both' }}
        >
          <Check size={34} className="text-uptide-cyan" strokeWidth={3} />
        </div>
      </div>

      {/* Keyframes des animations du checkmark */}
      <style>{`
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Titre et sous-titre */}
      <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
        {TITLE}
      </h3>
      <p className="text-white/55 text-base mb-8">{SUBTITLE}</p>

      {/* ── Carte récapitulatif ──────────────────────────────────── */}
      <div className="w-full max-w-sm bg-white/[0.05] border border-uptide-cyan/20 rounded-2xl p-5 mb-8 text-left">
        <div className="space-y-3">

          {/* Prénom */}
          <div className="flex items-center gap-3">
            <span className="text-uptide-cyan/50 text-[11px] uppercase tracking-wider font-semibold w-20 flex-shrink-0">
              Prénom
            </span>
            <span className="text-white font-semibold">{firstName || '—'}</span>
          </div>

          <div className="h-px bg-white/10" />

          {/* Créneau */}
          <div className="flex items-center gap-3">
            <span className="text-uptide-cyan/50 text-[11px] uppercase tracking-wider font-semibold w-20 flex-shrink-0">
              Créneau
            </span>
            <span className="text-white font-semibold text-sm">
              {selectedSlot || '—'}
            </span>
          </div>

          <div className="h-px bg-white/10" />

          {/* Email envoyé */}
          <div className="flex items-center gap-3">
            <span className="text-uptide-cyan/50 text-[11px] uppercase tracking-wider font-semibold w-20 flex-shrink-0">
              Email
            </span>
            <span className="text-uptide-cyan text-sm font-medium">
              Confirmation envoyée ✓
            </span>
          </div>
        </div>
      </div>

      {/* ── Prochaines étapes ────────────────────────────────────── */}
      <ul className="space-y-3 mb-10 text-left w-full max-w-sm">
        {NEXT_STEPS.map((step) => (
          <li key={step} className="flex items-start gap-3 text-white/60 text-sm">
            <Clock size={14} className="text-uptide-cyan flex-shrink-0 mt-0.5" />
            {step}
          </li>
        ))}
      </ul>

      {/* Bouton Google Calendar */}
      <a
        href={calendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group w-full max-w-sm flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-uptide-cyan text-uptide-dark font-bold text-base hover:shadow-[0_0_28px_rgba(0,216,255,0.4)] transition-all mb-4"
      >
        <CalendarPlus size={18} />
        Ajouter à Google Calendar
      </a>

      {/* CTA de fermeture */}
      <button
        onClick={onClose}
        className="text-white/35 text-sm hover:text-white/65 transition-colors underline underline-offset-4 decoration-white/20"
      >
        Revenir au site
      </button>
    </div>
  )
}
