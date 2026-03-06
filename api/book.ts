import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { google } from 'googleapis'

// ─── Types ────────────────────────────────────────────────────────────────
interface BookingPayload {
  firstName:     string
  companyName:   string
  email:         string
  phone:         string
  selectedSlot:  string   // ex: "Lun 16 juin à 9h00"
  structureType: string
  teamSize:      string
  mainChallenge: string
  timing:        string
}

// ─── Parse "Lun 16 juin à 9h00" → Date ────────────────────────────────────
const MONTH_MAP: Record<string, number> = {
  jan: 0, fév: 1, mars: 2, avr: 3, mai: 4, juin: 5,
  juil: 6, août: 7, sept: 8, oct: 9, nov: 10, déc: 11,
}

function parseSlot(slot: string): { start: Date; end: Date } {
  const match = slot.match(/\w+ (\d+) (\w+) à (\d+)h(\d*)/)
  const now = new Date()

  let start: Date
  if (match) {
    const day   = parseInt(match[1], 10)
    const month = MONTH_MAP[match[2].toLowerCase()] ?? now.getMonth()
    const hour  = parseInt(match[3], 10)
    const min   = parseInt(match[4] || '0', 10)

    // Utilise l'année courante, ou la suivante si la date est passée
    let year = now.getFullYear()
    const candidate = new Date(year, month, day, hour, min)
    if (candidate < now) year += 1

    start = new Date(year, month, day, hour, min)
  } else {
    start = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    start.setHours(10, 0, 0, 0)
  }

  const end = new Date(start.getTime() + 60 * 60 * 1000) // +1h
  return { start, end }
}

// ─── Labels lisibles pour les réponses ────────────────────────────────────
const STRUCTURE_LABELS: Record<string, string> = {
  physical:  'Commerce physique',
  services:  'Entreprise de services',
  b2b:       'TPE/PME B2B',
  ecommerce: 'E-commerce / Hybride',
}
const TEAM_LABELS: Record<string, string> = {
  solo:   'Seul(e) ou avec 1-2 personnes',
  small:  '3 à 9 personnes',
  medium: '10 à 49 personnes',
  large:  '50 personnes et plus',
}
const CHALLENGE_LABELS: Record<string, string> = {
  stagnation:   'On stagne, on ne sait pas quoi prioriser',
  no_strategy:  'On fait beaucoup de choses sans stratégie claire',
  no_dashboard: "Pas de tableau de bord ni d'indicateurs",
  competition:  'Les concurrents performent mieux — on ne comprend pas pourquoi',
  digital:      'Se développer en ligne sans savoir par où commencer',
}
const TIMING_LABELS: Record<string, string> = {
  urgent: "Dès maintenant — c'est urgent",
  soon:   'Dans les 30 prochains jours',
  later:  'Dans 2 à 3 mois',
}

// ─── Email HTML pour le propriétaire ──────────────────────────────────────
function ownerEmailHtml(d: BookingPayload): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a3041;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">

    <div style="background:#0d3a50;border:1px solid rgba(0,216,255,0.2);border-radius:16px;overflow:hidden;">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0a3041,#0d4a6a);padding:32px 32px 24px;border-bottom:1px solid rgba(0,216,255,0.1);">
        <p style="margin:0 0 8px;color:#00d8ff;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Nouvelle réservation</p>
        <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">Audit offert réservé</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.5);font-size:14px;">Créneau : <strong style="color:#00d8ff;">${d.selectedSlot}</strong></p>
      </div>

      <!-- Coordonnées -->
      <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.06);">
        <p style="margin:0 0 16px;color:rgba(255,255,255,0.35);font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Contact</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:13px;width:120px;">Prénom</td>
            <td style="padding:6px 0;color:#ffffff;font-size:13px;font-weight:600;">${d.firstName}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:13px;">Entreprise</td>
            <td style="padding:6px 0;color:#ffffff;font-size:13px;font-weight:600;">${d.companyName}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:13px;">Email</td>
            <td style="padding:6px 0;color:#00d8ff;font-size:13px;font-weight:600;">${d.email}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:13px;">Téléphone</td>
            <td style="padding:6px 0;color:#ffffff;font-size:13px;font-weight:600;">${d.phone || '—'}</td>
          </tr>
        </table>
      </div>

      <!-- Questionnaire -->
      <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.06);">
        <p style="margin:0 0 16px;color:rgba(255,255,255,0.35);font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Questionnaire</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:13px;width:120px;">Structure</td>
            <td style="padding:6px 0;color:#ffffff;font-size:13px;">${STRUCTURE_LABELS[d.structureType] ?? d.structureType}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:13px;">Équipe</td>
            <td style="padding:6px 0;color:#ffffff;font-size:13px;">${TEAM_LABELS[d.teamSize] ?? d.teamSize}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:13px;">Défi</td>
            <td style="padding:6px 0;color:#ffffff;font-size:13px;">${CHALLENGE_LABELS[d.mainChallenge] ?? d.mainChallenge}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:rgba(255,255,255,0.4);font-size:13px;">Timing</td>
            <td style="padding:6px 0;color:#ffffff;font-size:13px;">${TIMING_LABELS[d.timing] ?? d.timing}</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="padding:20px 32px;text-align:center;">
        <p style="margin:0;color:rgba(255,255,255,0.25);font-size:12px;">Uptide — Notification automatique de réservation</p>
      </div>

    </div>
  </div>
</body>
</html>`
}

// ─── Email HTML pour le client ─────────────────────────────────────────────
function clientEmailHtml(d: BookingPayload): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a3041;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">

    <div style="background:#0d3a50;border:1px solid rgba(0,216,255,0.2);border-radius:16px;overflow:hidden;">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0a3041,#0d4a6a);padding:32px 32px 24px;border-bottom:1px solid rgba(0,216,255,0.1);">
        <p style="margin:0 0 8px;color:#00d8ff;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Uptide</p>
        <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;">Votre audit est confirmé, ${d.firstName} !</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.5);font-size:14px;">On se retrouve le <strong style="color:#00d8ff;">${d.selectedSlot}</strong></p>
      </div>

      <!-- Message -->
      <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.06);">
        <p style="margin:0 0 12px;color:rgba(255,255,255,0.7);font-size:14px;line-height:1.7;">
          Merci d'avoir réservé votre audit de croissance offert. On a bien reçu vos réponses et on va étudier votre situation avant l'appel pour arriver avec des premières pistes concrètes.
        </p>
        <p style="margin:0;color:rgba(255,255,255,0.7);font-size:14px;line-height:1.7;">
          Vous recevrez le lien de visioconférence dans les 24h.
        </p>
      </div>

      <!-- Prochaines étapes -->
      <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.06);">
        <p style="margin:0 0 16px;color:rgba(255,255,255,0.35);font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Ce qui se passe ensuite</p>
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
          <span style="width:20px;height:20px;border-radius:50%;background:rgba(0,216,255,0.15);border:1px solid rgba(0,216,255,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#00d8ff;font-size:10px;font-weight:700;margin-top:1px;">1</span>
          <p style="margin:0;color:rgba(255,255,255,0.6);font-size:13px;line-height:1.6;">On étudie votre questionnaire et votre secteur avant l'appel</p>
        </div>
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
          <span style="width:20px;height:20px;border-radius:50%;background:rgba(0,216,255,0.15);border:1px solid rgba(0,216,255,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#00d8ff;font-size:10px;font-weight:700;margin-top:1px;">2</span>
          <p style="margin:0;color:rgba(255,255,255,0.6);font-size:13px;line-height:1.6;">Vous recevrez un lien visio par email avant le rendez-vous</p>
        </div>
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="width:20px;height:20px;border-radius:50%;background:rgba(0,216,255,0.15);border:1px solid rgba(0,216,255,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#00d8ff;font-size:10px;font-weight:700;margin-top:1px;">3</span>
          <p style="margin:0;color:rgba(255,255,255,0.6);font-size:13px;line-height:1.6;">On arrive préparés avec des premières pistes concrètes pour votre croissance</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:20px 32px;text-align:center;">
        <p style="margin:0 0 4px;color:rgba(255,255,255,0.25);font-size:12px;">Une question ? Répondez directement à cet email.</p>
        <p style="margin:0;color:rgba(255,255,255,0.15);font-size:11px;">© 2026 Uptide — Cabinet de conseil en croissance</p>
      </div>

    </div>
  </div>
</body>
</html>`
}

// ─── Handler principal ────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' })

  const data = req.body as BookingPayload

  // Validation minimale
  if (!data?.email || !data?.firstName || !data?.selectedSlot) {
    return res.status(400).json({ error: 'Champs requis manquants' })
  }

  try {
    // ── 1. Emails via Resend ─────────────────────────────────────────
    const resend = new Resend(process.env.RESEND_API_KEY)

    await Promise.all([
      // Email au propriétaire
      resend.emails.send({
        from:    process.env.RESEND_FROM_EMAIL!,
        to:      process.env.OWNER_EMAIL!,
        subject: `🎯 Nouvel audit réservé — ${data.firstName} (${data.companyName}) — ${data.selectedSlot}`,
        html:    ownerEmailHtml(data),
        replyTo: data.email,
      }),
      // Email de confirmation au client
      resend.emails.send({
        from:    process.env.RESEND_FROM_EMAIL!,
        to:      data.email,
        subject: `Votre audit Uptide est confirmé — ${data.selectedSlot}`,
        html:    clientEmailHtml(data),
      }),
    ])

    // ── 2. Événement Google Calendar via Service Account (optionnel) ──
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key:  (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/calendar'],
      })

      const calendar = google.calendar({ version: 'v3', auth })
      const { start, end } = parseSlot(data.selectedSlot)

      await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID ?? 'primary',
        requestBody: {
          summary:     `Audit Uptide — ${data.firstName} (${data.companyName})`,
          description: [
            `Client : ${data.firstName} — ${data.companyName}`,
            `Email  : ${data.email}`,
            `Tél    : ${data.phone || '—'}`,
            '',
            `Structure : ${STRUCTURE_LABELS[data.structureType] ?? data.structureType}`,
            `Équipe    : ${TEAM_LABELS[data.teamSize] ?? data.teamSize}`,
            `Défi      : ${CHALLENGE_LABELS[data.mainChallenge] ?? data.mainChallenge}`,
            `Timing    : ${TIMING_LABELS[data.timing] ?? data.timing}`,
          ].join('\n'),
          start:     { dateTime: start.toISOString(), timeZone: 'Europe/Paris' },
          end:       { dateTime: end.toISOString(),   timeZone: 'Europe/Paris' },
          attendees: [{ email: data.email, displayName: `${data.firstName} (${data.companyName})` }],
          reminders: {
            useDefault: false,
            overrides:  [
              { method: 'email', minutes: 60 },
              { method: 'popup', minutes: 15 },
            ],
          },
        },
      })
    }

    return res.status(200).json({ success: true })

  } catch (err) {
    console.error('[book] Error:', err)
    return res.status(500).json({ error: 'Erreur serveur. Réessayez ou contactez-nous directement.' })
  }
}
