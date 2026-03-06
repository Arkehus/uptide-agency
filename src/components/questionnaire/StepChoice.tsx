import { Check } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────
export interface ChoiceOption {
  id:           string
  emoji:        string
  title:        string
  description?: string  // description facultative sous le titre
}

interface Props {
  question:  string
  subtitle?: string
  options:   ChoiceOption[]
  selected:  string
  onSelect:  (id: string) => void
  columns?:  1 | 2      // 1 = une colonne, 2 = grille 2×N (défaut : 2)
}

// ── Composant réutilisable (étapes 1, 2, 3, 4) ───────────────────
export default function StepChoice({
  question,
  subtitle,
  options,
  selected,
  onSelect,
  columns = 2,
}: Props) {
  return (
    <div>
      {/* Question */}
      <div className="mb-7">
        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-snug">
          {question}
        </h3>
        {subtitle && (
          <p className="text-white/45 text-sm">{subtitle}</p>
        )}
      </div>

      {/* Grille d'options */}
      <div
        className={`grid gap-3 ${
          columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {options.map((opt) => {
          const isSelected = selected === opt.id

          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`relative text-left p-4 rounded-2xl transition-all duration-200 ${
                isSelected
                  ? 'bg-uptide-cyan/10 border-2 border-uptide-cyan shadow-[0_0_20px_rgba(0,216,255,0.15)]'
                  : 'bg-white/5 border border-white/10 hover:border-uptide-cyan/40 hover:bg-white/[0.08]'
              }`}
            >
              {/* Checkmark visible quand sélectionné */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-uptide-cyan flex items-center justify-center">
                  <Check size={11} className="text-uptide-dark" strokeWidth={3} />
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Emoji / icône */}
                <span className="text-xl sm:text-2xl flex-shrink-0 mt-0.5 leading-none">
                  {opt.emoji}
                </span>

                <div className="min-w-0">
                  {/* Titre de l'option */}
                  <p className={`font-semibold text-sm leading-snug ${
                    isSelected ? 'text-uptide-cyan' : 'text-white'
                  }`}>
                    {opt.title}
                  </p>

                  {/* Description facultative */}
                  {opt.description && (
                    <p className="text-white/40 text-xs mt-1 leading-relaxed">
                      {opt.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
