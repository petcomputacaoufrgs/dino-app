import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import ContactWebSocketAlertUpdateModel from '../types/contact/ContactWebSocketAlertUpdateModel'
import ContactService from '../services/contact/ContactService'
import SubscriberItem from '../types/web_socket/SubscriberItem'

class ContactWebSocketSubscriber implements BaseWebSocketSubscriber {
  items: SubscriberItem[] = [
    {
      path: DinoAPIWebSocketConstants.ALERT_CONTACT_UPDATE,
      callback: (model: ContactWebSocketAlertUpdateModel) => {
        ContactService.updateLocal(model.newVersion)
      },
    },
  ]
}

export default new ContactWebSocketSubscriber()
