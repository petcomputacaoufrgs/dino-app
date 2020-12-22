import SynchronizableService from "../../synchronizable/SynchronizableService"
import GoogleScopeDataModel from '../../../types/auth/google/api/GoogleScopeDataModel'
import GoogleScopeEntity from '../../../types/auth/google/database/GoogleScopeEntity'
import GoogleScopeRepository, { GoogleScopeRepositoryImpl } from '../../../storage/database/auth/GoogleScopeRepository'
import APIRequestMappingConstants from "../../../constants/api/APIRequestMappingConstants"
import APIWebSocketDestConstants from "../../../constants/api/APIWebSocketDestConstants"
import SynchronizableWSUpdateModel from "../../../types/synchronizable/api/web_socket/SynchronizableWSUpdateModel"
import SynchronizableWSDeleteModel from "../../../types/synchronizable/api/web_socket/SynchronizableWSDeleteModel"
import AuthService from "../AuthService"
import { GoogleScopeContextType } from "../../../context/provider/google_scope"
import GoogleScope from "../../../types/auth/google/GoogleScope"

export class GoogleScopeServiceImpl extends SynchronizableService<
number,
number,
GoogleScopeDataModel,
GoogleScopeEntity,
GoogleScopeRepositoryImpl
> {
    async convertModelToEntity(model: GoogleScopeDataModel): Promise<GoogleScopeEntity | undefined> {
        const entity: GoogleScopeEntity = {
            name: model.name
        }

        return entity
    }

    async convertEntityToModel(entity: GoogleScopeEntity): Promise<GoogleScopeDataModel | undefined> {
        const model: GoogleScopeDataModel = {
            name: entity.name
        }

        return model
    }

    protected async onWebSocketUpdate(model: SynchronizableWSUpdateModel<number, GoogleScopeDataModel>) {
        AuthService.refreshGoogleAccessToken()
    }

    protected async onWebSocketDelete(model: SynchronizableWSDeleteModel<number>) { 
        AuthService.refreshGoogleAccessToken()
    }

    public hasContactGrant = (context: GoogleScopeContextType): boolean => {
        if (context && context.data) {
          return context.data.some((scope) => scope.name === GoogleScope.SCOPE_CONTACT)
        }
    
        return false
    }
}

export default new GoogleScopeServiceImpl(
    GoogleScopeRepository,
    APIRequestMappingConstants.GOOGLE_SCOPE,
    APIWebSocketDestConstants.GOOGLE_SCOPE_UPDATE,
    APIWebSocketDestConstants.GOOGLE_SCOPE_DELETE
  )