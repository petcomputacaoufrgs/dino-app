import SockJS from 'sockjs-client'
import Stomp, { Message } from 'stompjs'
import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import GlossaryWebSocketSubscriber from './glossary/GlossaryWebSocketSubscriber'
import NoteWebSocketSubscriber from './note/NoteWebSocketSubscriber'
import UserWebSocketSubscriber from './user/UserWebSocketSubscriber'
import ContactWebSocketSubscriber from './contact/ContactWebSocketSubscriber'
import FaqWebSocketSubscriber from './faq/FaqWebSocketSubscriber'
import AuthService from '../services/auth/AuthService'
import APIWebSocketDestConstants from '../constants/api/APIWebSocketDestConstants'
import DinoAPIHeaderConstants from '../constants/api/APIHeaderConstants'
import NoteColumnWebSocketSubscriber from './note/NoteColumnWebSocketSubscriber'
import WebSocketConstants from '../constants/api/WebSocketConstants'
import LogAppErrorService from '../services/log_app_error/LogAppErrorService'
import ConnectionService from '../services/connection/ConnectionService'
import SyncService from '../services/sync/SyncService'
import GoogleContactWebSocketSubscriber from './contact/GoogleContactWebSocketSubscriber'
import PhoneWebSocketSubscriber from './contact/PhoneWebSocketSubscriber'
import FaqItemWebSocketSubscriber from './faq/FaqItemWebSocketSubscriber'
import FaqUserQuestionWebSocketSubscriber from './faq/FaqUserQuestionWebSocketSubscriber'
import TreatmentWebSocketSubscriber from './treatment/TreatmentWebSocketSubscriber'
import UserSettingsWebSocketSubscriber from './user/UserSettingsWebSocketSubscriber'
import GoogleScopeWebSocketSubscriber from './auth/GoogleScopeWebSocketSubscriber'

class WebSocketConnector {
  private socket?: WebSocket
  private stompClient?: Stomp.Client
  private subscribers: BaseWebSocketSubscriber[] = [
    UserWebSocketSubscriber,
    UserSettingsWebSocketSubscriber,
    GoogleScopeWebSocketSubscriber,
    TreatmentWebSocketSubscriber,
    FaqWebSocketSubscriber,
    FaqItemWebSocketSubscriber,
    FaqUserQuestionWebSocketSubscriber,
    GlossaryWebSocketSubscriber,
    NoteColumnWebSocketSubscriber,
    NoteWebSocketSubscriber,
    ContactWebSocketSubscriber,
    GoogleContactWebSocketSubscriber,
    PhoneWebSocketSubscriber,
  ]

  private delayTimeout: NodeJS.Timeout | undefined

  connect = async (): Promise<boolean> => {
    const isAuthenticated = await AuthService.isAuthenticated()

    if (isAuthenticated) {
      try {
        const response = await AuthService.requestWebSocketAuthToken()
        if (response && response.success) {
          const responseData = response.data
          const baseUrl = this.getSocketBaseURL(responseData.webSocketToken)
          this.socket = new SockJS(baseUrl)
          this.stompClient = Stomp.over(this.socket)
          //this.muteConnectionLogs()
          this.stompClient.connect({}, this.subscribe)
          this.socket.onclose = () => {
            this.handleWebSocketClosed()
          }
          this.socket.onerror = () => {
            this.handleWebSocketError()
          }

          return true
        }
      } catch (e) {
        LogAppErrorService.logModel(e)
      }
    }

    return false
  }

  disconnect = () => {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {}, {})
    }
  }

  private handleWebSocketClosed = () => {
    SyncService.setNotSynced()
    ConnectionService.verify()
    this.tryToReconnect()
  }

  private handleWebSocketError = () => {
    LogAppErrorService.logModel({
      date: new Date(),
      error: WebSocketConstants.ERROR_MESSAGE,
      title: WebSocketConstants.ERROR_TITLE,
      file: '',
    })

    this.disconnect()

    this.tryToReconnect()
  }

  private tryToReconnect = () => {
    if (!this.delayTimeout && ConnectionService.isConnected()) {
      this.delayTimeout = setTimeout(async () => {
        const success = await this.connect()
        this.delayTimeout = undefined
        if (!success) {
          this.tryToReconnect()
        } else {
          SyncService.sync()
        }
      }, WebSocketConstants.DELAY_TO_RECONNECT)
    }
  }

  private muteConnectionLogs = () => {
    if (this.stompClient) {
      this.stompClient.debug = (...args: string[]) => {}
    }
  }

  private subscribe = () => {
    this.subscribers.forEach((subscriber) => {
      subscriber.items.forEach((item) => {
        this.stompClient?.subscribe(item.path, (message: Message) => {
          this.filterCallback(item.callback, message)
        })
      })
    })
  }

  private filterCallback(callback: (data: any) => void, message: Message) {
    if (message.body) {
      callback(JSON.parse(message.body))
    } else {
      callback(null)
    }
  }

  private getSocketBaseURL(token: string): string {
    return `${APIWebSocketDestConstants.URL}?${DinoAPIHeaderConstants.WS_AUTHORIZATION}=${token}`
  }
}

export default new WebSocketConnector()
