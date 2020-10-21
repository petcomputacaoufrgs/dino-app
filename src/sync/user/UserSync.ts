import BaseSync from '../BaseSync'
import UserService from '../../services/user/UserService'

class UserSync implements BaseSync {
  receive = async () => {
    const updatedVersion = await UserService.getServerVersion()
    if (updatedVersion !== undefined) {
      UserService.update(updatedVersion)
    }
  }
}

export default new UserSync()
