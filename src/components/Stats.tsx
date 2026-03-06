import { BarChart3, Clock, Users } from 'lucide-react'

const stats = [
  {
    icon: BarChart3,
    value: '3',
    label: 'Outils de pilotage inclus',
    desc: 'Dashboard · Analyse concurrentielle · Suivi marketing',
  },
  {
    icon: Clock,
    value: '30j',
    label: 'Pour un premier plan d\'action clair',
    desc: 'Audit + roadmap priorisée livrée en moins d\'un mois',
  },
  {
    icon: Users,
    value: 'PME',
    label: 'Commerces, services et TPE/PME B2B',
    desc: 'De 10 à 50+ salariés, locaux comme régionaux',
  },
]

export default function Stats() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-cyan-400/20 hover:border-uptide-cyan/50 hover:bg-white/8 transition-all"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-uptide-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-uptide-cyan/10 flex items-center justify-center mb-5">
                    <Icon size={20} className="text-uptide-cyan" />
                  </div>
                  <div className="text-4xl font-extrabold text-uptide-cyan mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white font-semibold mb-1">{stat.label}</div>
                  <div className="text-white/40 text-sm">{stat.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
