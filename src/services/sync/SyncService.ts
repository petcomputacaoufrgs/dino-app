import SyncState from "../../types/sync/SyncState"
import SyncLocalStorage from "../../local_storage/SyncLocalStorage"
import SyncContextUpdater from "../../context_updater/SyncContextUpdater"

class SyncService {
    getState = (): SyncState => {
        return SyncLocalStorage.getState()
    }

    setOffline = () => {
        this.setState(SyncState.Offline)
    }

    setSynchronizing = () => {
        this.setState(SyncState.Synchronizing)
    }

    setSynced = () => {
        this.setState(SyncState.Synced)
    }

    private setState = (state: SyncState) => {
        SyncLocalStorage.setState(state)
        SyncContextUpdater.update()
    }
}

export default new SyncService()