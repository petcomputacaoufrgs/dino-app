import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import Service from '../../services/faq/FaqService'
import SubscriberItem from '../../types/web_socket/SubscriberItem'
import WebSocketAlertUpdateModel from '../../types/web_socket/WebSocketAlertUpdateModel'

class FaqUserWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: APIWebSocketDestConstants.ALERT_FAQ_USER_UPDATE,
        callback: (model: WebSocketAlertUpdateModel) => {
          if (
            Service.getUserFaqId() === undefined ||
            Service.getUserFaqId() !== model.newId
          ) {
            Service.getUserFaqFromServer()
          }
        },
      },
    ]

    super(items)
  }
}

export default new FaqUserWebSocketSubscriber()
