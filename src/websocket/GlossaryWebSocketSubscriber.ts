import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import GlossaryWebSocketAlertUpdateModel from '../types/glossary/GlossaryWebSocketAlertUpdateModel'
import GlossaryService from '../services/glossary/GlossaryService'
import SubscriberItem from '../types/web_socket/SubscriberItem'

class GlossaryWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: DinoAPIWebSocketConstants.ALERT_GLOSSARY_UPDATE,
        callback: (model: GlossaryWebSocketAlertUpdateModel) => {
          GlossaryService.update(model.newVersion)
        },
      },
    ]

    super(items)
  }
}

export default new GlossaryWebSocketSubscriber()
