import BaseLocalStorage from '../../../types/services/BaseLocalStorage'
import LS_Constants from '../../../constants/LocalStorageKeysConstants'

class LogAppErroLocalStorage extends BaseLocalStorage {
  getShouldSync = (): boolean => {
    const should = this.get(LS_Constants.LOG_APP_ERROR_SYNC)

    if (should) {
      return JSON.parse(should)
    }

    return false
  }

  setShouldSync = (should: boolean) => {
    this.set(LS_Constants.LOG_APP_ERROR_SYNC, JSON.stringify(should))
  }

  removeShouldSync = () => {
    this.remove(LS_Constants.LOG_APP_ERROR_SYNC)
  }

  removeUserData = () => {
    this.removeShouldSync()
  }
}

export default new LogAppErroLocalStorage()
