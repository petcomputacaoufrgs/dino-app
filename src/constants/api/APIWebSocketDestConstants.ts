import APIRequestMappingConstants from './APIRequestMappingConstants'

/**
 * @description Valores de URL para conexão com o WebScoket da API
 */
class APIWebSocketDestConstants {
  URL = `${APIRequestMappingConstants.URL}websocket/`
  GLOSSARY_UPDATE = generateTopicDest('glossary/update/')
  GLOSSARY_DELETE = generateTopicDest('glossary/delete/')
  NOTE_UPDATE = generateQueueDest('note/update/')
  NOTE_DELETE = generateQueueDest('note/delete/')
  NOTE_COLUMN_UPDATE = generateQueueDest('note_column/update/')
  NOTE_COLUMN_DELETE = generateQueueDest('note_column/delete/')
  USER_UPDATE = generateQueueDest('user/update/')
  USER_DELETE = generateQueueDest('user/delete/')
  ALERT_APP_SETTINGS_UPDATE = '/user/queue/user_app_settings/update'
  ALERT_NOTE_UPDATE = '/user/queue/note/update'
  ALERT_NOTE_ORDER_UPDATE = '/user/queue/note/order/update'
  ALERT_NOTE_DELETE = '/user/queue/note/delete'
  ALERT_NOTE_COLUMN_UPDATE = '/user/queue/note_column/update'
  ALERT_NOTE_COLUMN_ORDER_UPDATE = '/user/queue/note_column/order/update'
  ALERT_NOTE_COLUMN_DELETE = '/user/queue/note_column/delete'
  ALERT_USER_UPDATE = '/user/queue/user/update'
  ALERT_CONTACT_UPDATE = '/user/queue/contact/update'
  ALERT_FAQ_UPDATE = '/topic/faq/update'
  ALERT_FAQ_USER_UPDATE = '/user/queue/faq/update/user'
  ALERT_AUTH_SCOPE_UPDATE = '/user/queue/auth/scope/update'
}

const generateTopicDest = (dest: string) => {
  return '/topic/' + dest
}

const generateQueueDest = (dest: string) => {
  return '/user/queue/' + dest
}

export default new APIWebSocketDestConstants()
