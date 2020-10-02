import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import FaqWebSocketAlertUpdateModel from '../../types/faq/FaqWebSocketAlertUpdateModel'
import Service from '../../services/faq/FaqService'
import SubscriberItem from '../../types/web_socket/SubscriberItem'

class FaqWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: DinoAPIWebSocketConstants.ALERT_FAQ_UPDATE,
        callback: (model: FaqWebSocketAlertUpdateModel) => {
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
