import SynchronizableSync from '../synchronizable/SynchronizableSync'
import GoogleScopeDataModel from '../../types/auth/google/api/GoogleScopeDataModel'
import GoogleScopeEntity from '../../types/auth/google/database/GoogleScopeEntity'
import { GoogleScopeRepositoryImpl } from '../../storage/database/auth/GoogleScopeRepository'
import GoogleScopeService from '../../services/auth/google/GoogleScopeService'

class GoogleScopeSync extends SynchronizableSync<
  number,
  number,
  GoogleScopeDataModel,
  GoogleScopeEntity,
  GoogleScopeRepositoryImpl
> {}

export default new GoogleScopeSync(GoogleScopeService)
