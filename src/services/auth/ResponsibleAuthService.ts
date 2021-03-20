import DinoAgentService from "../../agent/DinoAgentService"
import APIRequestMappingConstants from "../../constants/api/APIRequestMappingConstants"
import AuthService from "./AuthService"
import LogAppErrorService from "../log_app_error/LogAppErrorService"
import AESUtils from "../../utils/AESUtils"
import HashUtils from "../../utils/HashUtils"
import AgentRequest from "../../types/agent/AgentRequest"
import SetResponsibleAuthModel from "../../types/auth/api/responsible/SetResponsibleAuthModel"
import VerifyResponsibleRecoverCodeModel from "../../types/auth/api/responsible/VerifyResponsibleRecoverCodeModel"
import ResponsibleRecoverPasswordModel from "../../types/auth/api/responsible/ResponsibleRecoverPasswordModel"
import SetResponsibleAuthResponseModel from "../../types/auth/api/responsible/SetResponsibleAuthResponseModel"
import ResponsibleRequestRecoverResponseModel from "../../types/auth/api/responsible/ResponsibleRequestRecoverResponseModel"
import ResponsibleVerityRecoverCodeResponseModel from "../../types/auth/api/responsible/ResponsibleVerityRecoverCodeResponseModel"
import UserService from "../user/UserService"
import LocalStorage from "../../storage/LocalStorage"
import LocalStorageKeysConstants from "../../constants/local_storage/LocalStorageKeysConstants"
import DinoPermission from "../../types/auth/api/DinoPermissions"

class ResponsibleAuthService {
	isAuthenticated = async () => {
		const user = await AuthService.getUser()

		return Boolean(user && user.responsibleCode)
	}

	isKidsMode = (): boolean => {
		const value = LocalStorage.getItem(LocalStorageKeysConstants.KIDS_MODE)
		if (value) {
			return JSON.parse(value)
		}

		return false
	}

	getCode = async (): Promise<string | undefined> => {
		const user = await AuthService.getUser()

		if (!user || !user.responsibleCode) return undefined

		return user.responsibleCode
	}

	requestCode = async () => {
		const request = await DinoAgentService.put(APIRequestMappingConstants.RECOVER_PASSWORD_REQUEST)

		if (request.canGo) {
			try {
				await request.authenticate()
				const response = await request.go()
				const responseBody: ResponsibleRequestRecoverResponseModel = response.body
				return responseBody.success
			} catch (e) {
				LogAppErrorService.logError(e)
			}
			return false
		}
	}

  verifyCode = async (code: string): Promise<ResponsibleVerityRecoverCodeResponseModel | null> => {
		const request = await DinoAgentService.put(APIRequestMappingConstants.RECOVER_PASSWORD_VERIFY)

		if (request.canGo) {
			try {
        const body: VerifyResponsibleRecoverCodeModel = {
          code: code
        }
				await request.authenticate()
				const response = await request.setBody(body).go()

				return response.body
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}

		return null
	}

  recoverAuth = async (code: string, newPassword: string): Promise<boolean> => {
		const request = await DinoAgentService.put(APIRequestMappingConstants.RECOVER_PASSWORD_CHANGE)

		if (request.canGo) {
			return this.setAuth(request, newPassword, code)
		}

		return false
	}

	changeAuth = async (newPassword: string) => {
		const request = await DinoAgentService.post(APIRequestMappingConstants.CHANGE_RESPONSIBLE_AUTH)
		request.addPermission(DinoPermission.RESPONSIBLE)

		if (request.canGo) {
			if (request.hasPermissions) {
				return this.setAuth(request, newPassword)
			}
		}

		return false
	}

	createAuth = async (password: string): Promise<boolean> => {
		const request = await DinoAgentService.post(APIRequestMappingConstants.CREATE_RESPONSIBLE_AUTH)

		if (request.canGo) {
			return this.setAuth(request, password)
		}

		return false
	}

	verifyPassword = async (password: string) => {
		const user = await AuthService.getUser()

		if (user && user.responsibleIV && user.responsibleToken) {
			const key = HashUtils.sha3of256(password)

			const code = await AESUtils.decrypt(key, user.responsibleIV, user.responsibleToken)

			return Boolean(code)
		}

		return false
	}

	responsibleLogin = async (password: string) => {
		const user = await AuthService.getUser()

		if (user && user.responsibleIV && user.responsibleToken) {
			const key = HashUtils.sha3of256(password)

			const code = await AESUtils.decrypt(key, user.responsibleIV, user.responsibleToken)

			if (code) {
				user.responsibleCode = code

				await UserService.saveOnlyLocally(user)
				
				LocalStorage.setItem(LocalStorageKeysConstants.KIDS_MODE, JSON.stringify(false))

				return true
			}
		}

		return false
	}

	responsibleLogout = async () => {
		const user = await AuthService.getUser()

		if (user) {
			user.responsibleCode = undefined
			await UserService.saveOnlyLocally(user)
		}
	}

	activeChildMode = async () => {
		LocalStorage.setItem(LocalStorageKeysConstants.KIDS_MODE, JSON.stringify(true))
		await this.responsibleLogout()
	}

	private setAuth = async (request: AgentRequest<DinoPermission>, password: string, code?: string): Promise<boolean> => {
		try {
			const key = HashUtils.sha3of256(password).substr(0, 32)
			const requestBody: ResponsibleRecoverPasswordModel | SetResponsibleAuthModel = code ? {
				key: key,
				code: code
			} : { key: key }
			await request.authenticate()
			const response = await request.setBody(requestBody).go()
			const responseBody: SetResponsibleAuthResponseModel = response.body
			if (responseBody.success) {
				const user = await AuthService.getUser()
				if (user) {
					const code = await AESUtils.decrypt(key, responseBody.iv, responseBody.token)
					if (code) {
						user.responsibleCode = code
						user.responsibleToken = responseBody.token
						user.responsibleIV = responseBody.iv
						await UserService.saveOnlyLocally(user)
						return true
					}
				}
			}
			return false
		} catch (e) {
			LogAppErrorService.logError(e)
		}

		return false
	}
}

export default new ResponsibleAuthService()