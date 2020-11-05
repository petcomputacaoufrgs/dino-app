import SyncStateEnum from '../../types/sync/SyncStateEnum'
import SyncLocalStorage from '../../local_storage/sync/SyncLocalStorage'
import SyncContextUpdater from '../../context_updater/SyncContextUpdater'

class SyncService {
  getState = (): SyncStateEnum => {
    return SyncLocalStorage.getState()
  }

  setOffline = () => {
    this.setState(SyncStateEnum.OFFILINE)
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
