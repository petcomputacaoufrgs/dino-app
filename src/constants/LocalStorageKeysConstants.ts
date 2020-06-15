/**
 * @description Configuração de valores das chaves utilizadas para salvar valores no local storage
 */
class LocalStorageKeys {
  GLOSSARY_VERSION = 'G_version'
  GLOSSARY_ITEMS = 'G_itemList'
  GLOSSARY_SHOULD_SYNC = 'G_shouldSync'
  CONTACTS_VERSION = 'C_version'
  CONTACTS = 'C_itemList'
  SHOULD_SYNC_CONTACTS = 'contact_ids'
  EMAIL = 'e'
  PICTURE_URL = 'pu'
  NAME = 'n'
  GOOGLE_ACCESS_TOKEN = 'gat'
  AUTH_TOKEN = 'at'
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
