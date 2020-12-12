import APIConfig from '../../environment/api_config.json'

/**
 * @description Valores de URL da API para conexão
 */
class APIRequestMappingConstants {
  URL = APIConfig.URL
  GLOSSARY = `${this.URL}public/glossary/`
  NOTE = `${this.URL}note/`
  NOTE_COLUMN = `${this.URL}note_column/`
  USER = `${this.URL}user/`
  private AUTH = `${this.URL}auth/`
  private PUBLIC_AUTH = `${this.URL}public/auth/`
  private APP_SETTINGS = `${this.URL}user_app_settings/`
  private LOG_APP_ERROR = `${this.URL}log_app_error/`
  CONTACT = this.URL + 'contacts/'
  PHONE = this.URL + 'phones/'
  GOOGLE_CONTACT = this.URL + 'google_contacts/'
  private FAQ = this.URL + 'faq/'

  AUTH_GOOGLE = `${this.PUBLIC_AUTH}google/`

  GRANT_GOOGLE = `${this.AUTH}google/grant/`

  REFRESH_AUTH_GOOGLE = `${this.AUTH}google/`

  REFRESH_AUTH = `${this.PUBLIC_AUTH}refresh/`

  WEB_SOCKET_AUTH = `${this.AUTH}web_socket/`

  LOGOUT = `${this.AUTH}logout/`

  GLOSSARY_VERSION = `${this.GLOSSARY}version/`

  APP_SETTINGS_VERSION = `${this.APP_SETTINGS}version/`

  APP_SETTINGS_GET = `${this.APP_SETTINGS}`

  APP_SETTINGS_SAVE = `${this.APP_SETTINGS}`

  CONTACT_VERSION = `${this.CONTACT}version/`

  CONTACT_GET = `${this.CONTACT}`

  CONTACT_SAVE = `${this.CONTACT}`

  CONTACT_EDIT = `${this.CONTACT}`

  CONTACT_DELETE = `${this.CONTACT}`

  CONTACT_SAVE_ALL = `${this.CONTACT}all/`

  CONTACT_EDIT_ALL = `${this.CONTACT}all/`

  CONTACT_DELETE_ALL = `${this.CONTACT}all/`

  CONTACT_GOOGLE_DECLINE = `${this.CONTACT}google/decline_contacts/`

  TEST_CONNECTION = `${this.URL}public/test_connection/`

  SAVE_LOG_APP_ERROR = `${this.LOG_APP_ERROR}`

  SAVE_ALL_LOG_APP_ERROR = `${this.LOG_APP_ERROR}all/`

  FAQ_GET = `${this.FAQ}`

  FAQ_GET_VERSION = `${this.FAQ}version/`

  FAQ_SAVE = `${this.FAQ}`

  FAQ_OPTIONS = `${this.URL}public/faq/options/`

  FAQ_SAVE_USER_QUESTION = `${this.FAQ}question/`
}

export default new APIRequestMappingConstants()
