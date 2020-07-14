import AppSettingsSync from '../app_settings/AppSettingsSync'
import NoteSync from '../note/NoteSync'
import ConnectionService from '../connection/ConnectionService'
import AuthService from '../auth/AuthService'
import AuthSync from '../auth/AuthSync'

const SYNC_FAIL_INTERVAL = 60000
const SYNC_FAIL_WITHOUT_CONTROL = 200

class SyncService {
  sync = async () => {
    if (ConnectionService.isConnected()) {
      this.startSync()
    } else {
      setTimeout(this.sync, SYNC_FAIL_WITHOUT_CONTROL)
    }
  }

  private startSync = async () => {
    const promises: Promise<boolean>[] = []

    const isAuthenticated = AuthService.isAuthenticated()

    if (isAuthenticated) {
      promises.push(AppSettingsSync.sync())
      promises.push(NoteSync.sync())
    }

    promises.push(AuthSync.sync())

    const results = await Promise.all(promises)

    const syncWithError = !results.every((success) => success)

    if (syncWithError) {
      setTimeout(this.sync, SYNC_FAIL_INTERVAL)
    }
  }
}

export default new SyncService()
