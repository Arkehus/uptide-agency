import { useEffect, useRef, useState } from 'react'
import { Search, Code2, Rocket, Check, ArrowRight, TrendingUp } from 'lucide-react'
import { useQuestionnaire } from '../context/QuestionnaireContext'

// ── useInView hook ────────────────────────────────────────────────
function useInView(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

// ── Audit checklist ───────────────────────────────────────────────
const auditItems = [
  "Audit de l'activité et du parcours client",
  "Analyse marketing & présence digitale",
  "Analyse concurrentielle",
  "Identification des vraies opportunités",
]

// ── Methodology badges (Card 2) ───────────────────────────────────
const methodBadges = [
  { label: 'Priorités claires',  color: 'bg-uptide-cyan/15 text-uptide-cyan border-uptide-cyan/20' },
  { label: '30–90 jours',        color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  { label: 'Actionnable',        color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  { label: 'Roadmap détaillée',  color: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
]

// ── Pilotage timeline ─────────────────────────────────────────────
const timeline = [
  { day: 'J0',  label: 'Lancement' },
  { day: 'J30', label: 'Bilan 30j' },
  { day: 'J60', label: 'Ajustement' },
  { day: 'J90', label: 'Cap tenu' },
]

export default function Method() {
  const { openQuestionnaire } = useQuestionnaire()
  const [headerRef, headerInView] = useInView(0.3)
  const [card1Ref, card1InView] = useInView(0.15)
  const [card2Ref, card2InView] = useInView(0.15)
  const [card3Ref, card3InView] = useInView(0.15)

  return (
    <section id="method" className="py-24 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-uptide-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-uptide-blue/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div
          ref={headerRef}
          className={`max-w-2xl mb-14 scroll-reveal ${headerInView ? 'in-view' : ''}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-uptide-cyan/10 text-uptide-cyan text-sm font-semibold mb-4 border border-uptide-cyan/20">
            Notre méthode
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Une approche en 3 temps.
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            On part du terrain. On clarifie les priorités. On suit les résultats.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_auto] gap-5">

          {/* Card 1 — Analyse (tall, left) */}
          <div
            ref={card1Ref}
            style={{ transitionDelay: '0ms' }}
            className={`
              md:row-span-2 relative flex flex-col p-8 rounded-3xl
              bg-white/5 backdrop-blur-md border border-cyan-400/20
              hover:border-uptide-cyan/40 hover:bg-white/[0.07]
              transition-colors overflow-hidden group
              scroll-reveal-left ${card1InView ? 'in-view' : ''}
            `}
          >
            <span className="absolute -top-4 -right-3 text-[8rem] font-extrabold text-white/[0.03] leading-none select-none pointer-events-none">
              01
            </span>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-uptide-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative mb-8">
              <div className="w-12 h-12 rounded-2xl bg-uptide-cyan/15 border border-uptide-cyan/25 flex items-center justify-center mb-5 group-hover:bg-uptide-cyan/25 transition-colors">
                <Search size={22} className="text-uptide-cyan" />
              </div>
              <span className="text-uptide-cyan/50 text-xs font-bold tracking-widest uppercase">
                Phase 01
              </span>
              <h3 className="text-white text-2xl font-extrabold mt-1 mb-3">
                Analyse
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Audit terrain, digital et concurrentiel. On comprend pourquoi
                ca stagne et ou sont les vraies opportunites de croissance.
              </p>
            </div>

            <ul className="relative space-y-3 flex-1">
              {auditItems.map((item, i) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-white/65 text-sm bento-item-in"
                  style={{
                    animationDelay: card1InView ? `${300 + i * 120}ms` : '0ms',
                    opacity: card1InView ? undefined : 0,
                  }}
                >
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-uptide-cyan/15 border border-uptide-cyan/30 flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-uptide-cyan" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="relative mt-8 pt-6 border-t border-white/10">
              <button
                onClick={openQuestionnaire}
                className="inline-flex items-center gap-2 text-uptide-cyan text-sm font-semibold hover:gap-3 transition-all"
              >
                Demander un audit offert
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 2 — Plan d'action (wide, top-right) */}
          <div
            ref={card2Ref}
            style={{ transitionDelay: '150ms' }}
            className={`
              md:col-span-2 relative p-8 rounded-3xl
              bg-white/5 backdrop-blur-md border border-cyan-400/20
              hover:border-uptide-cyan/40 hover:bg-white/[0.07]
              transition-colors overflow-hidden group
              scroll-reveal ${card2InView ? 'in-view' : ''}
            `}
          >
            <span className="absolute -top-4 -right-2 text-[8rem] font-extrabold text-white/[0.03] leading-none select-none pointer-events-none">
              02
            </span>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-uptide-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row gap-8">
              <div className="flex-1 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-uptide-blue/30 border border-uptide-blue/40 flex items-center justify-center mb-5 group-hover:bg-uptide-blue/40 transition-colors">
                  <Code2 size={22} className="text-blue-300" />
                </div>
                <span className="text-blue-300/60 text-xs font-bold tracking-widest uppercase">
                  Phase 02
                </span>
                <h3 className="text-white text-2xl font-extrabold mt-1 mb-3">
                  Plan d'action
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  Roadmap priorisee sur 30 a 90 jours. Vous savez exactement
                  quoi faire, dans quel ordre, et pourquoi.
                </p>

                <div className="flex flex-wrap gap-2">
                  {methodBadges.map((b, i) => (
                    <span
                      key={b.label}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold bento-item-in ${b.color}`}
                      style={{
                        animationDelay: card2InView ? `${400 + i * 80}ms` : '0ms',
                        opacity: card2InView ? undefined : 0,
                      }}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 flex flex-col items-center justify-center gap-4 sm:border-l sm:border-white/10 sm:pl-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-uptide-cyan mb-1">
                    <TrendingUp size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/40">
                      Horizon type
                    </span>
                  </div>
                  <p className="text-5xl font-extrabold text-white leading-none">90</p>
                  <p className="text-uptide-cyan font-bold">jours</p>
                </div>

                <div className="w-24">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-uptide-cyan rounded-full bar-fill"
                      style={{
                        animationDelay: card2InView ? '600ms' : '0ms',
                        animationDuration: '1.4s',
                        width: '100%',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-white/30 text-[10px]">J0</span>
                    <span className="text-uptide-cyan text-[10px] font-semibold">J90</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 — Pilotage (wide, bottom-right) */}
          <div
            ref={card3Ref}
            style={{ transitionDelay: '280ms' }}
            className={`
              md:col-span-2 relative p-8 rounded-3xl
              bg-white/5 backdrop-blur-md border border-cyan-400/20
              hover:border-uptide-cyan/40 hover:bg-white/[0.07]
              transition-colors overflow-hidden group
              scroll-reveal-right ${card3InView ? 'in-view' : ''}
            `}
          >
            <span className="absolute -top-4 -right-2 text-[8rem] font-extrabold text-white/[0.03] leading-none select-none pointer-events-none">
              03
            </span>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tl from-uptide-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row gap-8 items-start">
              <div className="flex-1 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-uptide-cyan/15 border border-uptide-cyan/25 flex items-center justify-center mb-5 group-hover:bg-uptide-cyan/25 transition-colors">
                  <Rocket size={22} className="text-uptide-cyan" />
                </div>
                <span className="text-uptide-cyan/50 text-xs font-bold tracking-widest uppercase">
                  Phase 03
                </span>
                <h3 className="text-white text-2xl font-extrabold mt-1 mb-3">
                  Pilotage
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  Dashboard mensuel, bilans reguliers et ajustements continus.
                  On tient le cap ensemble, avec des indicateurs simples et utiles.
                </p>
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto flex flex-col gap-5 sm:border-l sm:border-white/10 sm:pl-8">
                <div className="flex flex-wrap gap-2">
                  {['Dashboard', 'KPIs', 'Suivi mensuel'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-uptide-cyan/10 border border-uptide-cyan/20 text-uptide-cyan text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-start gap-0">
                  {timeline.map((t, i) => (
                    <div key={t.day} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bento-item-in ${
                            i === timeline.length - 1
                              ? 'bg-uptide-cyan text-uptide-dark'
                              : 'bg-white/10 border border-white/20 text-white/50'
                          }`}
                          style={{
                            animationDelay: card3InView ? `${350 + i * 120}ms` : '0ms',
                            opacity: card3InView ? undefined : 0,
                          }}
                        >
                          {i === timeline.length - 1 ? '★' : t.day.replace('J', '')}
                        </div>
                        <p className="text-[9px] text-white/30 mt-1 text-center w-14 leading-tight">
                          {t.label}
                        </p>
                      </div>
                      {i < timeline.length - 1 && (
                        <div className="w-8 h-px bg-white/15 mb-4 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
