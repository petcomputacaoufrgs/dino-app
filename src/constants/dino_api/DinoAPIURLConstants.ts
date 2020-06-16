/**
 * @description Valores de URL da API para conexão
 */
class DinoAPIURLConstants {
  private URL = 'https://inf-ufrgs-tst-api-dino.herokuapp.com/'
  private AUTH = this.URL + 'auth/'
  private GLOSSARY = this.URL + 'glossary/'
  private APP_SETTINGS = this.URL + 'user_app_settings/'
  private NOTE = this.URL + 'note/'

  AUTH_GOOGLE = this.AUTH + 'google/'

  GLOSSARY_LIST = this.GLOSSARY + 'get/'

  GLOSSARY_VERSION = this.GLOSSARY + 'version/'

  APP_SETTINGS_VERSION = this.APP_SETTINGS + 'version/'

  APP_SETTINGS_GET = this.APP_SETTINGS

  APP_SETTINGS_SAVE = this.APP_SETTINGS

  NOTE_GET_VERSION = this.NOTE + 'version/'

  NOTE_GET = this.NOTE

  NOTE_SAVE = this.NOTE

  NOTE_ORDER = this.NOTE + 'order/'

  NOTE_DELETE = this.NOTE

  NOTE_DELETE_ALL = this.NOTE + 'all/'

  NOTE_UPDATE_QUESTION = this.NOTE + 'question/'

  NOTE_UPDATE_ANSWER = this.NOTE + 'answer/'

  NOTE_UPDATE_ALL = this.NOTE + 'all/'

  TEST_CONNECTION = this.URL + 'test_connection/'
}

export default new DinoAPIURLConstants()
