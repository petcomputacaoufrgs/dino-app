import LS_Constants from '../../constants/local_storage/LocalStorageKeysConstants'
import BaseLocalStorage from '../BaseLocalStorage'
import SyncStateEnum from '../../types/sync/SyncStateEnum'

class SyncLocalStorage extends BaseLocalStorage {
  getState = (): SyncStateEnum => {
    const state = this.get(LS_Constants.SYNC_STATE)

    if (state) {
      return JSON.parse(state)
    }

    return SyncStateEnum.SYNCED
  }

  setState = (state: SyncStateEnum) => {
    this.set(LS_Constants.SYNC_STATE, JSON.stringify(state))
  }
}

export default new SyncLocalStorage()
