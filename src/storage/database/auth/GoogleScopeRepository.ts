import SynchronizableRepository from "../synchronizable/SynchronizableRepository"
import GoogleScopeEntity from '../../../types/auth/google/database/GoogleScopeEntity'
import Database from "../Database"

export class GoogleScopeRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  GoogleScopeEntity
> {}

export default new GoogleScopeRepositoryImpl(Database.googleScope)