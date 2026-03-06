import { useEffect, useRef } from 'react'
import { QuestionnaireProvider }  from './context/QuestionnaireContext'
import AuditQuestionnaire         from './components/AuditQuestionnaire'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import TrustBar      from './components/TrustBar'
import Stats         from './components/Stats'
import Method        from './components/Method'
import Differentiator from './components/Differentiator'
import Offers        from './components/Offers'
import Tools         from './components/Tools'
import CaseStudies   from './components/CaseStudies'
import CTA           from './components/CTA'
import Footer        from './components/Footer'

function AppContent() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Scroll-driven parallax : scale + fade sur la vidéo en boucle
    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const scrollY    = window.scrollY
        const maxScroll  = document.documentElement.scrollHeight - window.innerHeight
        const progress   = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0

        // Léger zoom au scroll
        const scale   = 1 + progress * 0.1
        // Fondu : opacité complète → 0.25 entre 15% et 80% de scroll
        const opacity = progress < 0.15
          ? 1
          : Math.max(1 - (progress - 0.15) / 0.65, 0.25)

        video.style.transform = `scale(${scale})`
        video.style.opacity   = String(opacity)
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen text-white relative">

      {/* ── Vidéo en boucle dès le lancement ───────────────────────── */}
      {/* Le scroll handler ajoute le zoom + fondu en parallaxe par-dessus */}
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full object-cover -z-20 origin-center"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/Background loop.mp4" type="video/mp4" />
      </video>

      {/* ── Overlay sombre permanent ────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 bg-uptide-dark/65" />

      <Navbar />
      <Hero />
      <TrustBar />
      <Stats />
      <Method />
      <Differentiator />
      <Offers />
      <Tools />
      <CaseStudies />
      <CTA />
      <Footer />

      {/* ── Modale questionnaire (montée une seule fois) ─────────────── */}
      <AuditQuestionnaire />
    </div>
  )
}

// ── Wrappé par le QuestionnaireProvider pour le contexte global ────
export default function App() {
  return (
    <QuestionnaireProvider>
      <AppContent />
    </QuestionnaireProvider>
  )
}
