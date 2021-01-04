import SynchronizableSync from '../synchronizable/SynchronizableSync'
import FaqDataModel from '../../types/faq/api/FaqDataModel'
import FaqEntity from '../../types/faq/database/FaqEntity'
import { FaqRepositoryImpl } from '../../storage/database/faq/FaqRepository'
import FaqService from '../../services/faq/FaqService'

class FaqSync extends SynchronizableSync<
  number,
  number,
  FaqDataModel,
  FaqEntity,
  FaqRepositoryImpl
> {
  constructor() {
    super(FaqService)
  }
}

export default new FaqSync()
