import { createContext, useContext, useState, type ReactNode } from 'react'

// ── Answers collected across all steps ────────────────────────────
// Edit the field names here if you add/remove steps.
export interface Answers {
  structureType: string   // étape 1 : type de structure
  teamSize:      string   // étape 2 : taille de l'équipe
  mainChallenge: string   // étape 3 : défi principal
  timing:        string   // étape 4 : urgence / timing
  firstName:     string   // étape 5 : prénom
  companyName:   string   // étape 5 : nom de l'entreprise
  email:         string   // étape 5 : email
  phone:         string   // étape 5 : téléphone (optionnel)
  selectedSlot:  string   // étape 6 : créneau choisi (format lisible)
}

export const INITIAL_ANSWERS: Answers = {
  structureType: '',
  teamSize:      '',
  mainChallenge: '',
  timing:        '',
  firstName:     '',
  companyName:   '',
  email:         '',
  phone:         '',
  selectedSlot:  '',
}

// ── Context interface ─────────────────────────────────────────────
interface QuestionnaireContextType {
  isOpen:            boolean
  openQuestionnaire: () => void
  closeQuestionnaire: () => void
}

const QuestionnaireContext = createContext<QuestionnaireContextType | null>(null)

// ── Provider — wrap App.tsx with this ────────────────────────────
export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <QuestionnaireContext.Provider
      value={{
        isOpen,
        openQuestionnaire:  () => setIsOpen(true),
        closeQuestionnaire: () => setIsOpen(false),
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  )
}

// ── Hook — use in any component to open/close the questionnaire ───
export function useQuestionnaire() {
  const ctx = useContext(QuestionnaireContext)
  if (!ctx) throw new Error('useQuestionnaire must be used within <QuestionnaireProvider>')
  return ctx
}
