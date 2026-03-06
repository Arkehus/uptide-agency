import type { Answers } from '../context/QuestionnaireContext'

export interface BookingResult {
  success: boolean
  error?:  string
}

/**
 * Envoie les données de réservation à la fonction serverless Vercel.
 * Déclenche : email propriétaire + email client + événement Google Calendar.
 */
export async function sendBooking(answers: Answers): Promise<BookingResult> {
  try {
    const res = await fetch('/api/book', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        firstName:     answers.firstName,
        companyName:   answers.companyName,
        email:         answers.email,
        phone:         answers.phone,
        selectedSlot:  answers.selectedSlot,
        structureType: answers.structureType,
        teamSize:      answers.teamSize,
        mainChallenge: answers.mainChallenge,
        timing:        answers.timing,
      }),
    })

    const json = await res.json()

    if (!res.ok) {
      return { success: false, error: json.error ?? 'Erreur inconnue' }
    }

    return { success: true }

  } catch {
    return { success: false, error: 'Impossible de contacter le serveur. Vérifiez votre connexion.' }
  }
}
