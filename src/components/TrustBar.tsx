const items = [
  'Méthode éprouvée',
  'Outils sur-mesure',
  'Pilotage continu',
  'Résultats mesurables',
  'Conseil terrain',
  'Décisions guidées par la data',
  'Clarté des priorités',
  'Performance commerciale',
]

// Duplicate for seamless loop
const marqueeItems = [...items, ...items]

export default function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-6 overflow-hidden">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{
          animation: 'marquee 30s linear infinite',
        }}
      >
        {marqueeItems.map((item, i) => (
          <span
            key={i}
            className="flex-shrink-0 text-white/35 font-semibold text-sm tracking-wide flex items-center gap-3"
          >
            <span className="w-1 h-1 rounded-full bg-uptide-cyan/50 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
