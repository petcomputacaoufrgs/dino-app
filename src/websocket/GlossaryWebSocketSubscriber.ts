import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import GlossaryWebSocketAlertUpdateModel from '../types/web_socket/WebSocketAlertUpdateModel'
import GlossaryService from '../services/glossary/GlossaryService'
import SubscriberItem from '../types/web_socket/SubscriberItem'

class GlossaryWebSocketSubscriber implements BaseWebSocketSubscriber {
  items: SubscriberItem[] = [
    {
      path: DinoAPIWebSocketConstants.ALERT_GLOSSARY_UPDATE,
      callback: (model: GlossaryWebSocketAlertUpdateModel) => {
        GlossaryService.update(model.newVersion)
      },
    },
  ]
}

export default new GlossaryWebSocketSubscriber()
