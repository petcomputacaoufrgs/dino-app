import APIConfig from '../../environment/api_config.json'

/**
 * @description Valores de URL da API para conexão
 */
class DinoAPIURLConstants {
  URL = APIConfig.URL
  private AUTH = `${this.URL}auth/`
  private PUBLIC_AUTH = `${this.URL}public/auth/`
  private USER = `${this.URL}user/`
  private GLOSSARY = `${this.URL}glossary/`
  private APP_SETTINGS = `${this.URL}user_app_settings/`
  private NOTE = `${this.URL}note/`
  private LOG_APP_ERROR = `${this.URL}log_app_error/`
  private CONTACT = this.URL + 'contacts/'

  AUTH_GOOGLE = `${this.PUBLIC_AUTH}google/`

  REFRESH_AUTH_GOOGLE = `${this.AUTH}google/`

  REFRESH_AUTH = `${this.PUBLIC_AUTH}refresh/`

  USER_VERSION = `${this.USER}version/`

  USER_GET = this.USER

  USER_PUT_PHOTO = `${this.USER}photo/`

  LOGOUT = `${this.AUTH}logout/`

  GLOSSARY_LIST = `${this.GLOSSARY}get/`

  GLOSSARY_VERSION = `${this.GLOSSARY}version/`

  APP_SETTINGS_VERSION = `${this.APP_SETTINGS}version/`

  APP_SETTINGS_GET = `${this.APP_SETTINGS}`

  APP_SETTINGS_SAVE = `${this.APP_SETTINGS}`

  NOTE_GET_VERSION = `${this.NOTE}version/`

  NOTE_GET = `${this.NOTE}`

  NOTE_SAVE = `${this.NOTE}`

  NOTE_ORDER = `${this.NOTE}order/`

  NOTE_DELETE = `${this.NOTE}`

  CONTACT_VERSION = `${this.CONTACT}version/`

  CONTACT_GET = `${this.CONTACT}`

  CONTACT_SAVE = `${this.CONTACT}` 

  CONTACT_DELETE = `${this.CONTACT}`

  CONTACT_SAVE_ALL = `${this.CONTACT}all/`

  CONTACT_EDIT_ALL = `${this.CONTACT}all/`
  
  CONTACT_DELETE_ALL = `${this.CONTACT}all/`
  
  NOTE_DELETE_ALL = `${this.NOTE}all/`

  NOTE_UPDATE_QUESTION = `${this.NOTE}question/`

  NOTE_UPDATE_ANSWER = `${this.NOTE}answer/`

  NOTE_UPDATE_ALL = `${this.NOTE}all/`

  TEST_CONNECTION = `${this.URL}public/test_connection/`

  SAVE_LOG_APP_ERROR = `${this.LOG_APP_ERROR}`

  SAVE_ALL_LOG_APP_ERROR = `${this.LOG_APP_ERROR}all/`
}

export default new DinoAPIURLConstants()
