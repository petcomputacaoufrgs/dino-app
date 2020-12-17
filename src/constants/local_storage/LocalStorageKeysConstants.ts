/**
 * @description Configuração de valores das chaves utilizadas para salvar valores no local storage
 */
class LocalStorageKeys {
  CONTACTS = 'c'
  CONTACTS_LAST_ID = 'c_l_id'
  CONTACTS_UPDATE = 'c_updt'
  CONTACTS_DEL = 'c_del'
  CONTACTS_RESOURCE_NAMES_DEL = 'c_rn_del'
  CONTACTS_VERSION = 'cv'
  CONTACTS_SHOULD_SYNC = 'css'
  GOOGLE_ACCESS_TOKEN = 'gat'
  GOOGLE_EXPIRES_DATE = 'ged'
  GOOGLE_SCOPES = 'gs'
  AUTH_TOKEN = 'at'
  AUTH_TOKEN_EXPIRES_DATE = 'ated'
  REFRESH_TOKEN_REQUIRED = 'rtr'
  LANGUAGE = 'lan'
  APP_SETTINGS_VERSION = 'asv'
  APP_SETTINGS = 'as'
  APP_SETTINGS_SHOULD_SYNC = 'asss'
  PAGE_TEMP = 'pt'
  CONNECTION = 'con'
  LOG_APP_ERROR_SYNC = 'laes'
  FAQ_USER_VERSION = 'fuv'
  FAQ_USER_INFO = 'fui'
  FAQ_ITEMS = 'fi'
  SYNC_STATE = 'ss'
  IS_REFRESHING_ACCESS_TOKEN = 'irat'
  SUCCESS_REFRESHING_ACCESS_TOKEN = 'srat'
  IS_REFRESHING_GOOGLE_ACCESS_TOKEN = 'irgat'
  SUCCESS_REFRESHING_GOOGLE_ACCESS_TOKEN = 'srgat'
  ORIENTATION_STATE = 'os'
  DECLINED_CONTACTS_GRANT = 'dcg'
  IS_FIRST_LOGIN = 'ifl'
}

export default new LocalStorageKeys()
