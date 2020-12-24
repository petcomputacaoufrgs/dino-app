import SynchronizableSync from '../synchronizable/SynchronizableSync'
import FaqItemService from '../../services/faq/FaqItemService'
import FaqItemEntity from '../../types/faq/database/FaqItemEntity'
import { FaqItemRepositoryImpl } from '../../storage/database/faq/FaqItemRepository'
import FaqItemDataModel from '../../types/faq/api/FaqItemDataModel'

class FaqItemSync extends SynchronizableSync<
  number,
  number,
  FaqItemDataModel,
  FaqItemEntity,
  FaqItemRepositoryImpl
> {}

export default new FaqItemSync(FaqItemService)
