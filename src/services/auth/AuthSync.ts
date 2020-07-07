import BaseSync from '../BaseSync'
import AuthService from './AuthService'

class AuthSync implements BaseSync {
  sync = async (): Promise<boolean> => {
    if (AuthService.shouldSync()) {
      const success = await AuthService.logout(AuthService.getLogoutToken())
      if (success) {
        AuthService.removeLogoutToken()
      }
      return success
    }

    return true
  }
}

export default new AuthSync()
