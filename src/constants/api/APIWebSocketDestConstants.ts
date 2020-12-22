import APIRequestMappingConstants from './APIRequestMappingConstants'

/**
 * @description Valores de URL para conexão com o WebScoket da API
 */
class APIWebSocketDestConstants {
  URL = `${APIRequestMappingConstants.URL}websocket/`
  GLOSSARY_UPDATE = generateTopicDest('glossary/update/')
  GLOSSARY_DELETE = generateTopicDest('glossary/delete/')
  FAQ_UPDATE = generateTopicDest('faq/update/')
  FAQ_DELETE = generateTopicDest('faq/delete/')
  FAQ_ITEM_UPDATE = generateTopicDest('faq_item/update/')
  FAQ_ITEM_DELETE = generateTopicDest('faq_item/delete/')
  TREATMENT_UPDATE = generateTopicDest('treatment/update/')
  TREATMENT_DELETE = generateTopicDest('treatment/delete/')
  FAQ_USER_QUESTION_UPDATE = generateQueueDest('faq_user_question/update/')
  FAQ_USER_QUESTION_DELETE = generateQueueDest('faq_user_question/delete/')
  CONTACT_UPDATE = generateQueueDest('contact/update/')
  CONTACT_DELETE = generateQueueDest('contact/delete/')
  PHONE_UPDATE = generateQueueDest('phone/update/')
  PHONE_DELETE = generateQueueDest('phone/delete/')
  GOOGLE_CONTACT_UPDATE = generateQueueDest('google/contact/update/')
  GOOGLE_CONTACT_DELETE = generateQueueDest('google/contact/delete/')
  NOTE_UPDATE = generateQueueDest('note/update/')
  NOTE_DELETE = generateQueueDest('note/delete/')
  NOTE_COLUMN_UPDATE = generateQueueDest('note_column/update/')
  NOTE_COLUMN_DELETE = generateQueueDest('note_column/delete/')
  USER_UPDATE = generateQueueDest('user/update/')
  USER_DELETE = generateQueueDest('user/delete/')
  USER_SETTINGS_UPDATE = generateQueueDest('user_settings/update/')
  USER_SETTINGS_DELETE = generateQueueDest('user_settings/delete/')
  GOOGLE_SCOPE_UPDATE = generateQueueDest('/auth/google/scope/update/')
  GOOGLE_SCOPE_DELETE = generateQueueDest('/auth/google/scope/delete/')
}

const generateTopicDest = (dest: string) => {
  return '/topic/' + dest
}

const generateQueueDest = (dest: string) => {
  return '/user/queue/' + dest
}

export default new APIWebSocketDestConstants()
