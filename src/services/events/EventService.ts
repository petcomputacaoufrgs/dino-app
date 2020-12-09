import ConnectionService from '../connection/ConnectionService'
import UserService from '../user/UserService'
import HistoryService from '../history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'
import AppSettingsService from '../app_settings/AppSettingsService'
import AuthService from '../auth/AuthService'
import Synchronizer from '../../sync/Synchronizer'
import WebSocketConnector from '../../websocket/WebSocketConnector'
import CalendarService from '../calendar/CalendarService'
import SyncService from '../sync/SyncService'

class EventService {
  constructor() {
    ConnectionService.addEventListener(this.connectionCallback)
  }

  whenStart = async () => {
    AuthService.cleanLoginGarbage()
    const isDinoConnected = await ConnectionService.isDinoConnected()
    if (isDinoConnected && AuthService.isAuthenticated()) {
      AuthService.refreshGoogleAccessToken()
      WebSocketConnector.connect()
      Synchronizer.sync()
    }
  }

  whenLogin = () => {
    CalendarService.addMocks()
    Synchronizer.sync(true)
    WebSocketConnector.connect()
    HistoryService.push(PathConstants.HOME)
  }

  whenLogout = () => {
    UserService.removeUserData()
    AppSettingsService.returnAppSettingsToDefault()
    WebSocketConnector.disconnect()
    HistoryService.push(PathConstants.LOGIN)
  }

  whenLoginForbidden = () => {
    UserService.removeUserData()
    WebSocketConnector.disconnect()
    HistoryService.push(PathConstants.LOGIN)
  }

  whenConnectionReturn = () => {
    WebSocketConnector.connect()
    Synchronizer.sync()
  }

  whenConnectionLost = () => {
    SyncService.setOffline()
    WebSocketConnector.disconnect()
  }

  whenError = () => {}

  private connectionCallback = (online: boolean) => {
    online ? this.whenConnectionReturn() : this.whenConnectionLost()
  }
}

export default new EventService()
