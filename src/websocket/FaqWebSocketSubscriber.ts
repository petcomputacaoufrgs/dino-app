import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import FaqWebSocketAlertUpdateModel from '../types/faq/FaqWebSocketAlertUpdateModel'
import FaqService from '../services/faq/FaqService'
import SubscriberItem from '../types/web_socket/SubscriberItem'

class FaqWebSocketSubscriber implements BaseWebSocketSubscriber {
  items: SubscriberItem[] = [
    {
      path: DinoAPIWebSocketConstants.ALERT_FAQ_UPDATE,
      callback: (model: FaqWebSocketAlertUpdateModel) => {
        FaqService.updateLocal(model.newVersion)
      },
    },
  ]
}

export default new FaqWebSocketSubscriber()
