import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import Service from '../../services/faq/FaqService'
import SubscriberItem from '../../types/web_socket/SubscriberItem'
import WebSocketAlertUpdateModel from '../../types/web_socket/WebSocketAlertUpdateModel'

class FaqWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: APIWebSocketDestConstants.ALERT_FAQ_UPDATE,
        callback: (model: WebSocketAlertUpdateModel) => {
          if (Service.getUserFaqId() === model.newId) {
            if (Service.getVersion() !== model.newVersion) {
              Service.getUserFaqFromServer()
            }
          }
        },
      },
    ]

    super(items)
  }
}

export default new FaqWebSocketSubscriber()
