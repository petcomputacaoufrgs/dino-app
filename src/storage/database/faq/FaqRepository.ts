import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import FaqEntity from '../../../types/faq/database/FaqEntity'

export class FaqRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  FaqEntity
> {
  constructor() {
    super(Database.faq)
  }
}

export default new FaqRepositoryImpl()
