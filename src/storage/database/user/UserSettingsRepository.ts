import UserSettingsEntity from "../../../types/user/database/UserSettingsEntity"
import SynchronizableRepository from "../synchronizable/SynchronizableRepository"
import Database from "../Database"

export class UserSettingsRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  UserSettingsEntity
> {}

export default new UserSettingsRepositoryImpl(Database.userSettings)
