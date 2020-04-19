/**
 * @description Tipos de erros retornados no serviço de login
 */
class LoginErrorTypes {

    SUCCESS = -1

    EXTERNAL_SERVICE_ERROR = 0

    UNKNOW_API_ERROR = 1

    REFRESH_TOKEN_LOST_ERROR = 2
}

export default new LoginErrorTypes()