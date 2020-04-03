/**
 * @description Configuração de paths
 */
class PathConstants {
    /**
     * @description Diretório de login
     */
    LOGIN: string = '/'

    /**
     * @description Diretório do app principal
     */
    APP: string = '/app'

    /**
     * @description Diretório home para usuários autenticados
     */
    HOME: string = this.APP + '/home'

    /**
     * @description Diretório do glossário
     */
    GLOSSARY: string = this.APP + '/glossary'

    /**
     * @description Diretório dos jogos
     */
    GAMES: string = this.APP + '/games'
}

export default new PathConstants()