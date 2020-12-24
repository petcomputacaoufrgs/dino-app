import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'
import GoogleScopeDataModel from '../../types/auth/google/api/GoogleScopeDataModel'
import GoogleScopeEntity from '../../types/auth/google/database/GoogleScopeEntity'
import { GoogleScopeRepositoryImpl } from '../../storage/database/auth/GoogleScopeRepository'
import GoogleScopeService from '../../services/auth/google/GoogleScopeService'

class GoogleScopeWebSocketSubscriber extends SynchronizableWSSubscriber<
  number,
  number,
  GoogleScopeDataModel,
  GoogleScopeEntity,
  GoogleScopeRepositoryImpl
> {
  constructor() {
    super(GoogleScopeService)
  }
}

export default new GoogleScopeWebSocketSubscriber()
