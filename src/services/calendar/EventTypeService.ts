import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import Database from '../../storage/Database'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import CalendarEventTypeDataModel from '../../types/calendar/api/EventTypeDataModel'
import EventTypeEntity from '../../types/calendar/database/EventTypeEntity'

class EventServiceImpl extends AutoSynchronizableService<
	number,
	CalendarEventTypeDataModel,
	EventTypeEntity
> {
	constructor() {
		super(
			Database.eventType,
			APIHTTPPathsConstants.EVENT_TYPE,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.EVENT_TYPE,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return []
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return []
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return []
	}

	async convertModelToEntity(
		model: CalendarEventTypeDataModel,
	): Promise<EventTypeEntity | undefined> {
		const entity: EventTypeEntity = {
			title: model.title,
			color: model.color,
			icon: model.icon,
		}

		return entity
	}

	async convertEntityToModel(
		entity: EventTypeEntity,
	): Promise<CalendarEventTypeDataModel | undefined> {
		const model: CalendarEventTypeDataModel = {
			title: entity.title,
			color: entity.color,
			icon: entity.icon,
		}

		return model
	}
}

export default new EventServiceImpl()
