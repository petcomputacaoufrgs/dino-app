/**
 * @description Valores chaves de Header utilizados pelo DinoAPI
 */
class DinoAPIHeaderConstants {
  /**
   * @description Header para passar a autenticação, não esqueça de passar 'Bearer ' antes do valor do token
   */
  AUTHORIZATION: string = 'Authorization'

  /**
   * @description Header passado pela API para retornar um novo token atualizado quando necessário
   */
  REFRESH_TOKEN: string = 'Refresh'

  /**
   * @description Header passado pela API para retornar novo token do Google atualizado
   */
  GOOGLE_REFRESH_TOKEN: string = 'Google Refresh'
}

export default new DinoAPIHeaderConstants()
