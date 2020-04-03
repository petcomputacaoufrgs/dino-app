/**
 * @description Modela os dados que devem ser enviados para requerir login na API
 */
class AuthRequestModel {
    token: string

    constructor(token: string) {
        this.token = token
    }
}

export default AuthRequestModel