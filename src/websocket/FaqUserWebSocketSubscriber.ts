import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import FaqUserWebSocketAlertUpdateModel from '../types/faq/FaqUserWebSocketAlertUpdateModel'
import Service from '../services/faq/FaqService'
import SubscriberItem from '../types/web_socket/SubscriberItem'

class FaqUserWebSocketSubscriber implements BaseWebSocketSubscriber {
  items: SubscriberItem[] = [
    {
      path: DinoAPIWebSocketConstants.ALERT_FAQ_USER_UPDATE,
      callback: (model: FaqUserWebSocketAlertUpdateModel) => {
        if (
          Service.getUserFaqId() === undefined ||
          Service.getUserFaqId() !== model.newVersion
        ) {
          Service.getUserFaqFromServer()
        }
      },
    },
  ]
}

export default new FaqUserWebSocketSubscriber()
