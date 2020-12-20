import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'
import { UserSettingsRepositoryImpl } from '../../storage/database/user/UserSettingsRepository'
import UserSettingsDataModel from '../../types/user/api/UserSettingsDataModel'
import UserSettingsEntity from '../../types/user/database/UserSettingsEntity'
import UserSettingsService from '../../services/user/UserSettingsService'

class UserWebSocketSubscriber extends SynchronizableWSSubscriber<
  number,
  number,
  UserSettingsDataModel,
  UserSettingsEntity,
  UserSettingsRepositoryImpl
> {
  constructor() {
    super(UserSettingsService)
  }
}

export default new UserWebSocketSubscriber()
