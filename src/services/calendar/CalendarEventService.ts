import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import Database from '../../storage/Database'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import CalendarEventDataModel from '../../types/calendar/api/CalendarEventDataModel'
import CalendarEventEntity from '../../types/calendar/database/CalendarEventEntity'

class CalendarEventServiceImpl extends AutoSynchronizableService<
	number,
	CalendarEventDataModel,
	CalendarEventEntity
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
		model: CalendarEventDataModel,
	): Promise<CalendarEventEntity | undefined> {
		const entity: CalendarEventEntity = {
			title: model.title,
			description: model.description,
		}

		return entity
	}

	async convertEntityToModel(
		entity: CalendarEventEntity,
	): Promise<CalendarEventDataModel | undefined> {
		const model: CalendarEventDataModel = {
			title: entity.title,
			description: entity.description,
		}

		return model
	}
}

export default new CalendarEventServiceImpl()
