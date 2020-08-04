import SubscriberItem from '../types/web_socket/SubscriberItem'

/**
 * @description Base para criar services que irão abrir subscribers com a API.
 */
export default interface BaseWebSocketSubscriber {
  items: SubscriberItem[]
}
