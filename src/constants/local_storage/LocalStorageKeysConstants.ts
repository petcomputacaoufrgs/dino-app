/**
 * @description Configuração de valores das chaves utilizadas para salvar valores no local storage
 */
class LocalStorageKeys {
  GOOGLE_ACCESS_TOKEN = 'gat'
  GOOGLE_EXPIRES_DATE = 'ged'
  AUTH_TOKEN = 'at'
  AUTH_TOKEN_EXPIRES_DATE = 'ated'
  CONNECTION = 'con'
  LOG_APP_ERROR_SYNC = 'laes'
  IS_REFRESHING_ACCESS_TOKEN = 'irat'
  SUCCESS_REFRESHING_ACCESS_TOKEN = 'srat'
  IS_REFRESHING_GOOGLE_ACCESS_TOKEN = 'irgat'
  SUCCESS_REFRESHING_GOOGLE_ACCESS_TOKEN = 'srgat'
}

export default new LocalStorageKeys()
