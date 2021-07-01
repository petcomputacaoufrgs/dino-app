import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import FaqItemDataModel from '../../types/faq/api/FaqItemDataModel'
import FaqItemEntity from '../../types/faq/database/FaqItemEntity'
import StringUtils from '../../utils/StringUtils'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import TreatmentService from '../treatment/TreatmentService'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import { hasValue } from '../../utils/Utils'

class FaqItemServiceImpl extends AutoSynchronizableService<
	number,
	FaqItemDataModel,
	FaqItemEntity
> {
	constructor() {
		super(
			Database.faqItem,
			APIHTTPPathsConstants.FAQ_ITEM,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.FAQ_ITEM,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [TreatmentService]
	}

	getSyncNecessaryPermissions(): PermissionEnum[] {
		return []
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
		if (hasValue(entity.localTreatmentId)) {
			const treatment = await TreatmentService.getByLocalId(entity.localTreatmentId!)

			if (treatment && hasValue(treatment.id)) {
				const model: FaqItemDataModel = {
					answer: entity.answer,
					treatmentId: treatment.id!,
					question: entity.question,
				}

				return model
			}
		}
	}

	getFaqItemByFilter(
		treatment: TreatmentEntity,
		searchTerm: string,
		faqItems?: FaqItemEntity[],
	): FaqItemEntity[] {
		if(faqItems) {
			return faqItems.filter(
				item =>
					item.localTreatmentId === treatment.localId &&
					StringUtils.contains(item.question, searchTerm),
			)
		}
		return []
	}

	getByTreatment = async (treatment: TreatmentEntity): Promise<FaqItemEntity[]> => {
		if (treatment.localId) {
			return this.toList(this.table.where('localTreatmentId').equals(treatment.localId))
		}

		return []
	}
}

export default new FaqItemServiceImpl()
