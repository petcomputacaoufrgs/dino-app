import APIRequestMappingConstants from '../../constants/api/APIHTTPPathsConstants'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIPathsConstants from '../../constants/api/APIPathsConstants'
import TreatmentDataModel from '../../types/treatment/api/TreatmentDataModel'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketTopicPathService from '../websocket/path/WebSocketTopicPathService'
import Database from '../../storage/Database'
import FaqView from '../../types/faq/view/FaqView'
import FaqItemService from '../faq/FaqItemService'
import PermissionEnum from '../../types/enum/AuthEnum'

class TreatmentServiceImpl extends AutoSynchronizableService<
	number,
	TreatmentDataModel,
	TreatmentEntity
> {
	constructor() {
		super(
			Database.treatment,
			APIRequestMappingConstants.TREATMENT,
			WebSocketTopicPathService,
			APIPathsConstants.TREATMENT,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return []
	}

	getSyncNecessaryPermissions(): PermissionEnum[] {
		return []
	}

	async convertModelToEntity(
		model: TreatmentDataModel,
	): Promise<TreatmentEntity> {
		const entity: TreatmentEntity = {
			name: model.name,
		}

		return entity
	}

	async convertEntityToModel(
		entity: TreatmentEntity,
	): Promise<TreatmentDataModel> {
		const model: TreatmentDataModel = {
			name: entity.name,
		}

		return model
	}

	getAllByIds = (ids: number[]): Promise<TreatmentEntity[]> => {
		return this.table.where('id').anyOf(ids).toArray()
	}

	getAllByLocalIds = (localIds: number[]): Promise<TreatmentEntity[]> => {
		return this.table.where('localId').anyOf(localIds).toArray()
	}

	getFaqViewByFilter(
		view: FaqView,
		searchTerm: string,
	): FaqView {
			const newView = {
				...view,
				faqItems: FaqItemService.getFaqItemByFilter(view.treatment, searchTerm, view.faqItems),
			}

			return newView as FaqView
	}

	getByName = (name: string): Promise<TreatmentEntity | undefined> => {
		return this.table.where('name').equalsIgnoreCase(name).first()
	}
}

export default new TreatmentServiceImpl()
