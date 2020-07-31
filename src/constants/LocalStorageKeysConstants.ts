/**
 * @description Configuração de valores das chaves utilizadas para salvar valores no local storage
 */
class LocalStorageKeys {
  GLOSSARY_VERSION = 'G_version'
  GLOSSARY_ITEMS = 'G_itemList'
  GLOSSARY_SHOULD_SYNC = 'G_shouldSync'
  CONTACTS = 'c'
  CONTACTS_LAST_ID = 'c_l_id'
  CONTACTS_UPDATE: string = 'c_updt'
  CONTACTS_DEL: string = 'c_del'
  CONTACTS_VERSION = 'cv'
  CONTACTS_SHOULD_SYNC = 'css'
  EMAIL = 'e'
  PICTURE_URL = 'pu'
  NAME = 'n'
  GOOGLE_ACCESS_TOKEN = 'gat'
  AUTH_TOKEN = 'at'
  LOGOUT_TOKEN = 'lt'
  REFRESH_TOKEN_REQUIRED = 'rtr'
  LANGUAGE = 'lan'
  APP_SETTINGS_VERSION = 'asv'
  APP_SETTINGS = 'as'
  APP_SETTINGS_SHOULD_SYNC = 'asss'
  PAGE_TEMP = 'pt'
  NOTE_VERSION = 'nv'
  NOTE_SHOULD_SYNC = 'nss'
  UPDATING_NOTES = 'un'
  UPDATE_NOTES_WITH_ERROR = 'une'
  NOTES_TO_DELETE = 'ntd'
  CONNECTION = 'con'
}

export default new LocalStorageKeys()
