import SyncStateEnum from '../../types/sync/SyncStateEnum'
import SyncLocalStorage from '../../storage/local_storage/sync/SyncLocalStorage'
import SyncContextUpdater from '../../context/updater/SyncContextUpdater'

class SyncService {
  getState = (): SyncStateEnum => {
    return SyncLocalStorage.getState()
  }

  setOffline = () => {
    this.setState(SyncStateEnum.OFFLINE)
  }

  setSynchronizing = () => {
    this.setState(SyncStateEnum.SYNCHRONIZING)
  }

  setSynced = () => {
    this.setState(SyncStateEnum.SYNCED)
  }

  private setState = (state: SyncStateEnum) => {
    SyncLocalStorage.setState(state)
    SyncContextUpdater.update()
  }
}

export default new SyncService()
