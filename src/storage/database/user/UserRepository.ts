import UserEntity from "../../../types/user/database/UserEntity"
import Database from "../Database"
import SynchronizableRepository from "../synchronizable/SynchronizableRepository"

export class UserRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  UserEntity
> {}

export default new UserRepositoryImpl(Database.user)
