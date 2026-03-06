import { useEffect, useRef, useState } from 'react'
import { Search, BarChart3, TrendingUp, Check, ArrowRight, Star, Zap } from 'lucide-react'

// ── useInView ─────────────────────────────────────────────────────
function useInView(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

// ── Data ──────────────────────────────────────────────────────────
interface Offer {
  id: string
  Icon: React.FC<{ size?: number; className?: string }>
  label: string
  tagline: string
  badge: string
  desc: string
  features: string[]
  featured: boolean
  cta: string
}

const OFFERS: Offer[] = [
  {
    id: 'diagnostic',
    Icon: Search,
    label: 'Diagnostic Croissance',
    tagline: 'Porte d\'entree',
    badge: 'Porte d\'entree',
    desc: "Comprenez pourquoi ca stagne. Recevez un plan priorise sur 30 jours avec des actions concretes.",
    features: [
      "Analyse activite & parcours client",
      "Analyse marketing & presence digitale",
      "Analyse concurrence",
      "Rapport clair + recommandations",
      "Priorites des 30 prochains jours",
    ],
    featured: false,
    cta: "En savoir plus",
  },
  {
    id: 'plan',
    Icon: TrendingUp,
    label: 'Plan de Developpement',
    tagline: 'Le plus complet',
    badge: 'Le plus complet',
    desc: "Structurez votre croissance sur 30 a 90 jours, voire 6 mois, avec une roadmap claire et detaillee.",
    features: [
      "Positionnement & restructuration de l'offre",
      "Strategie acquisition locale + digitale",
      "Optimisation de la conversion",
      "Strategie de fidelisation",
      "Roadmap detaillee + calendrier d'actions",
    ],
    featured: true,
    cta: "Demarrer maintenant",
  },
  {
    id: 'pilotage',
    Icon: BarChart3,
    label: 'Pilotage Mensuel',
    tagline: 'Abonnement mensuel',
    badge: 'Abonnement mensuel',
    desc: "Suivez, ajustez, tenez le cap. Un rituel mensuel pour rester dans la bonne direction et ne rien laisser au hasard.",
    features: [
      "Dashboard dirigeant (indicateurs utiles)",
      "Bilan mensuel + plan du mois",
      "Ajustements et recommandations continues",
      "Suivi KPI simplifie",
    ],
    featured: false,
    cta: "En savoir plus",
  },
]

// ── Component ─────────────────────────────────────────────────────
export default function Offers() {
  const [headerRef, headerInView] = useInView(0.3)
  const [gridRef,   gridInView]   = useInView(0.08)

  return (
    <section id="offers" className="py-24 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-uptide-blue/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[280px] bg-uptide-cyan/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-16 scroll-reveal ${headerInView ? 'in-view' : ''}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-uptide-cyan/10 text-uptide-cyan text-sm font-semibold mb-4 border border-uptide-cyan/20">
            Nos offres
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            3 offres. Une seule direction :{' '}
            <span className="text-uptide-cyan">la croissance.</span>
          </h2>
          <p className="text-white/50 text-lg">
            Choisissez votre point d'entree. On s'adapte a votre situation.
          </p>
        </div>

        {/* Cards grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 md:items-stretch">
          {OFFERS.map((offer, i) => {
            const Icon = offer.Icon
            return (
              <div
                key={offer.id}
                className={`flex flex-col ${!offer.featured ? 'md:pt-10' : ''}`}
                style={{
                  opacity:    gridInView ? 1 : 0,
                  transform:  gridInView ? 'translateY(0)' : 'translateY(44px)',
                  transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${i * 140}ms,
                               transform 0.75s cubic-bezier(0.22,1,0.36,1) ${i * 140}ms`,
                }}
              >
                <div
                  className={`flex-1 flex flex-col relative overflow-hidden rounded-3xl transition-all duration-300 ${
                    offer.featured
                      ? 'border border-uptide-cyan/50 shadow-[0_8px_64px_rgba(0,216,255,0.18)] hover:shadow-[0_8px_80px_rgba(0,216,255,0.28)] hover:border-uptide-cyan/70'
                      : 'border border-white/[0.08] bg-white/[0.04] hover:border-white/[0.16] hover:bg-white/[0.06]'
                  }`}
                  style={offer.featured ? {
                    background: 'linear-gradient(160deg, rgba(0,216,255,0.13) 0%, rgba(0,216,255,0.06) 40%, rgba(255,255,255,0.04) 100%)',
                  } : {}}
                >

                  {/* Top accent bar (featured) */}
                  {offer.featured && (
                    <div
                      className="h-[3px] w-full flex-shrink-0"
                      style={{
                        background: 'linear-gradient(90deg, #165F8B 0%, #00D8FF 50%, #165F8B 100%)',
                      }}
                    />
                  )}

                  {/* Inner radial glow (featured) */}
                  {offer.featured && (
                    <div
                      className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                      style={{ background: 'radial-gradient(circle, rgba(0,216,255,0.12), transparent 70%)' }}
                    />
                  )}

                  {/* Card content */}
                  <div className="relative flex-1 flex flex-col p-7 lg:p-8">

                    {/* Badge */}
                    {offer.featured && (
                      <div className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-uptide-cyan/15 border border-uptide-cyan/35 text-uptide-cyan text-[11px] font-bold mb-6">
                        <Star size={10} fill="currentColor" />
                        {offer.badge}
                      </div>
                    )}
                    {!offer.featured && (
                      <div className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/40 text-[11px] font-bold mb-6">
                        {offer.badge}
                      </div>
                    )}

                    {/* Icon */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0 ${
                        offer.featured
                          ? 'shadow-[0_0_20px_rgba(0,216,255,0.25)]'
                          : ''
                      }`}
                      style={offer.featured
                        ? { background: 'rgba(0,216,255,0.15)', border: '1px solid rgba(0,216,255,0.35)' }
                        : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }
                      }
                    >
                      <Icon
                        size={20}
                        className={offer.featured ? 'text-uptide-cyan' : 'text-white/50'}
                      />
                    </div>

                    {/* Tagline */}
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                      offer.featured ? 'text-uptide-cyan/60' : 'text-white/25'
                    }`}>
                      {offer.tagline}
                    </p>

                    {/* Title */}
                    <h3 className="text-white text-2xl font-extrabold mb-4">
                      {offer.label}
                    </h3>

                    {/* Separator */}
                    <div
                      className="h-px mb-5"
                      style={offer.featured
                        ? { background: 'linear-gradient(90deg, rgba(0,216,255,0.25), transparent)' }
                        : { background: 'rgba(255,255,255,0.07)' }
                      }
                    />

                    {/* Description */}
                    <p className="text-white/48 text-sm leading-relaxed mb-6">
                      {offer.desc}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-1">
                      {offer.features.map((feat, fi) => (
                        <li
                          key={feat}
                          className={`flex items-center gap-3 text-sm bento-item-in ${
                            offer.featured ? 'text-white/75' : 'text-white/55'
                          }`}
                          style={{
                            animationDelay: gridInView ? `${i * 140 + 300 + fi * 80}ms` : '0ms',
                            opacity: gridInView ? undefined : 0,
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={offer.featured
                              ? { background: 'rgba(0,216,255,0.12)', border: '1px solid rgba(0,216,255,0.3)' }
                              : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }
                            }
                          >
                            <Check
                              size={11}
                              className={offer.featured ? 'text-uptide-cyan' : 'text-white/40'}
                            />
                          </div>
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {/* CTA button */}
                    <a
                      href="#cta"
                      className={`group relative flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm transition-all hover:gap-3 overflow-hidden ${
                        offer.featured
                          ? 'bg-uptide-cyan text-uptide-dark hover:shadow-[0_0_28px_rgba(0,216,255,0.5)]'
                          : 'text-white/70 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/8'
                      }`}
                      style={!offer.featured ? { background: 'rgba(255,255,255,0.05)' } : {}}
                    >
                      {/* Shimmer on featured */}
                      {offer.featured && (
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                      )}
                      {offer.featured && <Zap size={14} className="relative" />}
                      <span className="relative">{offer.cta}</span>
                      <ArrowRight
                        size={14}
                        className="relative transition-transform group-hover:translate-x-1"
                      />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom note */}
        <p
          className="mt-10 text-center text-white/25 text-sm scroll-reveal"
          style={{
            opacity:    gridInView ? 1 : 0,
            transition: 'opacity 0.75s ease 600ms',
          }}
        >
          Tous nos accompagnements incluent un audit gratuit de 30 min et une reponse sous 24h.
        </p>
      </div>
    </section>
  )
}
