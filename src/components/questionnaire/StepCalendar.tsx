import { useMemo } from 'react'
import { Video, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

// ── Configuration ─────────────────────────────────────────────────
// Passer USE_CALENDLY à true et renseigner l'URL quand Calendly est prêt.
const USE_CALENDLY  = false
const CALENDLY_URL  = 'https://calendly.com/uptide/audit-20min'

// Créneaux proposés pour chaque journée (modifiable ici)
const TIME_SLOTS = ['9h00', '11h00', '14h00']

// Noms des jours et mois en français
const WEEKDAY_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const MONTH_SHORT   = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']

// ── Génère les N prochains jours ouvrables ────────────────────────
function getNextWeekdays(count: number): Date[] {
  const days: Date[] = []
  const d = new Date()
  d.setDate(d.getDate() + 1) // commence demain
  while (days.length < count) {
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

// ── Format lisible d'un créneau (ex: "Lun 16 juin à 9h00") ────────
export function formatSlotLabel(day: Date, time: string): string {
  return `${WEEKDAY_SHORT[day.getDay()]} ${day.getDate()} ${MONTH_SHORT[day.getMonth()]} à ${time}`
}

// ── Props ─────────────────────────────────────────────────────────
interface Props {
  selected:      string
  onSelect:      (slotLabel: string) => void
  onConfirm:     () => void
  isSubmitting?: boolean
  submitError?:  string | null
}

// ── Composant ─────────────────────────────────────────────────────
export default function StepCalendar({ selected, onSelect, onConfirm, isSubmitting = false, submitError = null }: Props) {
  // Calcul des 5 prochains jours ouvrables (stable entre renders)
  const weekdays = useMemo(() => getNextWeekdays(5), [])

  // ── Mode Calendly (actif quand USE_CALENDLY = true) ───────────
  if (USE_CALENDLY) {
    return (
      <div>
        <Header />
        <iframe
          src={CALENDLY_URL}
          className="w-full rounded-2xl overflow-hidden border border-white/10"
          style={{ height: 'clamp(380px, 52vh, 500px)' }}
          title="Calendly — Réserver un audit Uptide"
        />
      </div>
    )
  }

  // ── Mode mock UI (actif par défaut) ──────────────────────────
  return (
    <div>
      <Header />

      {/* Grille des jours — 5 colonnes sur desktop, 1 colonne sur mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {weekdays.map((day, di) => (
          <div key={di} className="flex flex-col gap-2">

            {/* En-tête du jour */}
            <div className="text-center py-2.5 px-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <p className="text-white/60 text-[11px] font-semibold leading-none">
                {WEEKDAY_SHORT[day.getDay()]}
              </p>
              <p className="text-white font-extrabold text-lg leading-none mt-0.5">
                {day.getDate()}
              </p>
              <p className="text-white/30 text-[10px]">
                {MONTH_SHORT[day.getMonth()]}
              </p>
            </div>

            {/* Créneaux horaires */}
            {TIME_SLOTS.map((time) => {
              const label      = formatSlotLabel(day, time)
              const isSelected = selected === label

              return (
                <button
                  key={time}
                  onClick={() => onSelect(label)}
                  className={`py-2.5 px-1 rounded-xl text-xs font-semibold text-center transition-all ${
                    isSelected
                      ? 'bg-uptide-cyan/10 border border-uptide-cyan text-uptide-cyan shadow-[0_0_12px_rgba(0,216,255,0.2)]'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:border-uptide-cyan/40 hover:bg-white/[0.08] cursor-pointer'
                  }`}
                >
                  {time}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Bouton de confirmation — apparaît quand un créneau est sélectionné */}
      {selected && (
        <div
          className="mt-6"
          style={{ animation: 'fadeSlideUp 0.3s ease-out' }}
        >
          {/* Récapitulatif du créneau choisi */}
          <p className="text-center text-white/40 text-sm mb-4">
            Créneau sélectionné :{' '}
            <span className="text-uptide-cyan font-semibold">{selected}</span>
          </p>

          {/* Message d'erreur */}
          {submitError && (
            <div className="flex items-center gap-2 mb-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle size={15} className="flex-shrink-0" />
              {submitError}
            </div>
          )}

          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-uptide-cyan text-uptide-dark font-bold text-base hover:shadow-[0_0_28px_rgba(0,216,255,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Confirmation en cours…
              </>
            ) : (
              <>
                Confirmer ce créneau
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Keyframe pour l'apparition du bouton */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── En-tête de la section calendar ───────────────────────────────
function Header() {
  return (
    <div className="mb-7">
      {/* Titre */}
      <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
        Choisissez votre créneau
      </h3>
      {/* Sous-titre */}
      <p className="text-white/45 text-sm flex items-center gap-2">
        <Video size={14} className="text-uptide-cyan flex-shrink-0" />
        Audit stratégique de 20 minutes · Offert · En visio
      </p>
    </div>
  )
}
