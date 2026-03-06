import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'

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

const points = [
  "On part du terrain : activite reelle, parcours client, offre concrete",
  "On met de l'ordre avec une analyse structuree et honnete",
  "On construit un plan simple, priorise et actionnable",
  "On suit les resultats via des outils de pilotage clairs",
]

export default function Differentiator() {
  const [sectionRef, inView] = useInView(0.2)

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-uptide-cyan/[0.025] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-uptide-cyan/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div
        ref={sectionRef}
        className={`max-w-3xl mx-auto px-6 text-center scroll-reveal ${inView ? 'in-view' : ''}`}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-10 leading-tight">
          Uptide n'est pas une agence{' '}
          <span className="text-uptide-cyan">qui poste sur Instagram.</span>
        </h2>

        <ul className="space-y-4 text-left max-w-xl mx-auto mb-12">
          {points.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-white/70 text-base bento-item-in"
              style={{
                animationDelay: inView ? `${200 + i * 120}ms` : '0ms',
                opacity: inView ? undefined : 0,
              }}
            >
              <span className="mt-0.5 w-5 h-5 rounded-full bg-uptide-cyan/15 border border-uptide-cyan/30 flex items-center justify-center flex-shrink-0">
                <Check size={11} className="text-uptide-cyan" />
              </span>
              {point}
            </li>
          ))}
        </ul>

        <blockquote
          className="relative inline-block px-8 py-5 rounded-2xl border border-uptide-cyan/20 bg-uptide-cyan/[0.06] max-w-xl"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.75s ease 700ms',
          }}
        >
          <p className="text-white/75 text-base italic leading-relaxed">
            "Du conseil concret, avec des chiffres,
            mais surtout des decisions applicables."
          </p>
          <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-uptide-cyan/40 to-transparent" />
        </blockquote>
      </div>
    </section>
  )
}
