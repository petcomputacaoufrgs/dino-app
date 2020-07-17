import AppSettingsSync from '../app_settings/AppSettingsSync'
import NoteSync from '../note/NoteSync'
import AuthService from '../auth/AuthService'

class SyncService {
  sync = async () => {
    if (AuthService.isAuthenticated()) {
      AppSettingsSync.sync()
      NoteSync.sync()
    }
  }
}

export default new SyncService()
