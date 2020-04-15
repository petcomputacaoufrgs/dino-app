/**
 * @description Modela o retorna da API para autenticação
 */
class AuthResponseModel {
    accessToken: string
    googleAccessToken: string
    name: string
    email: string
    pictureUrl: string

    constructor(accessToken: string, googleAccessToken: string, 
        name: string, email: string, pictureUrl: string) {
        this.accessToken = accessToken
        this.googleAccessToken = googleAccessToken
        this.name = name
        this.email = email
        this.pictureUrl = pictureUrl
    }
}

export default AuthResponseModel