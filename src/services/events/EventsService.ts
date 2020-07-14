import ConnectionService from '../connection/ConnectionService'
import SyncService from '../sync/SyncService'
import UserService from '../user/UserService'
import HistoryService from '../history/HistoryService'
import PathConstants from '../../constants/PathConstants'
import UpdaterService from '../updater/UpdaterService'
import LanguageSubProviderValue from '../../provider/app_settings_provider/language_provider/value'
import EventsServiceWithoutLanguageContextError from '../../error/EventsServiceWithoutLanguageContextError'
import WebSocketService from '../web_socket/WebSocketService'
import AppSettingsService from '../app_settings/AppSettingsService'

/**
 * Executa funções baseado em eventos da aplicação
 */
class EventsService {
  language?: LanguageSubProviderValue

  constructor() {
    ConnectionService.addEventListener(this.connectionCallback)
  }

  whenStart = (language: LanguageSubProviderValue) => {
    if (language) {
      this.language = language
      AppSettingsService.start(this.language)
      SyncService.start(this.language)
      SyncService.sync()
      UpdaterService.checkUpdates()
      WebSocketService.connect()
    } else {
      throw new EventsServiceWithoutLanguageContextError()
    }
  }

  whenLogin = () => {
    UpdaterService.checkUpdates()
    WebSocketService.connect()
    HistoryService.push(PathConstants.HOME)
  }

  whenLogout = () => {
    if (this.language) {
      UserService.removeUserData()
      this.language.updateLanguage()
      WebSocketService.disconnect()
      HistoryService.push(PathConstants.LOGIN)
    } else {
      throw new EventsServiceWithoutLanguageContextError()
    }
  }

  whenLoginForbidden = () => {
    UserService.removeUserData()
    WebSocketService.disconnect()
    HistoryService.push(PathConstants.LOGIN)
  }

  whenConnectionReturn = () => {
    SyncService.sync()
    UpdaterService.checkUpdates()
    WebSocketService.connect()
  }

  whenConnectionLost = () => {
    WebSocketService.disconnect()
  }

  private connectionCallback = (online: boolean) => {
    online ? this.whenConnectionReturn() : this.whenConnectionLost()
  }
}

export default new EventsService()
