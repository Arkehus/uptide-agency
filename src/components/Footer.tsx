import { Zap, Twitter, Linkedin, Github, Mail } from 'lucide-react'

const footerLinks = [
  {
    title: 'Nos offres',
    links: [
      { label: 'Diagnostic Croissance', href: '#offers' },
      { label: 'Plan de Développement', href: '#offers' },
      { label: 'Pilotage Mensuel', href: '#offers' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'La Méthode', href: '#method' },
      { label: 'Nos Outils', href: '#tools' },
      { label: 'Cas Clients', href: '#cases' },
      { label: 'Contact', href: '#cta' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Audit offert', href: '#cta' },
      { label: 'hello@uptide.fr', href: 'mailto:hello@uptide.fr' },
      { label: 'LinkedIn', href: '#' },
    ],
  },
]

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'Github' },
  { icon: Mail, href: 'mailto:hello@uptide.agency', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-uptide-cyan/20 border border-uptide-cyan/40 flex items-center justify-center">
                <Zap size={16} className="text-uptide-cyan" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Up<span className="text-uptide-cyan">tide</span>
              </span>
            </a>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Du conseil terrain, piloté par la data.
              Nous aidons les PME à dépasser leur plafond de chiffre d'affaires.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-uptide-cyan hover:border-uptide-cyan/30 hover:bg-uptide-cyan/10 transition-all"
                  >
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/40 hover:text-white/80 text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <p>© 2026 Uptide — Tous droits réservés.</p>
          <div className="flex items-center gap-1">
            <span>Fait avec</span>
            <span className="text-uptide-cyan">♥</span>
            <span>en France</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
