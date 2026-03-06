import { useState, useEffect, useRef } from 'react'
import {
  BarChart3, Search, TrendingUp,
  Check, ArrowRight, Zap,
  AlertCircle, Activity, ExternalLink,
} from 'lucide-react'

// ── Shared useInView ──────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════
// MOCKUP 1 — Dashboard Dirigeant
// ═══════════════════════════════════════════════════════════════════
const BARS = [38, 55, 42, 70, 60, 88, 65]
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MAX_BAR = Math.max(...BARS)
const ACTIVITIES = [
  { dot: 'bg-emerald-400', icon: Activity,    text: 'Bilan mensuel genere automatiquement',  time: 'Il y a 1h'  },
  { dot: 'bg-uptide-cyan', icon: TrendingUp,  text: 'Panier moyen en hausse de +8%',         time: 'Il y a 3h'  },
  { dot: 'bg-orange-400',  icon: AlertCircle, text: 'Taux de retour en baisse — action suggeree', time: 'Il y a 5h' },
]

function DashboardMockup() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="h-full flex flex-col rounded-2xl bg-[#0c1d2b] border border-white/10 overflow-hidden">
      {/* Chrome */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.08]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2 mx-auto">
          <BarChart3 size={12} className="text-uptide-cyan" />
          <span className="text-white/60 text-[11px] font-medium">Dashboard Dirigeant · Mars 2026</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="flex-shrink-0 grid grid-cols-2 gap-2 p-3 border-b border-white/[0.08]">
        {[
          { label: 'CA du mois',       value: '48 200 EUR', delta: '+12%' },
          { label: 'Nb nouveaux clients', value: '17',      delta: '+4 vs M-1' },
          { label: 'Panier moyen',     value: '283 EUR',    delta: '+8%' },
          { label: 'Taux de retour',   value: '34%',        delta: '-2pt' },
        ].map((k) => (
          <div key={k.label} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <p className="text-white/30 text-[9px] leading-tight mb-1.5">{k.label}</p>
            <p className="text-white font-extrabold text-sm leading-none">{k.value}</p>
            <p className="text-emerald-400 text-[9px] mt-1.5">{k.delta}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2">
        <p className="text-white/25 text-[9px] uppercase tracking-widest mb-3">Visites / jour (7j)</p>
        <div className="flex items-end gap-1.5" style={{ height: '60px' }}>
          {BARS.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full relative rounded-sm bg-white/[0.05]" style={{ height: '48px' }}>
                <div
                  className="absolute bottom-0 w-full rounded-sm"
                  style={{
                    height:     mounted ? `${(h / MAX_BAR) * 100}%` : '0%',
                    transition: `height 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms`,
                    background: i === 5 ? 'rgba(0,216,255,0.88)' : 'rgba(0,216,255,0.35)',
                  }}
                />
              </div>
              <span className="text-[8px] text-white/20">{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action prioritaire */}
      <div className="flex-shrink-0 mx-4 mb-3 px-3 py-2.5 rounded-xl border border-uptide-cyan/25 bg-uptide-cyan/[0.07]">
        <div className="flex items-center gap-1.5 mb-1">
          <Zap size={9} className="text-uptide-cyan" />
          <span className="text-uptide-cyan text-[9px] font-bold uppercase tracking-wider">Action prioritaire du mois</span>
        </div>
        <p className="text-white/70 text-[10px] leading-relaxed">
          Lancer une campagne de reactivation email — potentiel +8% CA.
        </p>
      </div>

      {/* Activity feed */}
      <div className="flex-1 px-4 pt-1 pb-4 overflow-hidden min-h-0">
        <p className="text-white/25 text-[9px] uppercase tracking-widest mb-2">Activite recente</p>
        <div className="space-y-2.5">
          {ACTIVITIES.map((a, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`w-1.5 h-1.5 rounded-full ${a.dot} mt-1.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-[10px] truncate">{a.text}</p>
                <p className="text-white/25 text-[9px]">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MOCKUP 2 — Analyse Concurrentielle
// ═══════════════════════════════════════════════════════════════════
const COMPETITORS = [
  { criterion: 'Prix moyen',        vous: '38 EUR',  concA: '42 EUR',  concB: '35 EUR'  },
  { criterion: 'Note Google',       vous: '4.6/5',   concA: '4.2/5',   concB: '4.8/5'   },
  { criterion: 'Presence digitale', vous: 'Moyenne', concA: 'Forte',   concB: 'Faible'  },
  { criterion: 'Point fort',        vous: 'Accueil', concA: 'Volume',  concB: 'Proximite'},
]

function CompetitiveMockup() {
  return (
    <div className="h-full flex flex-col rounded-2xl bg-[#0c1d2b] border border-white/10 overflow-hidden">
      {/* Chrome */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.08]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2 mx-auto">
          <Search size={12} className="text-uptide-cyan" />
          <span className="text-white/60 text-[11px] font-medium">Analyse Concurrentielle · Zone locale</span>
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-4">
        {/* Table header */}
        <div className="grid grid-cols-4 gap-2 text-[9px] font-bold uppercase tracking-widest">
          <div className="text-white/25">Critere</div>
          <div className="text-uptide-cyan px-2 py-1 rounded-lg bg-uptide-cyan/10 text-center">Vous</div>
          <div className="text-white/40 text-center">Conc. A</div>
          <div className="text-white/40 text-center">Conc. B</div>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {COMPETITORS.map((row, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center py-2 border-b border-white/[0.06]">
              <div className="text-white/40 text-[10px]">{row.criterion}</div>
              <div className="text-uptide-cyan text-[11px] font-semibold text-center bg-uptide-cyan/[0.07] rounded-lg px-1 py-1">
                {row.vous}
              </div>
              <div className="text-white/50 text-[10px] text-center">{row.concA}</div>
              <div className="text-white/50 text-[10px] text-center">{row.concB}</div>
            </div>
          ))}
        </div>

        {/* Insight box */}
        <div className="mt-auto p-3 rounded-xl border border-uptide-cyan/20 bg-uptide-cyan/[0.06]">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={9} className="text-uptide-cyan" />
            <span className="text-uptide-cyan text-[9px] font-bold uppercase tracking-wider">Opportunite detectee</span>
          </div>
          <p className="text-white/65 text-[10px] leading-relaxed">
            Votre note Google est superieure a Conc. A. Capitaliser sur les avis clients peut renforcer votre avantage.
          </p>
        </div>

        {/* Stats row */}
        <div className="pt-3 border-t border-white/[0.08] flex gap-6">
          {[
            { v: '3', l: 'concurrents analyses', c: 'text-uptide-cyan' },
            { v: '2', l: 'opportunites',          c: 'text-emerald-400' },
            { v: '1', l: 'axe prioritaire',       c: 'text-white/55'   },
          ].map((s) => (
            <div key={s.l}>
              <p className={`text-xl font-extrabold leading-none ${s.c}`}>{s.v}</p>
              <p className="text-white/30 text-[10px] mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MOCKUP 3 — Suivi Marketing
// ═══════════════════════════════════════════════════════════════════
const CHANNELS = [
  { name: 'Google (SEO + Maps)', perf: 72, trend: '+14%',  color: 'bg-blue-400',    badge: 'Performant'   },
  { name: 'Instagram',           perf: 45, trend: '+3%',   color: 'bg-pink-400',    badge: 'A optimiser'  },
  { name: 'Email',               perf: 60, trend: '+8%',   color: 'bg-emerald-400', badge: 'Stable'       },
  { name: 'Bouche-a-oreille',    perf: 88, trend: 'N/A',   color: 'bg-uptide-cyan', badge: 'Top canal'    },
]

function MarketingMockup() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="h-full flex flex-col rounded-2xl bg-[#0c1d2b] border border-white/10 overflow-hidden">
      {/* Chrome */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.08]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2 mx-auto">
          <TrendingUp size={12} className="text-uptide-cyan" />
          <span className="text-white/60 text-[11px] font-medium">Suivi Marketing · Canaux actifs</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Actif
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 p-5">
        <p className="text-white/25 text-[9px] uppercase tracking-widest">Performance par canal — ce mois</p>

        {/* Channel bars */}
        <div className="space-y-4">
          {CHANNELS.map((ch, i) => (
            <div key={ch.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${ch.color}`} />
                  <span className="text-white/65 text-[11px] font-medium">{ch.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/30 text-[10px]">{ch.trend}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    ch.badge === 'Top canal' ? 'bg-uptide-cyan/15 text-uptide-cyan' :
                    ch.badge === 'Performant' ? 'bg-emerald-500/15 text-emerald-400' :
                    ch.badge === 'Stable' ? 'bg-blue-500/15 text-blue-400' :
                    'bg-orange-500/15 text-orange-400'
                  }`}>{ch.badge}</span>
                </div>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full`}
                  style={{
                    width:      mounted ? `${ch.perf}%` : '0%',
                    transition: `width 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms`,
                    background: ch.color.replace('bg-', '').includes('uptide-cyan')
                      ? 'rgba(0,216,255,0.75)'
                      : undefined,
                    backgroundColor: ch.color.replace('bg-', '').includes('uptide-cyan')
                      ? undefined
                      : undefined,
                  }}
                >
                  <div className={`w-full h-full rounded-full ${ch.color} opacity-75`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Priority action */}
        <div className="mt-auto p-3 rounded-xl border border-orange-500/25 bg-orange-500/[0.07]">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertCircle size={9} className="text-orange-400" />
            <span className="text-orange-400 text-[9px] font-bold uppercase tracking-wider">Priorite du mois</span>
          </div>
          <p className="text-white/65 text-[10px] leading-relaxed">
            Instagram sous-performe. Recommandation : reduire la frequence et reorienter le budget sur Google Maps.
          </p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TABS CONFIG
// ═══════════════════════════════════════════════════════════════════
type TabId = 'dashboard' | 'competitive' | 'marketing'

interface TabDef {
  id: TabId
  Icon: React.FC<{ size?: number; className?: string }>
  label: string
  tagline: string
  desc: string
  tools: { label: string; cls: string }[]
  features: string[]
  Mockup: React.FC
}

const TABS: TabDef[] = [
  {
    id: 'dashboard',
    Icon: BarChart3,
    label: 'Dashboard Dirigeant',
    tagline: 'Les indicateurs essentiels. Une lecture rapide. Des decisions plus claires.',
    desc: "Suivez votre CA, vos nouveaux clients, votre panier moyen et vos taux de retour en un coup d'oeil. L'action prioritaire du mois est toujours visible, sans avoir a chercher.",
    tools: [
      { label: 'Google Sheets', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      { label: 'Notion',        cls: 'bg-white/10       text-white/60    border-white/15'        },
      { label: 'Airtable',      cls: 'bg-blue-500/10    text-blue-400    border-blue-500/20'     },
      { label: 'Sur-mesure',    cls: 'bg-uptide-cyan/10 text-uptide-cyan border-uptide-cyan/20'  },
    ],
    features: ["CA mensuel en temps reel", "Nouveaux clients & panier moyen", "Taux de retour & fidelisation", "Action prioritaire du mois"],
    Mockup: DashboardMockup,
  },
  {
    id: 'competitive',
    Icon: Search,
    label: 'Analyse Concurrentielle',
    tagline: 'Positionnement prix/offre, differenciation, opportunites de marche.',
    desc: "Comparez-vous objectivement a vos concurrents locaux. Prix, presence digitale, note Google, points forts — tout en un tableau simple et actionnable, mis a jour regulierement.",
    tools: [
      { label: 'Google Maps',   cls: 'bg-blue-500/10  text-blue-400  border-blue-500/20'  },
      { label: 'Analyse SEO',   cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
      { label: 'Terrain',       cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      { label: 'Sur-mesure',    cls: 'bg-uptide-cyan/10 text-uptide-cyan border-uptide-cyan/20' },
    ],
    features: ["Analyse prix & offre", "Comparaison presence digitale", "Notes & avis clients", "Opportunites de marche identifiees"],
    Mockup: CompetitiveMockup,
  },
  {
    id: 'marketing',
    Icon: TrendingUp,
    label: 'Suivi Marketing',
    tagline: 'Ce qui marche, ce qui ne marche pas. ROI simplifie. Priorites du mois.',
    desc: "Suivez les performances de chaque canal : Google, Instagram, Email, bouche-a-oreille. Un indicateur simple pour prioriser vos efforts marketing et eviter de gaspiller votre budget.",
    tools: [
      { label: 'Google Ads',  cls: 'bg-blue-500/10    text-blue-400    border-blue-500/20'    },
      { label: 'Instagram',   cls: 'bg-pink-500/10    text-pink-400    border-pink-500/20'    },
      { label: 'Mailchimp',   cls: 'bg-yellow-500/10  text-yellow-400  border-yellow-500/20'  },
      { label: 'Sur-mesure',  cls: 'bg-uptide-cyan/10 text-uptide-cyan border-uptide-cyan/20' },
    ],
    features: ["Canaux trackes automatiquement", "ROI par canal simplifie", "Priorites marketing du mois", "Comparaison mois precedent"],
    Mockup: MarketingMockup,
  },
]

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function Tools() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [headerRef, headerInView] = useInView(0.25)
  const [bodyRef, bodyInView]     = useInView(0.1)

  const tab = TABS.find((t) => t.id === activeTab)!

  return (
    <section id="tools" className="py-24 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-uptide-blue/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-uptide-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div
          ref={headerRef}
          className={`mb-12 scroll-reveal ${headerInView ? 'in-view' : ''}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-uptide-cyan/10 text-uptide-cyan text-sm font-semibold mb-4 border border-uptide-cyan/20">
            Outils internes
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
                Nos outils.
                <br />
                <span className="text-uptide-cyan">Votre clarte.</span>
              </h2>
              <p className="text-white/50 text-lg max-w-xl">
                Concus pour piloter sans avoir d'equipe marketing.
                Chaque outil traduit vos donnees en decisions concretes.
              </p>
            </div>
            <a
              href="#cta"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/15 text-white/70 text-sm font-semibold hover:border-uptide-cyan/40 hover:text-white transition-all"
            >
              Decouvrir nos outils
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Tab bar */}
        <div
          ref={bodyRef}
          className={`scroll-reveal ${bodyInView ? 'in-view' : ''}`}
          style={{ transitionDelay: '80ms' }}
        >
          {/* Pills */}
          <div className="flex gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/10 w-full sm:w-auto sm:inline-flex mb-10">
            {TABS.map(({ id, Icon, label }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 sm:flex-auto ${
                    isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-white/10 border border-white/15 shadow-md" />
                  )}
                  <Icon
                    size={15}
                    className={`relative transition-colors ${isActive ? 'text-uptide-cyan' : ''}`}
                  />
                  <span className="relative hidden sm:inline">{label}</span>
                  <span className="relative sm:hidden">{label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div
            key={activeTab}
            className="tab-enter grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-14 items-start"
          >
            {/* Left: info panel */}
            <div className="flex flex-col gap-7">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight">
                  {tab.tagline}
                </h3>
                <p className="text-white/50 leading-relaxed">{tab.desc}</p>
              </div>

              {/* Tool badges */}
              <div>
                <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-3">
                  Outils utilises
                </p>
                <div className="flex flex-wrap gap-2">
                  {tab.tools.map((tool) => (
                    <span
                      key={tool.label}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${tool.cls}`}
                    >
                      {tool.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-3">
                  Inclus
                </p>
                <ul className="space-y-2.5">
                  {tab.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-white/65 text-sm">
                      <Check size={14} className="text-uptide-cyan flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <a
                href="#cta"
                className="group self-start inline-flex items-center gap-2 px-6 py-3 rounded-full bg-uptide-cyan text-uptide-dark font-bold text-sm hover:shadow-[0_0_28px_rgba(0,216,255,0.45)] transition-all hover:gap-3"
              >
                Acceder a mes outils
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Right: mockup */}
            <div className="h-[440px] lg:h-[500px]">
              <tab.Mockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
