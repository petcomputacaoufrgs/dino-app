import FaqUserQuestionDataModel from '../../types/faq/api/FaqUserQuestionDataModel'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import FaqUserQuestionEntity from '../../types/faq/database/FaqUserQuestionEntity'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import FaqService from './FaqService'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueueURLService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'

class FaqUserQuestionServiceImpl extends AutoSynchronizableService<
  number,
  FaqUserQuestionDataModel,
  FaqUserQuestionEntity
> {
  constructor() {
    super(
      Database.faqUserQuestion,
      APIRequestMappingConstants.FAQ_USER_QUESTION,
      WebSocketQueueURLService,
      APIWebSocketDestConstants.FAQ_USER_QUESTION
    )
  }

  getSyncDependencies(): SynchronizableService[] {
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
