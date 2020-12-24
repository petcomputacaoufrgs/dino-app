import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import FaqItemEntity from '../../../types/faq/database/FaqItemEntity'
import Database from '../Database'

export class FaqItemRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  FaqItemEntity
> {}

export default new FaqItemRepositoryImpl(Database.faqItem)
