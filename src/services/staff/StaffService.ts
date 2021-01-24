import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketTopicPathService from '../websocket/path/WebSocketTopicPathService'
import Database from '../../storage/Database'
import UserService from '../user/UserService'
import StaffDataModel from '../../types/staff/api/StaffDataModel'
import StaffEntity from '../../types/staff/database/StaffEntity'
import DateUtils from '../../utils/DateUtils'

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
			APIWebSocketDestConstants.STAFF,
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

}

export default new StaffServiceImpl()
