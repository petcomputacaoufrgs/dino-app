import AuthService from '../auth/AuthService'
import SockJS from 'sockjs-client'
import Stomp, { Message } from 'stompjs'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import DinoAPIHeaderConstants from '../../constants/dino_api/DinoAPIHeaderConstants'
import BaseWebSocketSubscriber from '../../types/services/web_socket/BaseWebSocketSubscriber'
import GlossaryWebSocketSubscriber from '../glossary/GlossaryWebSocketSubscriber'
import AppSettingsWebSocketSubscriber from '../app_settings/AppSettingsWebSocketSubscriber'
import NoteWebSocketSubscriber from '../note/NoteWebSocketSubscriber'
import UserWebSocketSubscriber from '../user/UserWebSocketSubscriber'

class WebSocketService {
  socket?: WebSocket
  stompClient?: Stomp.Client

  /**
   * Inicia a conexão com o servidor.
   * Obs.: Remova "this.stompClient.debug = () => {}" para acompanhar o estado da conexão
   * pelo console.
   */
  connect = () => {
    if (AuthService.isAuthenticated()) {
      this.socket = new SockJS(this.getSocketBaseURL())
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.debug = (...args: string[]) => {}
      this.stompClient.connect({}, this.subscribe)
    }
  }

  disconnect = () => {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {}, {})
    }
  }

  /**
   * Se increve em filas e tópicos do WebSocket da API
   * Adicione aqui todos os serviços que deseja
   */
  private subscribe = () => {
    const subscribers: BaseWebSocketSubscriber[] = []

    subscribers.push(GlossaryWebSocketSubscriber)
    subscribers.push(AppSettingsWebSocketSubscriber)
    subscribers.push(NoteWebSocketSubscriber)
    subscribers.push(UserWebSocketSubscriber)

    subscribers.forEach((subscriber) => {
      subscriber.items.forEach((item) => {
        this.stompClient?.subscribe(item.path, (message: Message) => {
          this.filterCallback(item.callback, message)
        })
      })
    })
  }

  /**
   * Filtra a mensagem recebida da API para enviar apenas o corpo como objeto desserializado
   * @param callback Função de callback
   * @param message Mensagem recebida pela API
   */
  private filterCallback(callback: (data: any) => void, message: Message) {
    callback(JSON.parse(message.body))
  }

  private getSocketBaseURL(): string {
    return `${DinoAPIWebSocketConstants.URL}?${
      DinoAPIHeaderConstants.AUTHORIZATION
    }=${AuthService.getAuthToken()}`
  }
}

export default new WebSocketService()
