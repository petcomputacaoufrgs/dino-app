import SynchronizableService from '../synchronizable/SynchronizableService'
import FaqItemRepository, {
  FaqItemRepositoryImpl,
} from '../../storage/database/faq/FaqItemRepository'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import FaqItemDataModel from '../../types/faq/api/FaqItemDataModel'
import FaqItemEntity from '../../types/faq/database/FaqItemEntity'
import StringUtils from '../../utils/StringUtils'
import FaqEntity from '../../types/faq/database/FaqEntity'
import FaqService from './FaqService'

export class FaqItemServiceImpl extends SynchronizableService<
  number,
  number,
  FaqItemDataModel,
  FaqItemEntity,
  FaqItemRepositoryImpl
> {
  async convertModelToEntity(
    model: FaqItemDataModel
  ): Promise<FaqItemEntity | undefined> {
    const faq = await FaqService.getById(model.faqId)

    if (faq) {
      const entity: FaqItemEntity = {
        answer: model.answer,
        localFaqId: faq.localId,
        question: model.question,
      }

      return entity
    }
  }

  async convertEntityToModel(
    entity: FaqItemEntity
  ): Promise<FaqItemDataModel | undefined> {
    if (entity.localFaqId) {
      const faq = await FaqService.getByLocalId(entity.localFaqId)

      if (faq && faq.id) {
        const model: FaqItemDataModel = {
          answer: entity.answer,
          faqId: faq.id,
          question: entity.question,
        }

        return model
      }
    }
  }

  public getFaqItemByFilter(
    faq: FaqEntity,
    faqItem: FaqItemEntity[],
    searchTerm: string
  ): FaqItemEntity[] {
    return faqItem.filter(
      (item) =>
        item.localFaqId === faq.id &&
        StringUtils.contains(item.question, searchTerm)
    )
  }
}

export default new FaqItemServiceImpl(
  FaqItemRepository,
  APIRequestMappingConstants.FAQ_ITEM,
  APIWebSocketDestConstants.FAQ_ITEM_UPDATE,
  APIWebSocketDestConstants.FAQ_ITEM_DELETE
)
