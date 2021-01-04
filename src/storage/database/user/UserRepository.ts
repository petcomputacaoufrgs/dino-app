import UserEntity from '../../../types/user/database/UserEntity'
import Database from '../Database'
import SynchronizableRepository from '../synchronizable/SynchronizableRepository'

export class UserRepositoryImpl extends SynchronizableRepository<
  number,
  UserEntity
> {
  constructor() {
    super(Database.user)
  }
}

export default new UserRepositoryImpl()
