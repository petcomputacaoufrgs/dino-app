import AppSettingsSync from '../app_settings/AppSettingsSync'
import GlossarySync from '../glossary/GlossarySync'
import NoteSync from '../note/NoteSync'
import ConnectionListenerService from '../connection/ConnectionListenerService'
import SyncControlModel from '../../types/sync/SyncControlModel'
import AuthService from '../auth/AuthService'

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
    if (AuthService.isAuthenticated()) {
      if (this.control) {
        if (ConnectionListenerService.isConnected()) {
          this.start(this.control)
        } else if (this.control.onInternetFail) {
          this.control.onInternetFail()
        }
      } else {
        setTimeout(this.sync, SYNC_FAIL_WITHOUT_CONTROL)
      }
    }
  }

  private start = async (control: SyncControlModel) => {
    const promises: Promise<boolean>[] = []

    if (control.onStart) {
      control.onStart()
    }

    promises.push(AppSettingsSync.sync(control.language))
    promises.push(GlossarySync.sync())
    promises.push(NoteSync.sync())

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
