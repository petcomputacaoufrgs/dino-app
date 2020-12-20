import SynchronizableSync from '../synchronizable/SynchronizableSync'
import UserSettingsDataModel from '../../types/user/api/UserSettingsDataModel'
import UserSettingsEntity from '../../types/user/database/UserSettingsEntity'
import { UserSettingsRepositoryImpl } from '../../storage/database/user/UserSettingsRepository'
import UserSettingsService from '../../services/user/UserSettingsService'

class UserSettingsSync extends SynchronizableSync<
  number,
  number,
  UserSettingsDataModel,
  UserSettingsEntity,
  UserSettingsRepositoryImpl
> {}

export default new UserSettingsSync(UserSettingsService)
