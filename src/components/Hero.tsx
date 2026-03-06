import { useEffect, useState } from 'react'
import { ArrowRight, ChevronDown, Play, Zap, CheckCircle2, BarChart3 } from 'lucide-react'
import { useQuestionnaire } from '../context/QuestionnaireContext'

// ── Stagger fade-up style helper ─────────────────────────────────
function fadeUpStyle(delayMs: number): React.CSSProperties {
  return { animationDelay: `${delayMs}ms`, opacity: 0 }
}

// ── Dashboard mockup shown on the right ──────────────────────────
function DashboardPreview() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % 3), 2400)
    return () => clearInterval(t)
  }, [])

  const kpis = [
    { label: 'CA du mois',         value: '48 200 €', delta: '↑ +12%', good: true  },
    { label: 'Nouveaux clients',    value: '17',       delta: '↑ +4',   good: true  },
    { label: 'Panier moyen',        value: '283 €',    delta: '↑ +8%',  good: true  },
    { label: 'Taux de retour',      value: '34%',      delta: '↓ −2pt', good: false },
  ]

  return (
    <div
      className="relative w-full max-w-[480px] mx-auto lg:mx-0"
      style={{ filter: 'drop-shadow(0 32px 80px rgba(0,216,255,0.18))' }}
    >
      {/* Ambient glow behind */}
      <div className="absolute -inset-8 bg-uptide-cyan/8 rounded-full blur-3xl pointer-events-none" />

      {/* macOS window chrome */}
      <div className="relative rounded-2xl overflow-hidden border border-uptide-cyan/25 bg-white/[0.04] backdrop-blur-xl">

        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/[0.03]">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/8">
              <BarChart3 size={11} className="text-uptide-cyan" />
              <span className="text-white/50 text-[11px] font-medium">Dashboard Dirigeant — Uptide</span>
            </div>
          </div>
        </div>

        {/* KPI grid */}
        <div className="p-5 grid grid-cols-2 gap-3">
          {kpis.map((kpi, i) => (
            <div
              key={kpi.label}
              className="p-3 rounded-xl bg-white/[0.05] border border-white/8"
              style={{
                opacity:    step >= 1 || i < 2 ? 1 : 0,
                transform:  step >= 1 || i < 2 ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`,
              }}
            >
              <p className="text-white/35 text-[9px] uppercase tracking-wider mb-1.5">{kpi.label}</p>
              <p className="text-white font-extrabold text-base leading-none mb-1">{kpi.value}</p>
              <p className={`text-[9px] font-semibold ${kpi.good ? 'text-emerald-400' : 'text-orange-400'}`}>
                {kpi.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Action prioritaire */}
        <div
          className="mx-5 mb-5 p-3.5 rounded-xl border border-uptide-cyan/25 bg-uptide-cyan/[0.07]"
          style={{
            opacity:   step >= 2 ? 1 : 0,
            transform: step >= 2 ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={11} className="text-uptide-cyan" />
            <span className="text-uptide-cyan text-[10px] font-bold uppercase tracking-wider">
              Action prioritaire du mois
            </span>
          </div>
          <p className="text-white/80 text-xs leading-relaxed">
            Lancer une campagne de réactivation email sur les clients inactifs (+90j) — potentiel estimé +8% CA.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="px-5 py-3 border-t border-white/8 bg-white/[0.02] flex items-center justify-between">
          <span className="text-white/25 text-[10px]">Mis à jour automatiquement · Mars 2026</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-semibold">En ligne</span>
          </div>
        </div>
      </div>

      {/* Floating stat badge — bottom-left */}
      <div
        className="absolute -bottom-4 -left-4 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-uptide-dark/90 border border-uptide-cyan/25 backdrop-blur-md"
        style={{ boxShadow: '0 8px 32px rgba(0,216,255,0.12)' }}
      >
        <div className="w-8 h-8 rounded-xl bg-uptide-cyan/15 border border-uptide-cyan/30 flex items-center justify-center">
          <CheckCircle2 size={14} className="text-uptide-cyan" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">Plan 30j</p>
          <p className="text-white/40 text-[10px] mt-0.5">Priorisé & actionnable</p>
        </div>
      </div>

      {/* Floating badge — top-right */}
      <div className="absolute -top-3 -right-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/15 border border-green-500/30 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-400 text-[11px] font-semibold">Pilotage actif</span>
      </div>
    </div>
  )
}

// ── Main Hero component ───────────────────────────────────────────
export default function Hero() {
  const [started, setStarted] = useState(false)
  const { openQuestionnaire } = useQuestionnaire()

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Overlay layers ──────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-uptide-dark/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-uptide-dark/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-uptide-cyan/6 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] rounded-full bg-uptide-blue/15 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,216,255,0.7) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left column : text ─────────────────────────────── */}
          <div>
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-uptide-cyan/25 text-uptide-cyan text-sm font-medium mb-8 ${started ? 'animate-fade-down' : 'opacity-0'}`}
              style={started ? { animationDelay: '0ms' } : {}}
            >
              <span className="w-2 h-2 rounded-full bg-uptide-cyan animate-pulse flex-shrink-0" />
              Cabinet de conseil en croissance
            </div>

            {/* H1 */}
            <h1 className="text-5xl sm:text-6xl lg:text-[3.8rem] xl:text-[4.4rem] font-extrabold text-white leading-[1.08] tracking-tight mb-6">
              <span
                className={`block ${started ? 'animate-fade-up' : 'opacity-0'}`}
                style={started ? fadeUpStyle(120) : {}}
              >
                Débloquez la
              </span>
              <span
                className={`block ${started ? 'animate-fade-up' : 'opacity-0'}`}
                style={started ? fadeUpStyle(240) : {}}
              >
                <span className="relative inline-block text-uptide-cyan">
                  croissance
                  <svg
                    className="absolute -bottom-1 left-0 w-full overflow-visible"
                    viewBox="0 0 220 8"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6 C55 1, 165 1, 218 6"
                      stroke="#00D8FF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="animate-underline"
                    />
                  </svg>
                </span>{' '}de votre
              </span>
              <span
                className={`block ${started ? 'animate-fade-up' : 'opacity-0'}`}
                style={started ? fadeUpStyle(360) : {}}
              >
                entreprise.
              </span>
            </h1>

            {/* Subtext */}
            <p
              className={`text-white/55 text-lg leading-relaxed mb-8 max-w-lg ${started ? 'animate-fade-up' : 'opacity-0'}`}
              style={started ? fadeUpStyle(480) : {}}
            >
              Passez d'actions dispersées à un plan clair et piloté.
              Des décisions guidées par la donnée et le bon sens.
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row items-start gap-4 mb-7 ${started ? 'animate-fade-up' : 'opacity-0'}`}
              style={started ? fadeUpStyle(600) : {}}
            >
              <button
                onClick={openQuestionnaire}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-uptide-cyan text-uptide-dark font-bold text-base transition-all hover:gap-3 hover:shadow-[0_0_36px_rgba(0,216,255,0.5)] overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                Réserver mon audit offert
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#method"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-white font-semibold text-base hover:border-uptide-cyan/50 hover:bg-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-uptide-cyan/20 border border-uptide-cyan/30 flex items-center justify-center group-hover:bg-uptide-cyan/30 transition-colors">
                  <Play size={12} fill="#00D8FF" className="text-uptide-cyan ml-0.5" />
                </div>
                Découvrir la méthode
              </a>
            </div>

            {/* Micro-text */}
            <p
              className={`text-white/30 text-sm ${started ? 'animate-fade-up' : 'opacity-0'}`}
              style={started ? fadeUpStyle(720) : {}}
            >
              Réponse sous 24h · Sans engagement · 100% orienté résultats
            </p>
          </div>

          {/* ── Right column : dashboard mockup ────────────────── */}
          <div
            className={`hidden lg:flex items-center justify-end ${started ? 'animate-fade-up' : 'opacity-0'}`}
            style={started ? fadeUpStyle(300) : {}}
          >
            <DashboardPreview />
          </div>

        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────── */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 ${started ? 'animate-fade-up' : 'opacity-0'}`}
        style={started ? fadeUpStyle(1000) : {}}
      >
        <span className="text-white/25 text-xs tracking-widest uppercase">Défiler</span>
        <ChevronDown size={18} className="text-uptide-cyan/40 animate-scroll-bounce" />
      </div>
    </section>
  )
}
