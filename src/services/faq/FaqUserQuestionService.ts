import FaqUserQuestionDataModel from '../../types/faq/api/FaqUserQuestionDataModel'
import SynchronizableService from '../synchronizable/SynchronizableService'
import FaqUserQuestionEntity from '../../types/faq/database/FaqUserQuestionEntity'
import FaqUserQuestionRepository, {
  FaqUserQuestionRepositoryImpl,
} from '../../storage/database/faq/FaqUserQuestionRepository'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import FaqService from './FaqService'

export class FaqUserQuestionServiceImpl extends SynchronizableService<
  number,
  number,
  FaqUserQuestionDataModel,
  FaqUserQuestionEntity,
  FaqUserQuestionRepositoryImpl
> {
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

export default new FaqUserQuestionServiceImpl(
  FaqUserQuestionRepository,
  APIRequestMappingConstants.FAQ_USER_QUESTION,
  APIWebSocketDestConstants.FAQ_USER_QUESTION_UPDATE,
  APIWebSocketDestConstants.FAQ_USER_QUESTION_DELETE
)
