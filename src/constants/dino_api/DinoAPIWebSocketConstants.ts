import DinoAPIURLConstants from './DinoAPIURLConstants'

/**
 * @description Valores de URL para conexão com o WebScoket da API
 */
class DinoAPIWebSocketConstants {
  URL = `${DinoAPIURLConstants.URL}websocket/`
  ALERT_GLOSSARY_UPDATE = '/topic/glossary/update'
  ALERT_APP_SETTINGS_UPDATE = '/user/queue/user_app_settings/update'
  ALERT_NOTE_UPDATE = '/user/queue/note/update'
  ALERT_USER_UPDATE = '/user/queue/user/update'
  ALERT_CONTACT_UPDATE = '/user/queue/contact/update'
}

export default new DinoAPIWebSocketConstants()
