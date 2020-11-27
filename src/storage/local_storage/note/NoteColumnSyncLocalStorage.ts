import BaseLocalStorage from '../BaseLocalStorage'
import LS_Constants from '../../../constants/local_storage/LocalStorageKeysConstants'

class NoteColumnSyncLocalStorage extends BaseLocalStorage {
  getShouldSync = (): boolean => {
    const should = this.get(LS_Constants.NOTE_COLUMN_SHOULD_SYNC)

    if (should) {
      return JSON.parse(should)
    }

    return false
  }

  setShouldSync = (should: boolean) => {
    this.set(LS_Constants.NOTE_COLUMN_SHOULD_SYNC, JSON.stringify(should))
  }

  removeShouldSync = () => {
    this.remove(LS_Constants.NOTE_COLUMN_SHOULD_SYNC)
  }

  getShouldSyncOrder = (): boolean => {
    const should = this.get(LS_Constants.NOTE_COLUMN_ORDER_SHOULD_SYNC)

    if (should) {
      return JSON.parse(should)
    }

    return false
  }

  setShouldSyncOrder = (should: boolean) => {
    this.set(LS_Constants.NOTE_COLUMN_ORDER_SHOULD_SYNC, JSON.stringify(should))
  }

  removeShouldSyncOrder = () => {
    this.remove(LS_Constants.NOTE_COLUMN_ORDER_SHOULD_SYNC)
  }

  removeUserData = () => {
    this.removeShouldSync()
    this.removeShouldSyncOrder()
  }
}

export default new NoteColumnSyncLocalStorage()
