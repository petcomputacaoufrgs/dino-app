import DinoAgentService from "../../agent/DinoAgentService"
import APIRequestMappingConstants from "../../constants/api/APIRequestMappingConstants"
import CreateResponsibleAuthModel from "../../types/user/api/CreateResponsibleAuthModel"
import CreateResponsibleAuthResponseModel from "../../types/user/api/CreateResponsibleAuthResponseModel"
import RecoverPasswordDataModel from "../../types/user/api/RecoverPasswordDataModel"
import AuthService from "./AuthService"
import LogAppErrorService from "../log_app_error/LogAppErrorService"
import AESUtils from "../../utils/AESUtils"
import Cryptr from "cryptr"
import HashUtils from "../../utils/HashUtils"

class ResponsibleAuthService {
	requestCode = async () => {
		const request = await DinoAgentService.put(APIRequestMappingConstants.RECOVER_PASSWORD_REQUEST)

		if (request.canGo) {
			try {
				const authRequest = await request.authenticate()
				await authRequest.go()
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}
	}

  verifyCode = async (code: string): Promise<boolean> => {
		const request = await DinoAgentService.put(APIRequestMappingConstants.RECOVER_PASSWORD_VERIFY)

		if (request.canGo) {
			try {
        const body: RecoverPasswordDataModel = {
          code: code
        }
				const authRequest = await request.authenticate()
				const response = await authRequest.setBody(body).go()
				return response.body
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}

		return false
	}

  changeAuth = async (code: string, newPassword: string): Promise<boolean> => {
		const request = await DinoAgentService.put(APIRequestMappingConstants.RECOVER_PASSWORD_CHANGE)

		if (request.canGo) {
			try {
        const body: RecoverPasswordDataModel = {
          code: code,
          newPassword: newPassword
        }
				const authRequest = await request.authenticate()
				const response = await authRequest.setBody(body).go()
				const responseBody: CreateResponsibleAuthResponseModel = response.body
				if (responseBody.success) {
					const auth = await AuthService.getAuth()
					if (auth) {
						//TODO: Recuperar a senha
						/*
						const newCode = await AESUtils.decrypt(newPassword, responseBody.token)
						if (newCode) {
							auth.responsibleCode = newCode
							auth.responsibleHash = responseBody.token
							auth.responsibleIV = responseBody.iv
							await AuthService.save(auth)
							return true
						}*/
					}
				}
				return false
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}
		return false
	}

	createAuth = async (password: string): Promise<boolean> => {
		const request = await DinoAgentService.post(APIRequestMappingConstants.CREATE_RESPONSIBLE_AUTH)

		if (request.canGo) {
			try {
				const key = HashUtils.sha3of256(password)
        const requestBody: CreateResponsibleAuthModel = {
          key: key
        }
				
				const authRequest = await request.authenticate()
				const response = await authRequest.setBody(requestBody).go()
				const responseBody: CreateResponsibleAuthResponseModel = response.body
				if (responseBody.success) {
					const auth = await AuthService.getAuth()
					if (auth) {
						const code = await AESUtils.decrypt(key, responseBody.iv, responseBody.token)
						if (code) {
							auth.responsibleCode = code
							auth.responsibleToken = responseBody.token
							auth.responsibleIV = responseBody.iv
							await AuthService.save(auth)
							return true
						}
					}
				}
				return false
			} catch (e) {
				console.log(e)
				LogAppErrorService.logError(e)
			}
		}
		return false
	}

	decryptCode = async (password: string): Promise<boolean> => {
		const auth = await AuthService.getAuth()
		if (auth && auth.responsibleToken) {
			const cryptr = new Cryptr(password);
			const code = cryptr.decrypt(auth.responsibleToken);
			auth.responsibleCode = code
			await AuthService.save(auth)

			return true
		}

		return false
	}
}

export default new ResponsibleAuthService()