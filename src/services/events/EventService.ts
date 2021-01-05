import ConnectionService from '../connection/ConnectionService'
import HistoryService from '../history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'
import AuthService from '../auth/AuthService'
import SyncService from '../sync/SyncService'
import WebSocketConnector from '../../websocket/WebSocketConnector'
import CalendarService from '../calendar/CalendarService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import LogAppErrorModel from '../../types/log_app_error/api/LogAppErrorModel'
import sleep from '../../utils/SleepUtils'

class EventService {
  constructor() {
    ConnectionService.addEventListener(this.connectionCallback)
  }

  whenStart = async () => {
    const isDinoConnected = await ConnectionService.isDinoConnected()
    const isAuthenticated = await AuthService.isAuthenticated()
    if (isDinoConnected && isAuthenticated) {
      WebSocketConnector.connect()
      await SyncService.sync()
      await sleep(1 * 30000)
      SyncService.sync()
    }
  }

  whenLogin = () => {
    CalendarService.addMocks()
    WebSocketConnector.connect()
    SyncService.sync()
    HistoryService.push(PathConstants.HOME)
  }

  whenLogout = async () => {
    WebSocketConnector.disconnect()
    HistoryService.push(PathConstants.LOGIN)
  }

  whenLoginForbidden = async () => {
    await AuthService.logout()
  }

  whenConnectionReturn = async () => {
    const isDinoConnected = await ConnectionService.isDinoConnected()
    const isAuthenticated = await AuthService.isAuthenticated()
    if (isDinoConnected && isAuthenticated) {
      WebSocketConnector.connect()
      SyncService.sync()
    }
  }

  whenConnectionLost = () => {
    SyncService.setNotSynced()
    WebSocketConnector.disconnect()
  }

  whenError = (error: LogAppErrorModel) => {
    LogAppErrorService.logModel(error)
  }

  private connectionCallback = (online: boolean) => {
    online ? this.whenConnectionReturn() : this.whenConnectionLost()
  }
}

export default new EventService()
