import BaseUpdater from '../../types/services/BaseUpdater'
import UserService from './UserService'

class UserUpdater implements BaseUpdater {
  checkUpdates = async (): Promise<void> => {
    const updatedVersion = await UserService.getServerVersion()
    if (updatedVersion !== undefined) {
      UserService.update(updatedVersion)
    }
  }
}

export default new UserUpdater()
