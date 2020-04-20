/**
 * @description Configuração de valores das chaves utilizadas para salvar valores no local storage
 */
class LocalStorageKeys {
    GLOSSARY_VERSION = 'G_version'
    GLOSSARY_ITEMS = 'G_itemList'
    EMAIL = 'e'
    PICTURE_URL = 'pu'
    NAME = 'n'
    GOOGLE_ACCESS_TOKEN = 'gat'
    AUTH_TOKEN = 'at'
    REFRESH_TOKEN_REQUIRED = 'rtr'
    LANGUAGE: string = 'lan'
    APP_SETTINGS_VERSION: string = 'asv'
    APP_SETTINGS: string = 'as'
    PAGE_TEMP: string = 'pt'
}

export default new LocalStorageKeys()