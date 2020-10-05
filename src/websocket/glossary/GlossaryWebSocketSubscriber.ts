import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import GlossaryService from '../../services/glossary/GlossaryService'
import SubscriberItem from '../../types/web_socket/SubscriberItem'
import WebSocketAlertUpdateModel from '../../types/web_socket/WebSocketAlertUpdateModel'

class GlossaryWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: DinoAPIWebSocketConstants.ALERT_GLOSSARY_UPDATE,
        callback: (model: WebSocketAlertUpdateModel) => {
          GlossaryService.update(model.newVersion)
        },
      },
    ]

    super(items)
  }
}

export default new GlossaryWebSocketSubscriber()
