import UserService from '../../services/user/UserService'
import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'
import UserDataModel from '../../types/user/api/UserModel'
import UserEntity from '../../types/user/database/UserEntity'
import { UserRepositoryImpl } from '../../storage/database/user/UserRepository'

class UserWebSocketSubscriber extends SynchronizableWSSubscriber<
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

export default new UserWebSocketSubscriber()
