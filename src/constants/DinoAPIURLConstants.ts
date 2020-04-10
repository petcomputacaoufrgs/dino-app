/**
 * @description Valores de URL da API para conexão
 */
class DinoAPIURLConstants {
    private URL: string = 'https://pet-dino-server.herokuapp.com/'
    private PATH_AUTH: string = 'auth/'

    /**
     * @description URL para autenticação com o Google na API
     */
    PATH_AUTH_GOOGLE: string = this.URL + this.PATH_AUTH + 'google/'
}

export default new DinoAPIURLConstants()