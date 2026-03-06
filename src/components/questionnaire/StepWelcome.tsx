import { Zap, Check, ArrowRight } from 'lucide-react'

// ── Textes modifiables ────────────────────────────────────────────
const TITLE    = 'Obtenez votre audit stratégique offert'
const SUBTITLE = 'Répondez à 5 questions rapides (2 min). On prépare votre appel de 20 minutes sur mesure.'
const CTA_TEXT = 'Commencer le questionnaire'
const MICRO    = 'Sans engagement · Réponse sous 24h'

const BENEFITS = [
  'Diagnostic personnalisé de votre situation',
  'Identification de vos freins de croissance',
  "Un plan de priorités offert à l'issue de l'appel",
]

// ── Composant ─────────────────────────────────────────────────────
interface Props {
  onStart: () => void
}

export default function StepWelcome({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center text-center px-2 py-6">

      {/* Icône centrale */}
      <div className="w-16 h-16 rounded-2xl bg-uptide-cyan/15 border border-uptide-cyan/30 flex items-center justify-center mb-8">
        <Zap size={28} className="text-uptide-cyan" />
      </div>

      {/* Titre */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight max-w-sm">
        {TITLE}
      </h2>

      {/* Sous-titre */}
      <p className="text-white/55 text-base leading-relaxed mb-8 max-w-sm">
        {SUBTITLE}
      </p>

      {/* Liste des bénéfices */}
      <ul className="space-y-3 mb-10 text-left w-full max-w-sm">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-start gap-3 text-white/70 text-sm">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-uptide-cyan/15 border border-uptide-cyan/30 flex items-center justify-center flex-shrink-0">
              <Check size={11} className="text-uptide-cyan" />
            </span>
            {benefit}
          </li>
        ))}
      </ul>

      {/* CTA principal */}
      <button
        onClick={onStart}
        className="group relative w-full max-w-sm inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-uptide-cyan text-uptide-dark font-bold text-base hover:shadow-[0_0_32px_rgba(0,216,255,0.5)] transition-all overflow-hidden"
      >
        {/* Shimmer au hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
        <span className="relative">{CTA_TEXT}</span>
        <ArrowRight size={18} className="relative transition-transform group-hover:translate-x-1" />
      </button>

      {/* Micro-texte rassurant */}
      <p className="mt-4 text-white/30 text-xs">{MICRO}</p>
    </div>
  )
}
