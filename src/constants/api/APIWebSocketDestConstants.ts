import APIRequestMappingConstants from './APIRequestMappingConstants'

/**
 * @description Valores de URL para conexão com o WebScoket da API
 */
class APIWebSocketDestConstants {
  URL = `${APIRequestMappingConstants.URL}websocket/`
  GLOSSARY = 'glossary'
  FAQ = 'faq'
  FAQ_ITEM = 'faq_item'
  TREATMENT = 'treatment'
  FAQ_USER_QUESTION = 'faq_user_question'
  CONTACT = 'contact'
  PHONE = 'phone'
  GOOGLE_CONTACT = 'google/contact'
  NOTE = 'note'
  NOTE_COLUMN = 'note_column'
  USER = 'user'
  USER_SETTINGS = 'user_settings'
  GOOGLE_SCOPE = 'auth/google/scope'
}

export default new APIWebSocketDestConstants()
