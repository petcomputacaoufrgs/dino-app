import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import FaqEntity from '../../../types/faq/database/FaqEntity'

export class FaqRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  FaqEntity
> {}

export default new FaqRepositoryImpl(Database.faq)
