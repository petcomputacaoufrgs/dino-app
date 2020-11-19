/**
 * @description Tipos de erros retornados no serviço de login
 */
class LoginStatusConstants {
  SUCCESS = -1

  EXTERNAL_SERVICE_ERROR = 0

  UNKNOW_API_ERROR = 1

  REFRESH_TOKEN_REFRESH_NECESSARY = 2

  DISCONNECTED = 3
}

export default new LoginStatusConstants()
