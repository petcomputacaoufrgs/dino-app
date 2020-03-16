/**
 * @description Valores de URL da API para conexão
 */
class DinoApiConstants {
    private URL = 'http://localhost:8080/'
    private PATH_AUTH = 'auth/'

    /**
     * @description URL para autenticação com o Google na API
     */
    PATH_AUTH_GOOGLE = this.URL + this.PATH_AUTH + 'google/'
}

export default new DinoApiConstants()