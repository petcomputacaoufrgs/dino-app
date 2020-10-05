import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import ContactService from '../../services/contact/ContactService'
import SubscriberItem from '../../types/web_socket/SubscriberItem'
import WebSocketAlertUpdateModel from '../../types/web_socket/WebSocketAlertUpdateModel'

class ContactWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: DinoAPIWebSocketConstants.ALERT_CONTACT_UPDATE,
        callback: (model: WebSocketAlertUpdateModel) => {
          ContactService.updateLocal(model.newVersion)
        },
      },
    ]
    super(items)
  }
}

export default new ContactWebSocketSubscriber()
