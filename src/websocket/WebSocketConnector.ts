import SockJS from 'sockjs-client'
import Stomp, { Message } from 'stompjs'
import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import GlossaryWebSocketSubscriber from './GlossaryWebSocketSubscriber'
import AppSettingsWebSocketSubscriber from './AppSettingsWebSocketSubscriber'
import NoteWebSocketSubscriber from './NoteWebSocketSubscriber'
import UserWebSocketSubscriber from './UserWebSocketSubscriber'
import ContactWebSocketSubscriber from './ContactWebSocketSubscriber'
import FaqWebSocketSubscriber from './FaqWebSocketSubscriber'
import FaqUserWebSocketSubscriber from './FaqUserWebSocketSubscriber'
import AuthService from '../services/auth/AuthService'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import DinoAPIHeaderConstants from '../constants/dino_api/DinoAPIHeaderConstants'
import NoteColumnWebSocketSubscriber from './NoteColumnWebSocketSubscriber'

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

  connect = async () => {
    if (AuthService.isAuthenticated()) {
      const response = await AuthService.requestWebSocketAuthToken()
      if (response) {
        const baseUrl = this.getSocketBaseURL(response.webSocketToken)
        this.socket = new SockJS(baseUrl)
        this.stompClient = Stomp.over(this.socket)
        //this.muteConnectionLogs()
        this.stompClient.connect({}, this.subscribe)
      }
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

  private getSocketBaseURL(token: string): string {
    return `${DinoAPIWebSocketConstants.URL}?${
      DinoAPIHeaderConstants.WS_AUTHORIZATION
      }=${token}`
  }
}

export default new WebSocketConnector()
