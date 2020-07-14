import BaseLocalStorage from '../../../types/services/BaseLocalStorage'
import LS_Constants from '../../../constants/LocalStorageKeysConstants'

class NoteSyncLocalStorage extends BaseLocalStorage {
  getShouldSync = (): boolean => {
    const should = this.get(LS_Constants.NOTE_SHOULD_SYNC)

    if (should) {
      return JSON.parse(should)
    }

    return false
  }

  setShouldSync = (should: boolean) => {
    this.set(LS_Constants.NOTE_SHOULD_SYNC, JSON.stringify(should))
  }

  removeShouldSync = () => {
    this.remove(LS_Constants.NOTE_SHOULD_SYNC)
  }
}

export default new NoteSyncLocalStorage()
