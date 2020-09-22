import DinoAPIURLConstants from './DinoAPIURLConstants'

/**
 * @description Valores de URL para conexão com o WebScoket da API
 */
class DinoAPIWebSocketConstants {
  URL = `${DinoAPIURLConstants.URL}websocket/`
  ALERT_GLOSSARY_UPDATE = '/topic/glossary/update'
  ALERT_APP_SETTINGS_UPDATE = '/user/queue/user_app_settings/update'
  ALERT_NOTE_UPDATE = '/user/queue/note/update'
  ALERT_NOTE_ORDER_UPDATE = '/user/queue/note/order/update'
  ALERT_NOTE_DELETE = '/user/queue/note_column/delete'
  ALERT_NOTE_COLUMN_UPDATE = '/user/queue/note_column/update'
  ALERT_NOTE_COLUMN_ORDER_UPDATE = '/user/queue/note_column/order/update'
  ALERT_NOTE_COLUMN_DELETE = '/user/queue/note_column/delete'
  ALERT_USER_UPDATE = '/user/queue/user/update'
  ALERT_CONTACT_UPDATE = '/user/queue/contact/update'
  ALERT_FAQ_UPDATE = '/topic/faq/update'
  ALERT_FAQ_USER_UPDATE = '/user/queue/faq/update/user'
}

export default new DinoAPIWebSocketConstants()
