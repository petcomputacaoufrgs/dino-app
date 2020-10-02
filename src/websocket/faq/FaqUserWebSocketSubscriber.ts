import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import FaqUserWebSocketAlertUpdateModel from '../../types/faq/FaqUserWebSocketAlertUpdateModel'
import Service from '../../services/faq/FaqService'
import SubscriberItem from '../../types/web_socket/SubscriberItem'

class FaqUserWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: DinoAPIWebSocketConstants.ALERT_FAQ_USER_UPDATE,
        callback: (model: FaqUserWebSocketAlertUpdateModel) => {
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
