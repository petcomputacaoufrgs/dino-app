import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIRequestMappingConstants from '../../constants/api/APIHTTPPathsConstants'
import APIMainPathsConstants from '../../constants/api/APIMainPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketTopicPathService from '../websocket/path/WebSocketTopicPathService'
import Database from '../../storage/Database'
import UserService from '../user/UserService'
import StaffDataModel from '../../types/staff/api/StaffDataModel'
import StaffEntity from '../../types/staff/database/StaffEntity'
import DateUtils from '../../utils/DateUtils'
import StringUtils from '../../utils/StringUtils'
import LanguageBase from '../../constants/languages/LanguageBase'

class StaffServiceImpl extends AutoSynchronizableService<
	number,
	StaffDataModel,
	StaffEntity
> {
	constructor() {
		super(
			Database.staff,
			APIRequestMappingConstants.STAFF,
			WebSocketTopicPathService,
			APIMainPathsConstants.STAFF,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [UserService]
	}

	async convertModelToEntity(
		model: StaffDataModel,
	): Promise<StaffEntity | undefined> {

    const entity: StaffEntity = {
      email: model.email,
      sentInvitationDate: DateUtils.convertDinoAPIStringDateToDate(
				model.sentInvitationDate,
			)
		}
		
		if(model.userId) {
			const user = await UserService.getById(model.userId)
			if (user) {
				entity.userId = user.id
			}
		}
    
    return entity
	}

	async convertEntityToModel(
		entity: StaffEntity,
	): Promise<StaffDataModel | undefined> {
    const model: StaffDataModel = {
      email: entity.email,
      sentInvitationDate: DateUtils.convertDateToDinoAPIStringDate(
				entity.sentInvitationDate,
			),
    }

		if(entity.userId) {
			const user = await UserService.getById(entity.userId)
			if (user) {
				entity.userId = user.id
			}
		}
    
    return model
	}

	getByEmail = async (email: string): Promise<StaffEntity | undefined> => {
			return this.table.where('email').equalsIgnoreCase(email).first()
	}

	isEmailInvalid = async (email: string, languageData: LanguageBase) => {

    const isInvalid = !StringUtils.validateEmail(email)
    if(isInvalid) {
      return languageData.INVALID_VALUE
    }

    const alreadyExists = await this.getByEmail(email)

    if(alreadyExists) {
      return languageData.itemAlreadyExists(languageData.EMAIL)
    }

		return undefined
	}
}

export default new StaffServiceImpl()
