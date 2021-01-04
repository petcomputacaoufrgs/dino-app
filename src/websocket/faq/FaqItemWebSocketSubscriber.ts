import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'
import FaqItemDataModel from '../../types/faq/api/FaqItemDataModel'
import FaqItemEntity from '../../types/faq/database/FaqItemEntity'
import { FaqItemRepositoryImpl } from '../../storage/database/faq/FaqItemRepository'
import FaqItemService from '../../services/faq/FaqItemService'

class FaqItemWebSocketSubscriber extends SynchronizableWSSubscriber<
  number,
  FaqItemDataModel,
  FaqItemEntity,
  FaqItemRepositoryImpl
> {
  constructor() {
    super(FaqItemService)
  }
}

export default new FaqItemWebSocketSubscriber()
