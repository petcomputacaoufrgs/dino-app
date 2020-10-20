import LS_Constants from '../constants/local_storage/LocalStorageKeysConstants'
import BaseLocalStorage from './BaseLocalStorage'
import SyncState from '../types/sync/SyncState'

class SyncLocalStorage extends BaseLocalStorage {
  getState = (): SyncState => {
    const state = this.get(LS_Constants.SYNC_STATE)

    if (state) {
      return JSON.parse(state)
    }

    return SyncState.Synced
  }

  setState = (state: SyncState) => {
    this.set(LS_Constants.SYNC_STATE, JSON.stringify(state))
  }
}

export default new SyncLocalStorage()
