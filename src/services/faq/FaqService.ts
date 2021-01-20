import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import FaqDataModel from '../../types/faq/api/FaqDataModel'
import FaqEntity from '../../types/faq/database/FaqEntity'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import FaqItemEntity from '../../types/faq/database/FaqItemEntity'
import FaqView from '../../types/faq/view/FaqView'
import FaqItemService from './FaqItemService'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import TreatmentService from '../treatment/TreatmentService'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketTopicPathService from '../websocket/path/WebSocketTopicPathService'
import Database from '../../storage/Database'

class FaqServiceImpl extends AutoSynchronizableService<
	number,
	FaqDataModel,
	FaqEntity
> {
	constructor() {
		super(
			Database.faq,
			APIRequestMappingConstants.FAQ,
			WebSocketTopicPathService,
			APIWebSocketDestConstants.FAQ,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [TreatmentService]
	}

	async convertModelToEntity(
		model: FaqDataModel,
	): Promise<FaqEntity | undefined> {
		const treatment = await TreatmentService.getById(model.treatmentId)
		if (treatment) {
			const entity: FaqEntity = {
				title: model.title,
				localTreatmentId: treatment.localId,
			}

			return entity
		}
	}

	async convertEntityToModel(
		entity: FaqEntity,
	): Promise<FaqDataModel | undefined> {
		if (entity.localTreatmentId) {
			const treatment = await TreatmentService.getByLocalId(
				entity.localTreatmentId,
			)

			if (treatment && treatment.id) {
				const model: FaqDataModel = {
					title: entity.title,
					treatmentId: treatment.id,
				}

				return model
			}
		}
	}

	getFaqViewByFilter(
		faq: FaqEntity,
		faqItem: FaqItemEntity[],
		searchTerm: string,
	): FaqView | undefined {
		if (faq) {
			const view: FaqView = {
				faq: faq,
				items: FaqItemService.getFaqItemByFilter(faq, faqItem, searchTerm),
			}

			return view
		}

		return undefined
	}

	getCurrentFaq(
		treatment: TreatmentEntity | undefined,
		faqs: FaqEntity[],
	): FaqEntity | undefined {
		if (treatment) {
			const currentFaq = faqs.find(
				faq => faq.localTreatmentId === treatment.localId,
			)
			return currentFaq
		}

		return undefined
	}

	getByTreatment = async (
		treatment: TreatmentEntity,
	): Promise<FaqEntity | undefined> => {
		if (treatment.localId) {
			return this.table
				.where('localTreatmentId')
				.equals(treatment.localId)
				.first()
		}
	}
}

export default new FaqServiceImpl()
