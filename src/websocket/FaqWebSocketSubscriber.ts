import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import WebSocketAlertUpdateModel from '../types/web_socket/WebSocketAlertUpdateModel'
import Service from '../services/faq/FaqService'
import SubscriberItem from '../types/web_socket/SubscriberItem'

class FaqWebSocketSubscriber implements BaseWebSocketSubscriber {
  items: SubscriberItem[] = [
    {
      path: DinoAPIWebSocketConstants.ALERT_FAQ_UPDATE,
      callback: (model: WebSocketAlertUpdateModel) => {
        if(Service.getUserFaqId() === model.newId) { 
          if(Service.getVersion() !== model.newVersion) {
            Service.getUserFaqFromServer()
          }
        }
      },
    },
  ]
}

export default new FaqWebSocketSubscriber()
