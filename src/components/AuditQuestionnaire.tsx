import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

import { useQuestionnaire }                 from '../context/QuestionnaireContext'
import { INITIAL_ANSWERS }                  from '../context/QuestionnaireContext'
import type { Answers }                     from '../context/QuestionnaireContext'
import { sendBooking }                      from '../services/booking'

import StepWelcome      from './questionnaire/StepWelcome'
import StepChoice       from './questionnaire/StepChoice'
import StepForm         from './questionnaire/StepForm'
import StepCalendar     from './questionnaire/StepCalendar'
import StepConfirmation from './questionnaire/StepConfirmation'

// ═══════════════════════════════════════════════════════════════════
// Données des étapes 1–4 (choix uniques)
// ─── Modifiez les textes ici pour changer le questionnaire ────────
// ═══════════════════════════════════════════════════════════════════

// Étape 1 — Type de structure
const STRUCTURE_OPTIONS = [
  {
    id: 'physical',
    emoji: '🏪',
    title: 'Commerce physique',
    description: 'Boutique, restaurant, artisan avec accueil client',
  },
  {
    id: 'services',
    emoji: '🏢',
    title: 'Entreprise de services',
    description: 'Prestataire, consultant, agence, professionnel libéral',
  },
  {
    id: 'b2b',
    emoji: '🔗',
    title: 'TPE/PME B2B',
    description: "Vous vendez à d'autres entreprises",
  },
  {
    id: 'ecommerce',
    emoji: '💻',
    title: 'E-commerce / Hybride',
    description: 'Boutique en ligne ou mix physique + digital',
  },
]

// Étape 2 — Taille de l'équipe
const TEAM_OPTIONS = [
  { id: 'solo',   emoji: '👤',  title: "Seul(e) ou avec 1-2 personnes" },
  { id: 'small',  emoji: '👥',  title: '3 à 9 personnes'               },
  { id: 'medium', emoji: '🏗️', title: '10 à 49 personnes'             },
  { id: 'large',  emoji: '🏛️', title: '50 personnes et plus'          },
]

// Étape 3 — Défi principal
const CHALLENGE_OPTIONS = [
  {
    id: 'stagnation',
    emoji: '📉',
    title: "On stagne, on ne sait pas quoi prioriser",
  },
  {
    id: 'no_strategy',
    emoji: '🔀',
    title: "On fait beaucoup de choses mais sans stratégie claire",
  },
  {
    id: 'no_dashboard',
    emoji: '📊',
    title: "On n'a pas de tableau de bord ni d'indicateurs fiables",
  },
  {
    id: 'competition',
    emoji: '🔍',
    title: "On ne comprend pas pourquoi les concurrents performent mieux",
  },
  {
    id: 'digital',
    emoji: '🌐',
    title: "On veut se développer en ligne mais on ne sait pas par où commencer",
  },
]

// Étape 4 — Urgence / timing
const TIMING_OPTIONS = [
  {
    id: 'urgent',
    emoji: '🔥',
    title: "Dès maintenant — c'est urgent",
    description: 'Je cherche des résultats rapidement',
  },
  {
    id: 'soon',
    emoji: '📅',
    title: 'Dans les 30 prochains jours',
    description: 'Je suis en phase de réflexion active',
  },
  {
    id: 'later',
    emoji: '🔭',
    title: 'Dans 2 à 3 mois',
    description: "Je prépare la suite, je m'informe",
  },
]

// ═══════════════════════════════════════════════════════════════════
// Constantes de navigation
// ═══════════════════════════════════════════════════════════════════
const STEP_WELCOME      = 0
const STEP_STRUCTURE    = 1
const STEP_TEAM         = 2
const STEP_CHALLENGE    = 3
const STEP_TIMING       = 4
const STEP_FORM         = 5
const STEP_CALENDAR     = 6
const STEP_CONFIRMATION = 7
const TOTAL_STEPS       = 6  // affichés dans "Étape X sur 6"

// ═══════════════════════════════════════════════════════════════════
// Composant principal — Modale multi-étapes
// ═══════════════════════════════════════════════════════════════════
export default function AuditQuestionnaire() {
  const { isOpen, closeQuestionnaire } = useQuestionnaire()

  // ── État local ────────────────────────────────────────────────
  const [currentStep, setCurrentStep]   = useState<number>(STEP_WELCOME)
  const [direction, setDirection]       = useState<'forward' | 'backward'>('forward')
  const [answers, setAnswers]           = useState<Answers>(INITIAL_ANSWERS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError]   = useState<string | null>(null)

  // ── Réinitialise le questionnaire à la fermeture ──────────────
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setCurrentStep(STEP_WELCOME)
        setAnswers(INITIAL_ANSWERS)
        setDirection('forward')
      }, 350)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // ── Bloque le scroll du body quand la modale est ouverte ──────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Navigation ────────────────────────────────────────────────
  const goNext = useCallback(() => {
    setDirection('forward')
    setCurrentStep((s) => s + 1)
  }, [])

  const goPrev = useCallback(() => {
    setDirection('backward')
    setCurrentStep((s) => s - 1)
  }, [])

  // ── Sélection automatique + avance après 400ms (étapes 1–4) ──
  const handleChoice = useCallback(
    (field: keyof Answers, value: string) => {
      setAnswers((prev) => ({ ...prev, [field]: value }))
      setDirection('forward')
      setTimeout(() => setCurrentStep((s) => s + 1), 400)
    },
    []
  )

  // ── Mise à jour des champs du formulaire (étape 5) ────────────
  const handleFormChange = useCallback((field: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }))
  }, [])

  // ── Confirmation de réservation : appel API → avance si OK ────
  const handleConfirmBooking = useCallback(async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await sendBooking(answers)

    setIsSubmitting(false)

    if (result.success) {
      setDirection('forward')
      setCurrentStep(STEP_CONFIRMATION)
    } else {
      setSubmitError(result.error ?? 'Une erreur est survenue.')
    }
  }, [answers])

  // ── Barre de progression ──────────────────────────────────────
  // Étapes 1–6 → 0% à 100%. Étape 0 et 7 = cas particuliers.
  const progressPercent =
    currentStep === STEP_WELCOME      ? 0   :
    currentStep === STEP_CONFIRMATION ? 100 :
    Math.round((currentStep / TOTAL_STEPS) * 100)

  // ── Affiche le "Précédent" dans le footer (étapes 2–6) ────────
  const showPrev = currentStep >= STEP_TEAM && currentStep <= STEP_CALENDAR

  // ── Rendu de l'étape courante ─────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {

      // Étape 0 — Accueil
      case STEP_WELCOME:
        return <StepWelcome onStart={goNext} />

      // Étape 1 — Type de structure (2 colonnes, auto-avance)
      case STEP_STRUCTURE:
        return (
          <StepChoice
            question="Quelle est votre structure ?"
            subtitle="Cela nous aide à adapter notre approche."
            options={STRUCTURE_OPTIONS}
            selected={answers.structureType}
            onSelect={(id) => handleChoice('structureType', id)}
            columns={2}
          />
        )

      // Étape 2 — Taille de l'équipe (1 colonne, auto-avance)
      case STEP_TEAM:
        return (
          <StepChoice
            question="Combien de personnes dans votre équipe ?"
            options={TEAM_OPTIONS}
            selected={answers.teamSize}
            onSelect={(id) => handleChoice('teamSize', id)}
            columns={1}
          />
        )

      // Étape 3 — Défi principal (2 colonnes, auto-avance)
      case STEP_CHALLENGE:
        return (
          <StepChoice
            question="Quel est votre principal défi en ce moment ?"
            subtitle="Choisissez celui qui vous parle le plus."
            options={CHALLENGE_OPTIONS}
            selected={answers.mainChallenge}
            onSelect={(id) => handleChoice('mainChallenge', id)}
            columns={2}
          />
        )

      // Étape 4 — Timing (1 colonne, auto-avance)
      case STEP_TIMING:
        return (
          <StepChoice
            question="Quand souhaitez-vous commencer à agir ?"
            options={TIMING_OPTIONS}
            selected={answers.timing}
            onSelect={(id) => handleChoice('timing', id)}
            columns={1}
          />
        )

      // Étape 5 — Formulaire (le bouton submit est dans le composant)
      case STEP_FORM:
        return (
          <StepForm
            answers={answers}
            onChange={handleFormChange}
            onSubmit={goNext}
          />
        )

      // Étape 6 — Calendrier (le bouton confirmer est dans le composant)
      case STEP_CALENDAR:
        return (
          <StepCalendar
            selected={answers.selectedSlot}
            onSelect={(slot) => {
              setAnswers((prev) => ({ ...prev, selectedSlot: slot }))
              setSubmitError(null)
            }}
            onConfirm={handleConfirmBooking}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )

      // Étape 7 — Confirmation
      case STEP_CONFIRMATION:
        return (
          <StepConfirmation
            firstName={answers.firstName}
            companyName={answers.companyName}
            selectedSlot={answers.selectedSlot}
            onClose={closeQuestionnaire}
          />
        )

      default:
        return null
    }
  }

  // ── Ne rend rien si la modale est fermée ─────────────────────
  if (!isOpen) return null

  // ═══════════════════════════════════════════════════════════════
  // Rendu
  // ═══════════════════════════════════════════════════════════════
  return (
    <>
      {/* Keyframes pour les animations de la modale et des étapes */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(52px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-52px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
      `}</style>

      {/* ── Overlay sombre ──────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-4"
        style={{ animation: 'overlayIn 0.25s ease-out' }}
        onClick={closeQuestionnaire}
      >

        {/* ── Modale ──────────────────────────────────────────── */}
        <div
          className="
            relative w-full sm:max-w-[680px] flex flex-col overflow-hidden
            bg-[#0A3041]
            rounded-t-3xl sm:rounded-3xl
            border-0 sm:border sm:border-cyan-400/20
            shadow-2xl
            max-h-[92vh] sm:max-h-[88vh]
          "
          style={{ animation: 'modalIn 0.3s ease-out' }}
          onClick={(e) => e.stopPropagation()}
        >

          {/* ── Barre de progression ─────────────────────────── */}
          <div className="flex-shrink-0 h-1 bg-white/[0.06] rounded-t-3xl sm:rounded-t-3xl overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* ── En-tête : compteur d'étape + croix de fermeture ── */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 pt-5 pb-1">
            {/* Compteur visible sur les étapes 1–6 */}
            {currentStep >= STEP_STRUCTURE && currentStep <= STEP_CALENDAR ? (
              <span className="text-white/30 text-xs font-medium tabular-nums">
                Étape {currentStep} sur {TOTAL_STEPS}
              </span>
            ) : (
              <span />
            )}

            {/* Bouton fermeture */}
            <button
              onClick={closeQuestionnaire}
              aria-label="Fermer"
              className="ml-auto w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <X size={15} />
            </button>
          </div>

          {/* ── Contenu de l'étape (zone scrollable) ────────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* key={currentStep} force le remontage → relance l'animation */}
            <div
              key={currentStep}
              style={{
                animation: `${direction === 'forward' ? 'slideInRight' : 'slideInLeft'} 0.28s ease-out`,
              }}
            >
              {renderStep()}
            </div>
          </div>

          {/* ── Footer : bouton Précédent ────────────────────────── */}
          {showPrev && (
            <div className="flex-shrink-0 flex items-center px-6 pb-5 pt-3 border-t border-white/[0.06]">
              <button
                onClick={goPrev}
                className="text-white/35 text-sm hover:text-white/65 transition-colors flex items-center gap-1"
              >
                <span className="text-base leading-none">←</span>
                Précédent
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
