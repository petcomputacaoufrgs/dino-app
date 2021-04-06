import TreatmentQuestionDataModel from '../../types/faq/api/TreatmentQuestionDataModel'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import TreatmentQuestionEntity from '../../types/faq/database/TreatmentQuestionEntity'
import APIRequestMappingConstants from '../../constants/api/APIHTTPPathsConstants'
import APIPathsConstants from '../../constants/api/APIPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import Database from '../../storage/Database'
import TreatmentService from '../treatment/TreatmentService'
import WebSocketTopicPathService from '../websocket/path/WebSocketTopicPathService'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import AuthEnum from '../../types/enum/AuthEnum'

class TreatmentQuestionServiceImpl extends AutoSynchronizableService<
	number,
	TreatmentQuestionDataModel,
	TreatmentQuestionEntity
> {
	constructor() {
		super(
			Database.treatmentQuestion,
			APIRequestMappingConstants.TREATMENT_QUESTION,
			WebSocketTopicPathService,
			APIPathsConstants.TREATMENT_QUESTION,
		)
	}

	getSyncNecessaryAuthorities(): AuthEnum[] {
		return [AuthEnum.USER, AuthEnum.STAFF, AuthEnum.ADMIN]
	}

	getSyncDependencies(): SynchronizableService[] {
		return [TreatmentService]
	}

	async convertModelToEntity(
		model: TreatmentQuestionDataModel,
	): Promise<TreatmentQuestionEntity | undefined> {
		const treatment = await TreatmentService.getById(model.treatmentId)

		if (treatment) {
			const entity: TreatmentQuestionEntity = {
				localTreatmentId: treatment.localId,
				question: model.question,
			}

			return entity
		}
	}

	async convertEntityToModel(
		entity: TreatmentQuestionEntity,
	): Promise<TreatmentQuestionDataModel | undefined> {
		if (entity.localTreatmentId) {
			const treatment = await TreatmentService.getByLocalId(entity.localTreatmentId)

			if (treatment && treatment.id) {
				const model: TreatmentQuestionDataModel = {
					treatmentId: treatment.id,
					question: entity.question,
				}

				return model
			}
		}
	}

	getByTreatment = async (treatment: TreatmentEntity): Promise<TreatmentQuestionEntity[]> => {
		if (treatment.localId) {
			return this.table.where('localTreatmentId').equals(treatment.localId).toArray()
		}
		return []
	}
}

export default new TreatmentQuestionServiceImpl()
