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

  start = (control: SyncControlModel) => {
    this.control = control
  }

  stop = () => {
    this.control = undefined
  }

  sync = async () => {
    if (this.control) {
      if (ConnectionService.isConnected()) {
        this.startSync(this.control)
      } 
    } else {
      setTimeout(this.sync, SYNC_FAIL_WITHOUT_CONTROL)
    }
  }

  private startSync = async (control: SyncControlModel) => {
    const promises: Promise<boolean>[] = []

    const isAuthenticated = AuthService.isAuthenticated()

    if (isAuthenticated) {
      promises.push(AppSettingsSync.sync(control.language))
      promises.push(GlossarySync.sync())
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
