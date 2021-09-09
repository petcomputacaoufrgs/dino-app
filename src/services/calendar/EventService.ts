import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import Database from '../../storage/Database'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import EventDataModel from '../../types/calendar/api/EventDataModel'
import EventEntity from '../../types/calendar/database/EventEntity'
import { hasValue } from '../../utils/Utils'
import CalendarEventTypeService from './EventTypeService'
import DateUtils from '../../utils/DateUtils'

class EventServiceImpl extends AutoSynchronizableService<
	number,
	EventDataModel,
	EventEntity
> {
	constructor() {
		super(
			Database.event,
			APIHTTPPathsConstants.EVENT,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.EVENT,
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
			description: model.description,
			date: DateUtils.convertDinoAPIStringDateToDate(model.date),
			endTime: model.endTime,
			repeat: model.repeat,
			alert: model.alert,
		}

		if (hasValue(model.typeId)) {
			const typeEvent = await CalendarEventTypeService.getById(model.typeId!)
			if (typeEvent) entity.typeLocalId = typeEvent.localId
		}

		return entity
	}

	async convertEntityToModel(
		entity: EventEntity,
	): Promise<EventDataModel | undefined> {
		const model: EventDataModel = {
			title: entity.title,
			description: entity.description,
			date: DateUtils.convertDateToDinoAPIStringDate(entity.date),
			endTime: entity.endTime,
			repeat: entity.repeat,
			alert: entity.alert,
		}

		if (hasValue(entity.typeLocalId)) {
			const typeEvent = await CalendarEventTypeService.getByLocalId(
				entity.typeLocalId!,
			)
			if (typeEvent) model.typeId = typeEvent.id
		}

		return model
	}
}

export default new EventServiceImpl()
