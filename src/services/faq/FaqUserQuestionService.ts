import FaqUserQuestionDataModel from '../../types/faq/api/FaqUserQuestionDataModel'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import FaqUserQuestionEntity from '../../types/faq/database/FaqUserQuestionEntity'
import FaqUserQuestionRepository, {
  FaqUserQuestionRepositoryImpl,
} from '../../storage/database/faq/FaqUserQuestionRepository'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import FaqService from './FaqService'
import SynchronizableService from '../sync/SynchronizableService'

export class FaqUserQuestionServiceImpl extends AutoSynchronizableService<
  number,
  FaqUserQuestionDataModel,
  FaqUserQuestionEntity,
  FaqUserQuestionRepositoryImpl
> {
  constructor() {
    super(
      FaqUserQuestionRepository,
      APIRequestMappingConstants.FAQ_USER_QUESTION,
      APIWebSocketDestConstants.FAQ_USER_QUESTION_UPDATE,
      APIWebSocketDestConstants.FAQ_USER_QUESTION_DELETE
    )
  }

  getDependencies(): SynchronizableService[] {
    return [FaqService]
  }

  async convertModelToEntity(
    model: FaqUserQuestionDataModel
  ): Promise<FaqUserQuestionEntity | undefined> {
    const faq = await FaqService.getById(model.faqId)

    if (faq) {
      const entity: FaqUserQuestionEntity = {
        localFaqId: faq.localId,
        question: model.question,
      }

      return entity
    }
  }

  async convertEntityToModel(
    entity: FaqUserQuestionEntity
  ): Promise<FaqUserQuestionDataModel | undefined> {
    if (entity.localFaqId) {
      const faq = await FaqService.getByLocalId(entity.localFaqId)

      if (faq && faq.id) {
        const model: FaqUserQuestionDataModel = {
          faqId: faq.id,
          question: entity.question,
        }

        return model
      }
    }
  }
}

export default new FaqUserQuestionServiceImpl()
