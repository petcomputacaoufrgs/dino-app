import AuthService from '../auth/AuthService'
import GlossaryUpdater from '../glossary/GlossaryUpdater'
import NoteUpdater from '../note/NoteUpdater'
import ContactUpdater from '../contact/ContactUpdater'
import AppSettingsUpdater from '../app_settings/AppSettingsUpdater'
import BaseUpdater from '../../types/services/BaseUpdater'
import UserUpdater from '../user/UserUpdater'

class UpdaterService implements BaseUpdater {
  checkUpdates = async () => {
    if (AuthService.isAuthenticated()) {
      AppSettingsUpdater.checkUpdates()
      GlossaryUpdater.checkUpdates()
      NoteUpdater.checkUpdates()
      ContactUpdater.checkUpdates()
      UserUpdater.checkUpdates()
    }
  }
}

export default new UpdaterService()
