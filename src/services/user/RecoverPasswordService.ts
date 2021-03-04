import DinoAgentService from "../../agent/DinoAgentService"
import APIRequestMappingConstants from "../../constants/api/APIRequestMappingConstants"
import RecoverPasswordDataModel from "../../types/user/api/RecoverPasswordDataModel"
import UserSettingsDataModel from "../../types/user/api/UserSettingsDataModel"
import DateUtils from "../../utils/DateUtils"
import LogAppErrorService from "../log_app_error/LogAppErrorService"
import UserSettingsService from "./UserSettingsService"

class RecoverPasswordService {
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

  changePassword = async (code: string, newPassword: string): Promise<boolean> => {
		const request = await DinoAgentService.put(APIRequestMappingConstants.RECOVER_PASSWORD_CHANGE)

		if (request.canGo) {
			try {
        const body: RecoverPasswordDataModel = {
          code: code,
          newPassword: newPassword
        }
				const authRequest = await request.authenticate()
				const response = await authRequest.setBody(body).go()
				if (response.body.success) {
					const settingsDataModel: UserSettingsDataModel = response.body.data
					if (settingsDataModel && settingsDataModel.id !== undefined) {
						const userSettings = await UserSettingsService.getById(settingsDataModel.id)
						if (userSettings) {
							userSettings.parentsAreaPassword = settingsDataModel.parentsAreaPassword
							if (settingsDataModel.lastUpdate) {
								userSettings.lastUpdate = DateUtils.convertDinoAPIStringDateToDate(settingsDataModel.lastUpdate);
							}
							UserSettingsService.saveOnlyLocally(userSettings)
							return true
						}
					}
				}
				return false
			} catch (e) {
				LogAppErrorService.logError(e)
			}
		}
		return false
	}

}

export default new RecoverPasswordService()