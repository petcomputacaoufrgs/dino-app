/**
 * @description MOdela o retorna da API para autenticação
 */
class AuthResponseModel {
    accessToken: string

    constructor(accessToken: string) {
        this.accessToken = accessToken
    }
}

export default AuthResponseModel