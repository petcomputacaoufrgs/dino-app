import SockJS from 'sockjs-client'
import Stomp, { Message } from 'stompjs'
import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import GlossaryWebSocketSubscriber from './GlossaryWebSocketSubscriber'
import AppSettingsWebSocketSubscriber from './AppSettingsWebSocketSubscriber'
import NoteWebSocketSubscriber from './NoteWebSocketSubscriber'
import UserWebSocketSubscriber from './UserWebSocketSubscriber'
import ContactWebSocketSubscriber from './ContactWebSocketSubscriber'
import AuthService from '../services/auth/AuthService'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import DinoAPIHeaderConstants from '../constants/dino_api/DinoAPIHeaderConstants'

class WebSocketConnector {
  private socket?: WebSocket
  private stompClient?: Stomp.Client
  private subscribers: BaseWebSocketSubscriber[] = [
    GlossaryWebSocketSubscriber,
    AppSettingsWebSocketSubscriber,
    NoteWebSocketSubscriber,
    UserWebSocketSubscriber,
    ContactWebSocketSubscriber,
  ]

  connect = () => {
    if (AuthService.isAuthenticated()) {
      this.socket = new SockJS(this.getSocketBaseURL())
      this.stompClient = Stomp.over(this.socket)
      //this.muteConnectionLogs() //esconde os logs do socket
      this.stompClient.connect({}, this.subscribe)
    }
  }

  disconnect = () => {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {}, {})
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

  private getSocketBaseURL(): string {
    return `${DinoAPIWebSocketConstants.URL}?${
      DinoAPIHeaderConstants.AUTHORIZATION
    }=${AuthService.getAuthToken()}`
  }
}

export default new WebSocketConnector()
