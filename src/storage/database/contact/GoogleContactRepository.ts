import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import GoogleContactEntity from '../../../types/contact/database/GoogleContactEntity'

export class GoogleContactRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  GoogleContactEntity
> {}

export default new GoogleContactRepositoryImpl(Database.googleContact)
