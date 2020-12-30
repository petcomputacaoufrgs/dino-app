import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import GoogleScopeEntity from '../../../types/auth/google/database/GoogleScopeEntity'
import Database from '../Database'

export class GoogleScopeRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  GoogleScopeEntity
> {
  async getByName(
    name: string
  ): Promise<GoogleScopeEntity | undefined> {
    return this.table.where('name').equals(name).first()
  }
}

export default new GoogleScopeRepositoryImpl(Database.googleScope)
