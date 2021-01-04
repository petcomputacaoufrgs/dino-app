import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'
import FaqDataModel from '../../types/faq/api/FaqDataModel'
import FaqEntity from '../../types/faq/database/FaqEntity'
import { FaqRepositoryImpl } from '../../storage/database/faq/FaqRepository'
import FaqService from '../../services/faq/FaqService'

class FaqWebSocketSubscriber extends SynchronizableWSSubscriber<
  number,
  FaqDataModel,
  FaqEntity,
  FaqRepositoryImpl
> {
  constructor() {
    super(FaqService)
  }
}

export default new FaqWebSocketSubscriber()
