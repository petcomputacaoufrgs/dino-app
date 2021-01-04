import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import FaqItemEntity from '../../../types/faq/database/FaqItemEntity'
import Database from '../Database'

export class FaqItemRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  FaqItemEntity
> {
  constructor() {
    super(Database.faqItem)
  }
}

export default new FaqItemRepositoryImpl()
