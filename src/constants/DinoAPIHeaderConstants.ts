/**
 * @description Valores chaves de Header utilizados pelo DinoAPI
 */
class DinoAPIHeaderConstants {
    /**
     * @description Header para passar a autenticação, não esqueça de passar 'Bearer ' antes do valor do token
     */
    AUTHORIZATION: string = 'Authorization'

    /**
     * @description Header passado pela API para retornar um novo token atualizado quando necessário, não esquece de retirar o 'Bearer ' do inicio
     */
    REFRESH_TOKEN: string = 'Refresh'
}

export default new DinoAPIHeaderConstants()