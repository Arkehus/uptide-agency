import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useQuestionnaire } from '../context/QuestionnaireContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useQuestionnaire()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'La Méthode', href: '#method' },
    { label: 'Nos Offres', href: '#offers' },
    { label: 'Nos Outils', href: '#tools' },
    { label: 'Cas Clients', href: '#cases' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-uptide-dark/90 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1008 612"
            className="h-9 w-auto"
            aria-label="Uptide"
          >
            {/* Lettres principales — blanc sur fond sombre */}
            <path fill="white" d="M254.26,415.66l-.05-82.59h23.21s.05,82.58.05,82.58c0,7.51,5.98,13.65,13.49,13.64,7.51,0,13.65-6.15,13.64-13.66l-.05-82.59h23.04s.05,82.58.05,82.58c.01,20.31-16.36,36.7-36.67,36.71-20.31.01-36.7-16.36-36.71-36.67Z"/>
            <path fill="white" d="M354.95,449.89l-.07-116.89,29.52-.02c23.89-.01,43.35,19.43,43.37,43.32.01,23.89-19.43,43.35-43.32,43.37h-6.31s.02,30.21.02,30.21h-23.21ZM378.13,396.47h6.31c11.09,0,20.13-9.06,20.12-20.15,0-11.09-9.06-20.13-20.15-20.12h-6.31s.02,40.27.02,40.27Z"/>
            <path fill="white" d="M456.65,449.83l-.06-93.68h-19.45s-.01-23.2-.01-23.2l62.28-.04v23.21s-19.61.01-19.61.01l.06,93.68h-23.21Z"/>
            {/* Lettre "i" — cyan */}
            <path fill="#00d8ff" d="M499.49,449.69l-.07-116.89h23.21s.01,23.39.01,23.39l.06,93.48h-23.21Z"/>
            <path fill="white" d="M538.94,449.7l-.07-116.89,29.52-.02c32.25-.02,58.54,26.24,58.56,58.49.02,32.25-26.24,58.37-58.49,58.39l-29.52.02ZM562.14,426.48h6.31c19.62-.02,35.31-15.72,35.3-35.18-.01-19.62-15.72-35.31-35.34-35.3h-6.31s.04,70.48.04,70.48Z"/>
            <path fill="white" d="M646.61,449.64l-.07-116.89,62.28-.04v23.21s-39.06.02-39.06.02v23.38s39.09-.02,39.09-.02v23.04s-39.06.02-39.06.02v24.06s39.09-.02,39.09-.02v23.21s-62.27.04-62.27.04Z"/>
          </svg>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/70 hover:text-uptide-cyan text-sm font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-4">
          {/* Bouton "Mon compte Pro" — lien vers le SaaS */}
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-uptide-cyan text-uptide-dark font-semibold text-sm hover:bg-uptide-cyan/90 transition-colors"
          >
            Mon compte Pro
          </a>
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-uptide-dark/95 backdrop-blur-md border-t border-white/10 px-6 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-uptide-cyan font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {l.label}
            </a>
          ))}
          {/* Bouton mobile — lien vers le SaaS */}
          <a
            href="#"
            onClick={() => setIsOpen(false)}
            className="mt-2 inline-flex items-center justify-center px-5 py-3 rounded-full bg-uptide-cyan text-uptide-dark font-semibold text-sm"
          >
            Mon compte Pro
          </a>
        </div>
      )}
    </nav>
  )
}
