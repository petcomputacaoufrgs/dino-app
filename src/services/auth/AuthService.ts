import Superagent from 'superagent'
import GoogleAuthRequestModel from '../../types/auth/google/api/GoogleAuthRequestModel'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import AuthResponseDataModel from '../../types/auth/api/AuthResponseModel'
import LoginStatusConstants from '../../constants/login/LoginStatusConstants'
import UserService from '../user/UserService'
import DinoAgentService from '../../agent/DinoAgentService'
import EventService from '../events/EventService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import WebSocketAuthResponseModel from '../../types/auth/web_socket/WebSocketAuthResponseModel'
import GoogleOAuth2Service from './google/GoogleOAuth2Service'
import GoogleGrantRequestModel from '../../types/auth/google/api/GoogleGrantRequestModel'
import GrantStatusConstants from '../../constants/login/GrantStatusConstants'
import GoogleScope from '../../types/auth/google/GoogleScope'
import GoogleRefreshAuthResponseModel from '../../types/auth/google/api/GoogleRefreshAuthResponseModel'
import GoogleScopeService from './google/GoogleScopeService'
import GoogleAuthResponseDataModel from '../../types/auth/google/api/GoogleAuthResponseDataModel'
import GoogleAuthResponseModel from '../../types/auth/google/api/GoogleAuthResponseModel'
import GoogleAuthErrorCode from '../../types/auth/google/api/GoogleAuthErrorCode'
import GoogleRefreshAuthResponseDataModel from '../../types/auth/google/api/GoogleRefreshAuthResponseDataModel'
import AuthRefreshRequestModel from '../../types/auth/api/AuthRefreshRequestModel'
import AuthRefreshResponseModel from '../../types/auth/api/AuthRefreshResponseModel'
import DateUtils from '../../utils/DateUtils'
import AuthEntity from '../../types/auth/database/AuthEntity'
import Database from '../../storage/Database'
import UpdatableService from '../update/UpdatableService'
import UserSettingsService from '../user/UserSettingsService'
import LogoutCallback from '../../types/auth/service/LogoutCallback'
import UserEntity from '../../types/user/database/UserEntity'
import DinoPermission from '../../types/auth/api/DinoPermissions'
import ResponsibleAuthService from './ResponsibleAuthService'

class AuthService extends UpdatableService {
	private logoutCallbacks: LogoutCallback[]
	private table: Dexie.Table<AuthEntity, number>

	constructor() {
		super()
		this.logoutCallbacks = []
		this.table = Database.auth
	}

	onLogout = async () => {
		this.dbClear()
	}

	subscribeAuthenticatedService = (callback: LogoutCallback) => {
		this.logoutCallbacks.push(callback)
	}

	requestGoogleLogin = async (
		forceConsent: boolean,
		email?: string,
	): Promise<[number, string | undefined]> => {
		try {
			const code = await GoogleOAuth2Service.requestLogin(forceConsent, email)
			if (code) {
				return this.requestGoogleLoginOnDinoAPI(code)
			}
			return [LoginStatusConstants.EXTERNAL_SERVICE_ERROR, undefined]
		} catch (e) {
			return [LoginStatusConstants.REQUEST_CANCELED, undefined]
		}
	}

	requestGoogleGrant = async (
		scopeList: GoogleScope[],
		refreshTokenNecessary: boolean,
		email: string,
	): Promise<[number, string | undefined]> => {
		try {
			const authCode = await GoogleOAuth2Service.requestGrant(
				scopeList,
				email,
				refreshTokenNecessary,
			)

			if (authCode) {
				return this.requestGoogleGrantOnDinoAPI(authCode, scopeList)
			}

			return [GrantStatusConstants.EXTERNAL_SERVICE_ERROR, undefined]
		} catch (e) {
			LogAppErrorService.logError(e)
			return [GrantStatusConstants.REQUEST_CANCELED, undefined]
		}
	}

	refreshGoogleAuth = async (): Promise<AuthEntity | undefined> => {
		const request = await DinoAgentService.get(
			APIRequestMappingConstants.REFRESH_AUTH_GOOGLE,
		)
		if (request.canGo) {
			try {
				await request.authenticate()
				const response = await request.go()
				const responseBody: GoogleRefreshAuthResponseModel = response.body

				if (responseBody.success) {
					return this.saveGoogleRefreshAuthData(responseBody.data)
				} else {
					await this.logout()
				}
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}
	}

	refreshDinoAuth = async (): Promise<AuthEntity | undefined> => {
		try {
			const auth = await this.getAuth()

			if (auth === undefined || !auth.dinoAccessToken) {
				return
			}

			const model: AuthRefreshRequestModel = {
				refreshToken: auth.dinoRefreshToken,
			}

			const response = await Superagent.put(
				APIRequestMappingConstants.REFRESH_AUTH,
			).send(model)

			const responseBody: AuthRefreshResponseModel = response.body

			if (responseBody.success) {
				const auth = await this.getAuth()
				const expiresDate = DateUtils.convertDinoAPIStringDateToDate(
					responseBody.data.expiresDate,
				)

				if (auth) {
					auth.dinoAccessToken = responseBody.data.accessToken
					auth.dinoExpiresDate = expiresDate
					await this.save(auth)
					return auth
				}
			}

			await this.logout()
		} catch (e) {
			LogAppErrorService.logError(e)
		}
	}

	requestWebSocketAuthToken = async (): Promise<
		WebSocketAuthResponseModel | undefined
	> => {
		const request = await DinoAgentService.get(
			APIRequestMappingConstants.WEB_SOCKET_AUTH,
		)
		if (request.canGo) {
			try {
				await request.authenticate()
				const response = await request.go()
				return response.body
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		} else {
			return undefined
		}
	}

	logout = async () => {
		await this.dbClear()

		const onLogoutCallbacks = this.logoutCallbacks.map(callback => {
			return callback()
		})

		await Promise.all(onLogoutCallbacks)

		this.triggerUpdateEvent()

		EventService.whenLogout()
	}

	isAuthenticated = async (): Promise<boolean> => {
		const entity = await this.getAuth()

		return entity !== undefined
	}

	isAuthenticatedWithGoogle = async (): Promise<boolean> => {
		const auth = await this.getAuth()

		return auth !== undefined && auth.googleToken !== undefined
	}

	getAuth = async (): Promise<AuthEntity | undefined> => {
		const all = await this.table.toArray()

		if (all.length > 0) {
			return all[0]
		}
	}

	getUser = async (): Promise<UserEntity | undefined>=> {
		return UserService.getFirst()
	}

	save = async (entity: AuthEntity) => {
		const id = await this.table.put(entity)

		entity.id = id
	}

	hasPermissions = async (permissions: DinoPermission[]) => {
		if (permissions.length === 0) return true

		const verifyRequests = permissions.map(async permission => {
			switch(permission) {
				case 'responsable':
					return ResponsibleAuthService.isAuthenticated()
				default:
					return false
			}
		})
		
		const hasPermissions = await Promise.all(verifyRequests)

		return hasPermissions.every(hasPermission => hasPermission)
	}

	private dbClear = async () => {
		await this.table.clear()
	}

	private requestGoogleLoginOnDinoAPI = async (
		code: string,
	): Promise<[number, string | undefined]> => {
		const authRequestModel: GoogleAuthRequestModel = {
			code: code,
		}

		try {
			const request = await DinoAgentService.post(
				APIRequestMappingConstants.AUTH_GOOGLE,
			)
			if (request.canGo) {
				const response = await request.setBody(authRequestModel).go()

				const body: GoogleAuthResponseModel = response.body

				if (body.success) {
					await this.saveGoogleAuthData(body.data)
					await this.saveUserSettings(body.data)
					this.triggerUpdateEvent()
					EventService.whenLogin()
					return [LoginStatusConstants.SUCCESS, undefined]
				}

				if (body.errorCode === GoogleAuthErrorCode.REFRESH_TOKEN) {
					return [LoginStatusConstants.REFRESH_TOKEN_NECESSARY, body.error]
				}

				if (body.errorCode === GoogleAuthErrorCode.EXCEPTION) {
					return [LoginStatusConstants.UNKNOW_API_ERROR, undefined]
				}
			}
			return [LoginStatusConstants.DISCONNECTED, undefined]
		} catch (e) {
			LogAppErrorService.logError(e)
			return [LoginStatusConstants.UNKNOW_API_ERROR, undefined]
		}
	}

	private requestGoogleGrantOnDinoAPI = async (
		code: string,
		scopeList: string[],
	): Promise<[number, string | undefined]> => {
		const grantRequestModel: GoogleGrantRequestModel = {
			code: code,
			scopeList: scopeList,
		}

		try {
			const request = await DinoAgentService.post(
				APIRequestMappingConstants.GRANT_GOOGLE,
			)
			if (request.canGo) {
				await request.authenticate()
				const response = await request.setBody(grantRequestModel).go()

				const responseBody: GoogleRefreshAuthResponseModel = response.body

				if (responseBody.success) {
					await this.saveGoogleRefreshAuthData(responseBody.data)
					return [GrantStatusConstants.SUCCESS, undefined]
				}

				if (responseBody.errorCode === GoogleAuthErrorCode.REFRESH_TOKEN) {
					return [
						GrantStatusConstants.REFRESH_TOKEN_NECESSARY,
						responseBody.error,
					]
				}

				if (responseBody.errorCode === GoogleAuthErrorCode.EXCEPTION) {
					return [GrantStatusConstants.UNKNOW_API_ERROR, undefined]
				}

				if (
					responseBody.errorCode ===
					GoogleAuthErrorCode.INVALID_GOOGLE_GRANT_USER
				) {
					return [GrantStatusConstants.INVALID_ACCOUNT, responseBody.error]
				}
			}

			return [GrantStatusConstants.DISCONNECTED, undefined]
		} catch (e) {
			LogAppErrorService.logError(e)
			return [GrantStatusConstants.UNKNOW_API_ERROR, undefined]
		}
	}

	private async saveGoogleRefreshAuthData(
		responseBody: GoogleRefreshAuthResponseDataModel,
	): Promise<AuthEntity | undefined> {
		const auth = await this.getAuth()
		const googleExpiresDate = DateUtils.convertDinoAPIStringDateToDate(
			responseBody.googleExpiresDate,
		)

		if (auth) {
			auth.googleExpiresDate = googleExpiresDate
			auth.googleToken = responseBody.googleAccessToken
			await this.save(auth)
		} else {
			await this.logout()
		}

		if (responseBody.scopes && responseBody.scopes.length > 0) {
			await GoogleScopeService.clearDatabase()
			await GoogleScopeService.saveAllFromDataModelLocally(responseBody.scopes)
		}

		return auth
	}

	private async saveGoogleAuthData(responseBody: GoogleAuthResponseDataModel) {
		await this.dbClear()

		const googleExpiresDate = DateUtils.convertDinoAPIStringDateToDate(
			responseBody.googleExpiresDate,
		)

		const dinoExpiresDate = DateUtils.convertDinoAPIStringDateToDate(
			responseBody.expiresDate,
		)

		const auth: AuthEntity = {
			googleToken: responseBody.googleAccessToken,
			googleExpiresDate: googleExpiresDate,
			dinoAccessToken: responseBody.accessToken,
			dinoExpiresDate: dinoExpiresDate,
			dinoRefreshToken: responseBody.refreshToken
		}

		await this.save(auth)

		if (responseBody.scopes && responseBody.scopes.length > 0) {
			await GoogleScopeService.clearDatabase()
			await GoogleScopeService.saveAllFromDataModelLocally(responseBody.scopes)
		}

		await this.saveUserAuthData(responseBody)
	}

	private async saveUserSettings(responseBody: GoogleAuthResponseDataModel) {
		await UserSettingsService.saveFromDataModelLocally(responseBody.settings)
	}

	private async saveUserAuthData(responseBody: AuthResponseDataModel) {
		await UserService.updateUser(responseBody.user)
	}
}

export default new AuthService()
