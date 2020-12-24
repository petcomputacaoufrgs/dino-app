import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import GoogleContactEntity from '../../../types/contact/database/GoogleContactEntity'

export class GoogleContactRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  GoogleContactEntity
> {
  async getByContactLocalId(
    localContactId: number
  ): Promise<GoogleContactEntity | undefined> {
    return this.table.where('localContactId').equals(localContactId).first()
  }
}

export default new GoogleContactRepositoryImpl(Database.googleContact)
