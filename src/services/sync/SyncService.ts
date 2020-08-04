import AppSettingsSync from '../app_settings/AppSettingsSync'
import NoteSync from '../note/NoteSync'
import AuthService from '../auth/AuthService'
import LogAppErrorSync from '../log_app_error/LogAppErrorSync'
import ContactSync from '../contact/ContactSync'

class SyncService {
  sync = async () => {
    if (AuthService.isAuthenticated()) {
      AppSettingsSync.sync()
      NoteSync.sync()
      LogAppErrorSync.sync()
      ContactSync.sync()
    }
  }
}

export default new SyncService()
