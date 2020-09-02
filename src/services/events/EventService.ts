import ConnectionService from '../connection/ConnectionService'
import UserService from '../user/UserService'
import HistoryService from '../history/HistoryService'
import PathConstants from '../../constants/PathConstants'
import AppSettingsService from '../app_settings/AppSettingsService'
import AuthService from '../auth/AuthService'
import Synchronizer from '../../sync/Synchronizer'
import WebSocketConnector from '../../websocket/WebSocketConnector'
import CalendarService from '../calendar/CalendarService'

class EventService {
  constructor() {
    ConnectionService.addEventListener(this.connectionCallback)
  }

  whenStart = () => {
    AuthService.removeTempAuthToken()
    Synchronizer.sync()
    WebSocketConnector.connect()
  }

  whenLogin = () => {
    CalendarService.addMocks()
    Synchronizer.receive()
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
    Synchronizer.sync()
    WebSocketConnector.connect()
  }

  whenConnectionLost = () => {
    WebSocketConnector.disconnect()
  }

  whenError = () => {}

  private connectionCallback = (online: boolean) => {
    online ? this.whenConnectionReturn() : this.whenConnectionLost()
  }
}

export default new EventService()
