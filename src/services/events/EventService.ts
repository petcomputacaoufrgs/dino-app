import ConnectionService from '../connection/ConnectionService'
import UserService from '../user/UserService'
import HistoryService from '../history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'
import AppSettingsService from '../app_settings/AppSettingsService'
import AuthService from '../auth/AuthService'
import Synchronizer from '../../sync/SynchronizerService'
import WebSocketConnector from '../../websocket/WebSocketConnector'
import CalendarService from '../calendar/CalendarService'

class EventService {
  constructor() {
    ConnectionService.addEventListener(this.connectionCallback)
  }

  whenStart = async () => {
    AuthService.cleanLoginGarbage()
    await WebSocketConnector.connect()
    Synchronizer.sync()
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
