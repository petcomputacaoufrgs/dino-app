import BaseWebSocketSubscriber from '../../types/services/BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import GlossaryWebSocketAlertUpdateModel from '../../types/glossary/GlossaryWebSocketAlertUpdateModel'
import GlossaryService from './GlossaryService'

class GlossaryWebSocketSubscriber implements BaseWebSocketSubscriber {
  items = [
    {
      path: DinoAPIWebSocketConstants.ALERT_GLOSSARY_UPDATE,
      callback: (model: GlossaryWebSocketAlertUpdateModel) => {
        GlossaryService.update(model.newVersion)
      },
    },
  ]
}

export default new GlossaryWebSocketSubscriber()
