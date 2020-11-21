import SockJS from 'sockjs-client'
import Stomp, { Message } from 'stompjs'
import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import GlossaryWebSocketSubscriber from './glossary/GlossaryWebSocketSubscriber'
import AppSettingsWebSocketSubscriber from './app_settings/AppSettingsWebSocketSubscriber'
import NoteWebSocketSubscriber from './note/NoteWebSocketSubscriber'
import UserWebSocketSubscriber from './user/UserWebSocketSubscriber'
import ContactWebSocketSubscriber from './contact/ContactWebSocketSubscriber'
import FaqWebSocketSubscriber from './faq/FaqWebSocketSubscriber'
import FaqUserWebSocketSubscriber from './faq/FaqUserWebSocketSubscriber'
import AuthService from '../services/auth/AuthService'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import DinoAPIHeaderConstants from '../constants/dino_api/DinoAPIHeaderConstants'
import NoteColumnWebSocketSubscriber from './note/NoteColumnWebSocketSubscriber'
import WebSocketConstants from '../constants/websocket/WebSocketConstants'
import LogAppErrorService from '../services/log_app_error/LogAppErrorService'
import ConnectionService from '../services/connection/ConnectionService'

class WebSocketConnector {
  private socket?: WebSocket
  private stompClient?: Stomp.Client
  private subscribers: BaseWebSocketSubscriber[] = [
    GlossaryWebSocketSubscriber,
    AppSettingsWebSocketSubscriber,
    NoteColumnWebSocketSubscriber,
    NoteWebSocketSubscriber,
    UserWebSocketSubscriber,
    ContactWebSocketSubscriber,
    FaqWebSocketSubscriber,
    FaqUserWebSocketSubscriber,
  ]
  private delayTimeout: NodeJS.Timeout | undefined

  connect = async (): Promise<boolean> => {
    if (AuthService.isAuthenticated()) {
      try {
        const response = await AuthService.requestWebSocketAuthToken()
        if (response) {
          const baseUrl = this.getSocketBaseURL(response.webSocketToken)
          this.socket = new SockJS(baseUrl)
          //this.muteConnectionLogs()

          this.stompClient = Stomp.over(this.socket)
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
    ConnectionService.verify()
    this.tryToReconnect()
  }

  private handleWebSocketError = () => {
    LogAppErrorService.logModel({
      date: new Date().getTime(),
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
    callback(JSON.parse(message.body))
  }

  private getSocketBaseURL(token: string): string {
    return `${DinoAPIWebSocketConstants.URL}?${DinoAPIHeaderConstants.WS_AUTHORIZATION}=${token}`
  }
}

export default new WebSocketConnector()
