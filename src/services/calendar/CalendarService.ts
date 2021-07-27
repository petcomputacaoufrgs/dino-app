import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import Database from '../../storage/Database'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import EventDataModel from '../../types/calendar/api/EventDataModel'
import EventEntity from '../../types/calendar/database/EventEntity'

class CalendarServiceImpl extends AutoSynchronizableService<
	number,
	EventDataModel,
	EventEntity
> {
	constructor() {
		super(
			Database.calendarEvent,
			APIHTTPPathsConstants.CALENDAR_EVENT,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.CALENDAR_EVENT,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return []
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return []
	}

	async convertModelToEntity(
		model: EventDataModel,
	): Promise<EventEntity | undefined> {

		const entity: EventEntity = {
			title: model.title,
			description: model.description
		}

		return entity
	}

	async convertEntityToModel(
		entity: EventEntity,
	): Promise<EventDataModel | undefined> {

		const model: EventDataModel = {
			title: entity.title,
			description: entity.description
		}

		return model
	}
}

export default new CalendarServiceImpl()