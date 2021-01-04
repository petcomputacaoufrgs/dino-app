import ConnectionService from '../connection/ConnectionService'
import UserService from '../user/UserService'
import HistoryService from '../history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'
import AuthService from '../auth/AuthService'
import SyncService from '../sync/SyncService'
import WebSocketConnector from '../../websocket/WebSocketConnector'
import CalendarService from '../calendar/CalendarService'
import GoogleAgentService from '../../agent/GoogleAgentService'
import UserDataService from './UserDataService'
import GoogleScopeService from '../auth/google/GoogleScopeService'
import GoogleContactService from '../contact/GoogleContactService'
import NoteColumnService from '../note/NoteColumnService'
import UserSettingsService from '../user/UserSettingsService'
import NoteService from '../note/NoteService'
import GlossaryService from '../glossary/GlossaryService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import ContactService from '../contact/ContactService'
import PhoneService from '../contact/PhoneService'
import FaqService from '../faq/FaqService'
import FaqItemService from '../faq/FaqItemService'
import FaqUserQuestionService from '../faq/FaqUserQuestionService'
import TreatmentService from '../treatment/TreatmentService'
import LogAppErrorModel from '../../types/log_app_error/api/LogAppErrorModel'

class EventService {
  userDataServices: UserDataService[] = [
    UserService,
    GoogleScopeService,
    UserSettingsService,
    NoteService,
    NoteColumnService,
    GlossaryService,
    ContactService,
    PhoneService,
    GoogleContactService,
    FaqService,
    FaqItemService,
    FaqUserQuestionService,
    CalendarService,
    TreatmentService,
    LogAppErrorService,
  ]

  constructor() {
    ConnectionService.addEventListener(this.connectionCallback)
  }

  whenStart = async () => {
    const isDinoConnected = await ConnectionService.isDinoConnected()
    const isAuthenticated = await AuthService.isAuthenticated()
    if (isDinoConnected && isAuthenticated) {
      GoogleAgentService.refreshAuth()
      WebSocketConnector.connect()
      SyncService.sync()
    }
  }

  whenLogin = () => {
    CalendarService.addMocks()
    SyncService.sync()
    WebSocketConnector.connect()
    HistoryService.push(PathConstants.HOME)
  }

  whenLogout = async () => {
    const cleanPromises = this.userDataServices.map((service, index) => {
      return service.onLogout()
    })
    await Promise.all(cleanPromises)
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
