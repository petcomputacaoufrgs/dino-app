import UserService from '../../services/user/UserService'
import SynchronizableSync from '../synchronizable/SynchronizableSync'
import UserDataModel from '../../types/user/api/UserModel'
import UserEntity from '../../types/user/database/UserEntity'
import { UserRepositoryImpl } from '../../storage/database/user/UserRepository'

class UserSync extends SynchronizableSync<
  number,
  number,
  UserDataModel,
  UserEntity,
  UserRepositoryImpl
> {
  constructor() {
    super(UserService)
  }
}

export default new UserSync()
