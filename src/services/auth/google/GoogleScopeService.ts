import AutoSynchronizableService from '../../sync/AutoSynchronizableService'
import GoogleScopeDataModel from '../../../types/auth/google/api/GoogleScopeDataModel'
import GoogleScopeEntity from '../../../types/auth/google/database/GoogleScopeEntity'
import APIRequestMappingConstants from '../../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../../constants/api/APIWebSocketDestConstants'
import SynchronizableWSUpdateModel from '../../../types/synchronizable/api/web_socket/SynchronizableWSUpdateModel'
import SynchronizableWSDeleteModel from '../../../types/synchronizable/api/web_socket/SynchronizableWSDeleteModel'
import { GoogleScopeContextType } from '../../../context/provider/google_scope'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import GoogleAgentService from '../../../agent/GoogleAgentService'
import SynchronizableService from '../../sync/SynchronizableService'
import WebSocketQueueURLService from '../../websocket/path/WebSocketQueuePathService'
import Database from '../../../storage/database/Database'

export class GoogleScopeServiceImpl extends AutoSynchronizableService<
  number,
  GoogleScopeDataModel,
  GoogleScopeEntity
> {
  constructor() {
    super(
      Database.googleScope, 
      APIRequestMappingConstants.GOOGLE_SCOPE,
      WebSocketQueueURLService,
      APIWebSocketDestConstants.GOOGLE_SCOPE
    )
  }

  getSyncDependencies(): SynchronizableService[] {
    return []
  }

  async convertModelToEntity(
    model: GoogleScopeDataModel
  ): Promise<GoogleScopeEntity | undefined> {
    const entity: GoogleScopeEntity = {
      name: model.name,
    }

    return entity
  }

  async convertEntityToModel(
    entity: GoogleScopeEntity
  ): Promise<GoogleScopeDataModel | undefined> {
    const model: GoogleScopeDataModel = {
      name: entity.name,
    }

    return model
  }

  protected async onWebSocketUpdate(
    model: SynchronizableWSUpdateModel<number, GoogleScopeDataModel>
  ) {
    GoogleAgentService.refreshAuth()
  }

  protected async onWebSocketDelete(
    model: SynchronizableWSDeleteModel<number>
  ) {
    GoogleAgentService.refreshAuth()
  }

  hasContactGrant = (context: GoogleScopeContextType): boolean => {
    if (context && context.data) {
      return context.data.some(
        (scope) => scope.name === GoogleScope.SCOPE_CONTACT
      )
    }

    return false
  }

  findContactGrant = async (): Promise<GoogleScopeEntity | undefined> => {
    return this.table.where('name').equals(GoogleScope.SCOPE_CONTACT).first()
  }
}

export default new GoogleScopeServiceImpl()
