import SubscriberItem from '../web_socket/SubscriberItem'

/**
 * @description Base para criar services que irão abrir subscribers com a API.
 * Toda service deve ser adicionada na service "web_socket" e as conexões serão abertas
 * sempre que o aplicativo puder se conectar com o servidor.
 */
export default interface BaseWebSocketSubscriber {
  items: SubscriberItem[]
}
