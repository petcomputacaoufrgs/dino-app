/**
 * @description Valores de URL da API para conexão
 */
class Constants {
    private URL: string = 'https://pet-dino-server.herokuapp.com/'
    private PATH_AUTH: string = 'auth/'
    private PATH_GLOSSARY: string = 'glossary/'
    private PATH_APP_SETTINGS: string = 'user_app_settings/'

    PATH_AUTH_GOOGLE: string = this.URL + this.PATH_AUTH + 'google/'

    PATH_GLOSSARY_LIST: string = this.URL + this.PATH_GLOSSARY + 'get/'

    PATH_GLOSSARY_VERSION: string = this.URL + this.PATH_GLOSSARY + 'version/'

    PATH_APP_SETTINGS_VERSION: string = this.URL + this.PATH_APP_SETTINGS + 'version/'

    PATH_APP_SETTINGS_GET: string = this.URL + this.PATH_APP_SETTINGS

    PATH_APP_SETTINGS_SAVE: string = this.URL + this.PATH_APP_SETTINGS

}

export default new Constants()