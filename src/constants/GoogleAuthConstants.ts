/**
 * @description Escopos de autenticação com a Google API
 */
class GoogleAuthConstants {
  SCOPE_CALENDAR: string = 'https://www.googleapis.com/auth/calendar'
  SCOPE_PROFILE: string = 'https://www.googleapis.com/auth/userinfo.profile'
  PROMPT_CONSENT: string = 'consent'
}

export default new GoogleAuthConstants()
