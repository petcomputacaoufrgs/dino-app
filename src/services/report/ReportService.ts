import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import Database from '../../storage/Database'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import ReportDataModel from '../../types/report/api/ReportDataModel'
import ReportEntity from '../../types/report/database/ReportEntity'
import UserService from '../user/UserService'
import UserEntity from '../../types/user/database/UserEntity'

class ReportServiceImpl extends AutoSynchronizableService<
	number,
	ReportDataModel,
	ReportEntity
> {
	constructor() {
		super(
			Database.report,
			APIHTTPPathsConstants.REPORT,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.REPORT,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [UserService]
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return []
	}

	async convertModelToEntity(
		model: ReportDataModel,
	): Promise<ReportEntity | undefined> {
		const entity: ReportEntity = {
			what: model.what,
			how: model.how,
			where: model.where,
		}

		return entity
	}

	async convertEntityToModel(
		entity: ReportEntity,
	): Promise<ReportDataModel | undefined> {
		const model: ReportDataModel = {
			what: entity.what,
			how: entity.how,
			where: entity.where,
		}

		return model
	}
}

export default new ReportServiceImpl()
