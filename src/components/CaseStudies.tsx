import { ArrowUpRight, TrendingUp, Users } from 'lucide-react'

const cases = [
  {
    company: 'Velo Expresso',
    sector: 'Commerce · Mobilite urbaine',
    challenge: 'Atelier velo avec cafe integre, frequentation stagnante et visibilite locale insuffisante.',
    solution: 'Strategie reseaux sociaux locaux, restructuration de l\'offre, creation d\'un bonus fidelite reparation mis en avant en boutique.',
    problems: ['Visibilite locale', 'Offre peu lisible', 'Fidelisation absente'],
    results: [
      { icon: TrendingUp, metric: '+35%', label: 'de frequentation' },
      { icon: Users, metric: '60j', label: 'pour des resultats concrets' },
    ],
    tag: 'Plan de Developpement',
  },
  {
    company: 'Epicerie de la Gare',
    sector: 'Commerce · Alimentaire',
    challenge: 'Epicerie fine en gare, faible panier moyen et aucun canal professionnel developpe.',
    solution: 'Creation de coffrets cadeaux B2B, mise en avant des produits premium, developpement d\'une strategie de prospection locale entreprises.',
    problems: ['Panier moyen bas', 'Canal B2B inexistant', 'Mise en avant produits'],
    results: [
      { icon: TrendingUp, metric: '+28%', label: 'de panier moyen' },
      { icon: ArrowUpRight, metric: 'B2B', label: 'nouveau canal ouvert' },
    ],
    tag: 'Diagnostic Croissance',
  },
]

export default function CaseStudies() {
  return (
    <section id="cases" className="py-24 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-uptide-blue/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-uptide-cyan/10 text-uptide-cyan text-sm font-semibold mb-4 border border-uptide-cyan/20">
            Cas clients
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ils ont franchi{' '}
            <span className="text-uptide-cyan">leur plafond.</span>
          </h2>
          <p className="text-white/50 text-lg">
            Des accompagnements concrets, avec des resultats reels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cases.map((c) => (
            <div
              key={c.company}
              className="group relative flex flex-col p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-cyan-400/20 hover:border-uptide-cyan/40 hover:bg-white/8 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-uptide-cyan text-xs font-bold uppercase tracking-widest">
                    {c.sector}
                  </span>
                  <h3 className="text-white text-xl font-bold mt-1">{c.company}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs font-medium border border-white/10">
                  {c.tag}
                </span>
              </div>

              {/* Challenge */}
              <div className="mb-4">
                <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-2">
                  Situation
                </p>
                <p className="text-white/70 text-sm leading-relaxed">{c.challenge}</p>
              </div>

              {/* Problems */}
              <div className="mb-4">
                <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-2">
                  Problemes resolus
                </p>
                <div className="flex flex-wrap gap-2">
                  {c.problems.map((p) => (
                    <span key={p} className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-white/50 text-xs">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Solution */}
              <div className="mb-8">
                <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-2">
                  Actions menees
                </p>
                <p className="text-white/70 text-sm leading-relaxed">{c.solution}</p>
              </div>

              {/* Results */}
              <div className="mt-auto pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                {c.results.map((r) => {
                  const Icon = r.icon
                  return (
                    <div key={r.label} className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Icon size={14} className="text-uptide-cyan" />
                        <span className="text-uptide-cyan text-2xl font-extrabold">
                          {r.metric}
                        </span>
                      </div>
                      <span className="text-white/40 text-xs">{r.label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Hover CTA */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-uptide-cyan/20 border border-uptide-cyan/40 flex items-center justify-center">
                  <ArrowUpRight size={14} className="text-uptide-cyan" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
