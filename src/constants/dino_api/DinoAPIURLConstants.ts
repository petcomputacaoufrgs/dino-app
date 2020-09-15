import APIConfig from '../../environment/api_config.json'

/**
 * @description Valores de URL da API para conexão
 */
class DinoAPIURLConstants {
  URL = APIConfig.URL
  GLOSSARY = `${this.URL}public/glossary/`
  private AUTH = `${this.URL}auth/`
  private PUBLIC_AUTH = `${this.URL}public/auth/`
  private USER = `${this.URL}user/`
  private APP_SETTINGS = `${this.URL}user_app_settings/`
  private NOTE = `${this.URL}note/`
  private NOTE_COLUMN = `${this.URL}note_column/`
  private LOG_APP_ERROR = `${this.URL}log_app_error/`
  private CONTACT = this.URL + 'contacts/'
  private FAQ = this.URL + 'faq/'

  AUTH_GOOGLE = `${this.PUBLIC_AUTH}google/`

  REFRESH_AUTH_GOOGLE = `${this.AUTH}google/`

  REFRESH_AUTH = `${this.PUBLIC_AUTH}refresh/`

  USER_VERSION = `${this.USER}version/`

  USER_GET = this.USER

  USER_PUT_PHOTO = `${this.USER}photo/`

  LOGOUT = `${this.AUTH}logout/`

  GLOSSARY_VERSION = `${this.GLOSSARY}version/`

  APP_SETTINGS_VERSION = `${this.APP_SETTINGS}version/`

  APP_SETTINGS_GET = `${this.APP_SETTINGS}`

  APP_SETTINGS_SAVE = `${this.APP_SETTINGS}`

  NOTE_GET_VERSION = `${this.NOTE}version/`

  NOTE_GET = `${this.NOTE}`

  NOTE_SAVE = `${this.NOTE}`

  NOTE_ORDER = `${this.NOTE}order/`

  NOTE_DELETE = `${this.NOTE}`

  NOTE_DELETE_ALL = `${this.NOTE}all/`

  NOTE_UPDATE_ALL = `${this.NOTE}all/`

  NOTE_COLUMN_GET = `${this.NOTE_COLUMN}`

  NOTE_COLUMN_SAVE = `${this.NOTE_COLUMN}`

  NOTE_COLUMN_DELETE = `${this.NOTE_COLUMN}`

  NOTE_COLUMN_DELETE_ALL = `${this.NOTE_COLUMN}all/`

  NOTE_COLUMN_UPDATE_ALL = `${this.NOTE_COLUMN}all/`

  NOTE_COLUMN_ORDER = `${this.NOTE_COLUMN}order/`

  NOTE_COLUMN_VERSION = `${this.NOTE_COLUMN}version/`

  CONTACT_VERSION = `${this.CONTACT}version/`

  CONTACT_GET = `${this.CONTACT}`

  CONTACT_SAVE = `${this.CONTACT}`

  CONTACT_EDIT = `${this.CONTACT}`

  CONTACT_DELETE = `${this.CONTACT}`

  CONTACT_SAVE_ALL = `${this.CONTACT}all/`

  CONTACT_EDIT_ALL = `${this.CONTACT}all/`

  CONTACT_DELETE_ALL = `${this.CONTACT}all/`

  TEST_CONNECTION = `${this.URL}public/test_connection/`

  SAVE_LOG_APP_ERROR = `${this.LOG_APP_ERROR}`

  SAVE_ALL_LOG_APP_ERROR = `${this.LOG_APP_ERROR}all/`

  FAQ_GET = `${this.FAQ}`

  FAQ_GET_VERSION = `${this.FAQ}version/`

  FAQ_SAVE = `${this.FAQ}`

  FAQ_OPTIONS = `${this.URL}public/faq/options/`

  FAQ_SAVE_USER_QUESTION = `${this.FAQ}question/`
}

export default new DinoAPIURLConstants()
