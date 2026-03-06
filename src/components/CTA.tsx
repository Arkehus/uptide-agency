import { ArrowRight, Calendar, MessageSquare } from 'lucide-react'
import { useQuestionnaire } from '../context/QuestionnaireContext'

export default function CTA() {
  const { openQuestionnaire } = useQuestionnaire()

  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-uptide-cyan/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-uptide-cyan/10 border border-uptide-cyan/20 text-uptide-cyan text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-uptide-cyan animate-pulse" />
          Audit stratégique offert · Sans engagement
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Votre croissance commence
          <br />
          <span className="text-uptide-cyan">par 20 minutes.</span>
        </h2>

        <p className="text-white/50 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Un audit stratégique offert, sans engagement.
          On analyse votre situation. Vous décidez de la suite.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {/* Bouton principal — ouvre le questionnaire */}
          <button
            onClick={openQuestionnaire}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-uptide-cyan text-uptide-dark font-bold text-base hover:bg-uptide-cyan/90 transition-all"
          >
            <Calendar size={18} />
            Réserver mon audit gratuit
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
          <a
            href="#method"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/20 text-white font-semibold text-base hover:border-uptide-cyan/40 hover:bg-white/10 transition-all"
          >
            <MessageSquare size={18} className="text-uptide-cyan" />
            Découvrir la méthode
          </a>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { label: 'Réponse sous 24h', sub: 'En semaine' },
            { label: 'Aucun engagement', sub: '100% orienté résultats' },
            { label: 'Conseil terrain', sub: 'Piloté par la data' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-5 rounded-xl bg-white/5 backdrop-blur-md border border-cyan-400/20"
            >
              <p className="text-white font-semibold text-sm">{item.label}</p>
              <p className="text-white/40 text-xs mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
