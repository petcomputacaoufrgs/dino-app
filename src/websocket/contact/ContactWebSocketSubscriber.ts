import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import ContactWebSocketAlertUpdateModel from '../../types/contact/ContactWebSocketAlertUpdateModel'
import ContactService from '../../services/contact/ContactService'
import SubscriberItem from '../../types/web_socket/SubscriberItem'

class ContactWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: DinoAPIWebSocketConstants.ALERT_CONTACT_UPDATE,
        callback: (model: ContactWebSocketAlertUpdateModel) => {
          ContactService.updateLocal(model.newVersion)
        },
      },
    ]
    super(items)
  }
}

export default new ContactWebSocketSubscriber()
