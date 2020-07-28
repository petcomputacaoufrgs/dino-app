/**
 * @description Valores de URL da API para conexão
 */
class DinoAPIURLConstants {
  private URL = 'http://localhost:5000/'
  private AUTH = this.URL + 'auth/'
  private GLOSSARY = this.URL + 'glossary/'
  private APP_SETTINGS = this.URL + 'user_app_settings/'
  private NOTE = this.URL + 'note/'
  private CONTACT = this.URL + 'contacts/'

  AUTH_GOOGLE = this.AUTH + 'google/'

  GLOSSARY_LIST = this.GLOSSARY + 'get/'

  GLOSSARY_VERSION = this.GLOSSARY + 'version/'

  APP_SETTINGS_VERSION = this.APP_SETTINGS + 'version/'

  APP_SETTINGS_GET = this.APP_SETTINGS

  APP_SETTINGS_SAVE = this.APP_SETTINGS

  NOTE_GET_VERSION = this.NOTE + 'version'

  NOTE_GET = this.NOTE

  NOTE_SAVE = this.NOTE

  NOTE_ORDER = this.NOTE + 'order/'

  NOTE_DELETE = this.NOTE

  NOTE_DELETE_ALL = this.NOTE + 'all/'

  NOTE_UPDATE_QUESTION = this.NOTE + 'question/'

  NOTE_UPDATE_ANSWER = this.NOTE + 'answer/'

  NOTE_UPDATE_ALL = this.NOTE + 'all/'

  CONTACT_CONTACT_VERSION = this.CONTACT + 'version/'

  CONTACT_GET = this.CONTACT 

  CONTACT_SAVE = this.CONTACT 

  CONTACT_DELETE = this.CONTACT

  CONTACT_SAVE_ALL = this.CONTACT + 'all/'

  CONTACT_EDIT_ALL = this.CONTACT + 'all/'
  
  CONTACT_DELETE_ALL = this.CONTACT + 'all/'

  TEST_CONNECTION = this.URL + 'test_connection/'
}

export default new DinoAPIURLConstants()
