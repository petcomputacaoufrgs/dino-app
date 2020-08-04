import ConnectionService from '../connection/ConnectionService'
import SyncService from '../sync/SyncService'
import UserService from '../user/UserService'
import HistoryService from '../history/HistoryService'
import PathConstants from '../../constants/PathConstants'
import UpdaterService from '../updater/UpdaterService'
import WebSocketService from '../web_socket/WebSocketService'
import AppSettingsService from '../app_settings/AppSettingsService'
import AuthService from '../auth/AuthService'

/**
 * Executa funções baseado em eventos da aplicação
 */
class EventsService {
  constructor() {
    ConnectionService.addEventListener(this.connectionCallback)
  }

  whenStart = () => {
    AuthService.removeTempAuthToken()
    SyncService.sync()
    UpdaterService.checkUpdates()
    WebSocketService.connect()
  }

  whenLogin = () => {
    UpdaterService.checkUpdates()
    WebSocketService.connect()
    HistoryService.push(PathConstants.HOME)
  }

  whenLogout = () => {
    UserService.removeUserData()
    AppSettingsService.returnAppSettingsToDefault()
    WebSocketService.disconnect()
    HistoryService.push(PathConstants.LOGIN)
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

  whenError = () => {
    HistoryService.push(PathConstants.HOME)
  }

  private connectionCallback = (online: boolean) => {
    online ? this.whenConnectionReturn() : this.whenConnectionLost()
  }
}

export default new EventsService()
