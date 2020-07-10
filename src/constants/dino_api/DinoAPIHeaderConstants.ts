/**
 * @description Valores chaves de Header utilizados pelo DinoAPI
 */
class DinoAPIHeaderConstants {
  /**
   * @description Header para passar o token de autenticação
   */
  AUTHORIZATION: string = 'dino_an'

  /**
   * @description Header passado pela API para retornar um novo token atualizado quando necessário
   */
  REFRESH_TOKEN: string = 'refresh'

  /**
   * @description Header passado pela API para retornar novo token do Google atualizado
   */
  GOOGLE_REFRESH_TOKEN: string = 'google_refresh'
}

export default new DinoAPIHeaderConstants()
