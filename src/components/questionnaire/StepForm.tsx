import { useState } from 'react'
import { Lock, ArrowRight } from 'lucide-react'
import type { Answers } from '../../context/QuestionnaireContext'

// ── Textes modifiables ────────────────────────────────────────────
const QUESTION      = 'Où peut-on vous envoyer le récapitulatif ?'
const SUBTITLE      = 'Ces infos servent uniquement à préparer votre audit.'
const PRIVACY_NOTE  = 'Vos données sont confidentielles. On ne fait pas de spam, promis.'
const SUBMIT_TEXT   = 'Voir les créneaux disponibles'

// ── Validation email ──────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ── Props ─────────────────────────────────────────────────────────
interface Props {
  answers:  Answers
  onChange: (field: keyof Answers, value: string) => void
  onSubmit: () => void
}

// ── Style commun des inputs ───────────────────────────────────────
const INPUT_BASE =
  'bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base ' +
  'placeholder-gray-500 focus:border-uptide-cyan focus:outline-none focus:ring-1 ' +
  'focus:ring-uptide-cyan w-full transition-all'

const INPUT_ERROR =
  'border-red-500 focus:border-red-500 focus:ring-red-500'

// ── Composant ─────────────────────────────────────────────────────
export default function StepForm({ answers, onChange, onSubmit }: Props) {
  // On trace le "touched" pour n'afficher l'erreur email qu'après la première sortie du champ
  const [touched, setTouched] = useState({ email: false })

  const emailInvalid = touched.email && answers.email.length > 0 && !isValidEmail(answers.email)

  const canSubmit =
    answers.firstName.trim()   !== '' &&
    answers.companyName.trim() !== '' &&
    isValidEmail(answers.email)

  return (
    <div>
      {/* Question */}
      <div className="mb-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
          {QUESTION}
        </h3>
        <p className="text-white/45 text-sm">{SUBTITLE}</p>
      </div>

      {/* Champs du formulaire */}
      <div className="space-y-4 mb-6">

        {/* Prénom */}
        <div>
          <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Prénom <span className="text-uptide-cyan">*</span>
          </label>
          <input
            type="text"
            autoComplete="given-name"
            placeholder="Votre prénom"
            value={answers.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className={INPUT_BASE}
          />
        </div>

        {/* Entreprise */}
        <div>
          <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Nom de l'entreprise <span className="text-uptide-cyan">*</span>
          </label>
          <input
            type="text"
            autoComplete="organization"
            placeholder="Nom de votre entreprise"
            value={answers.companyName}
            onChange={(e) => onChange('companyName', e.target.value)}
            className={INPUT_BASE}
          />
        </div>

        {/* Email — avec validation en temps réel */}
        <div>
          <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Email professionnel <span className="text-uptide-cyan">*</span>
          </label>
          <input
            type="email"
            autoComplete="email"
            placeholder="vous@entreprise.fr"
            value={answers.email}
            onChange={(e) => onChange('email', e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            className={`${INPUT_BASE} ${emailInvalid ? INPUT_ERROR : ''}`}
          />
          {emailInvalid && (
            <p className="text-red-400 text-xs mt-1.5 pl-1">
              Format d'email invalide.
            </p>
          )}
        </div>

        {/* Téléphone — optionnel */}
        <div>
          <label className="block text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5">
            Téléphone{' '}
            <span className="text-white/25 normal-case font-normal">(optionnel)</span>
          </label>
          <input
            type="tel"
            autoComplete="tel"
            placeholder="06 XX XX XX XX"
            value={answers.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className={INPUT_BASE}
          />
        </div>
      </div>

      {/* Note de confidentialité */}
      <div className="flex items-start gap-2.5 mb-7 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
        <Lock size={13} className="text-white/30 flex-shrink-0 mt-0.5" />
        <p className="text-white/35 text-xs leading-relaxed">{PRIVACY_NOTE}</p>
      </div>

      {/* Bouton de soumission */}
      <button
        onClick={() => { if (canSubmit) onSubmit() }}
        disabled={!canSubmit}
        className={`group w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-base transition-all ${
          canSubmit
            ? 'bg-uptide-cyan text-uptide-dark hover:shadow-[0_0_28px_rgba(0,216,255,0.5)] cursor-pointer'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        }`}
      >
        {SUBMIT_TEXT}
        <ArrowRight
          size={18}
          className={canSubmit ? 'transition-transform group-hover:translate-x-1' : ''}
        />
      </button>
    </div>
  )
}
