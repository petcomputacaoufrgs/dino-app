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
   * @description Diretório dos contatos de emergência
   */
  CONTACTS: string = this.APP + '/contacts'

  /**
   * @description Diretório dos jogos
   */
  GAMES: string = this.APP + '/games'

  /**
   * @description Diretório das configurações
   */
  SETTINGS: string = this.APP + '/settings'

  /**
   * @description Diretório das notas do usuário
   */
  NOTES: string = this.APP + '/notes'
}

export default new PathConstants()
