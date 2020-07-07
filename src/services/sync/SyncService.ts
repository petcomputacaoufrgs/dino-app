import AppSettingsSync from '../app_settings/AppSettingsSync'
import GlossarySync from '../glossary/GlossarySync'
import NoteSync from '../note/NoteSync'
import ConnectionService from '../connection/ConnectionService'
import SyncControlModel from '../../types/sync/SyncControlModel'
import AuthService from '../auth/AuthService'
import AuthSync from '../auth/AuthSync'

const SYNC_FAIL_INTERVAL = 60000
const SYNC_FAIL_WITHOUT_CONTROL = 200

class SyncService {
  control?: SyncControlModel

  startSyncService = (control: SyncControlModel) => {
    this.control = control
  }

  stopSyncService = () => {
    this.control = undefined
  }

  sync = async () => {
      if (this.control) {
        if (ConnectionService.isConnected()) {
          this.start(this.control)
        } else if (this.control.onInternetFail) {
          this.control.onInternetFail()
        }
      } else {
        setTimeout(this.sync, SYNC_FAIL_WITHOUT_CONTROL)
      }
  }

  private start = async (control: SyncControlModel) => {
    const promises: Promise<boolean>[] = []

    const isAuthenticated = AuthService.isAuthenticated()

    if (isAuthenticated) {
      promises.push(AppSettingsSync.sync(control.language))
      promises.push(GlossarySync.sync())
      promises.push(NoteSync.sync())
    } 

    promises.push(AuthSync.sync())

      if (control.onStart) {
        control.onStart()
      }

      const results = await Promise.all(promises)

      if (results.every((success) => success)) {
        if (control.onFinish) {
          control.onFinish()
        }
      } else {
        if (control.onFail) {
          control.onFail()
        }

        setTimeout(this.sync, SYNC_FAIL_INTERVAL)
      }
  }
}

export default new SyncService()
