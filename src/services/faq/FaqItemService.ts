import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import FaqItemDataModel from '../../types/faq/api/FaqItemDataModel'
import FaqItemEntity from '../../types/faq/database/FaqItemEntity'
import StringUtils from '../../utils/StringUtils'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketTopicPathService from '../websocket/path/WebSocketTopicPathService'
import Database from '../../storage/Database'
import TreatmentService from '../treatment/TreatmentService'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'

class FaqItemServiceImpl extends AutoSynchronizableService<
	number,
	FaqItemDataModel,
	FaqItemEntity
> {
	constructor() {
		super(
			Database.faqItem,
			APIRequestMappingConstants.FAQ_ITEM,
			WebSocketTopicPathService,
			APIWebSocketDestConstants.FAQ_ITEM,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [TreatmentService]
	}

	async convertModelToEntity(
		model: FaqItemDataModel,
	): Promise<FaqItemEntity | undefined> {
		const treatment = await TreatmentService.getById(model.treatmentId)

		if (treatment) {
			const entity: FaqItemEntity = {
				answer: model.answer,
				localTreatmentId: treatment.localId,
				question: model.question,
			}

			return entity
		}
	}

	async convertEntityToModel(
		entity: FaqItemEntity,
	): Promise<FaqItemDataModel | undefined> {
		if (entity.localTreatmentId) {
			const treatment = await TreatmentService.getByLocalId(entity.localTreatmentId)

			if (treatment && treatment.id) {
				const model: FaqItemDataModel = {
					answer: entity.answer,
					treatmentId: treatment.id,
					question: entity.question,
				}

				return model
			}
		}
	}

	getFaqItemByFilter(
		treatment: TreatmentEntity,
		faqItem: FaqItemEntity[],
		searchTerm: string,
	): FaqItemEntity[] {
		return faqItem.filter(
			item =>
				item.localTreatmentId === treatment.localId &&
				StringUtils.contains(item.question, searchTerm),
		)
	}

	getByTreatment = async (treatment: TreatmentEntity): Promise<FaqItemEntity[]> => {
		if (treatment.localId) {
			return this.table.where('localTreatmentId').equals(treatment.localId).toArray()
		}

		return []
	}
}

export default new FaqItemServiceImpl()
