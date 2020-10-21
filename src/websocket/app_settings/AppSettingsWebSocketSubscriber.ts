import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import AppSettingsService from '../../services/app_settings/AppSettingsService'
import SubscriberItem from '../../types/web_socket/SubscriberItem'
import WebSocketAlertUpdateModel from '../../types/web_socket/WebSocketAlertUpdateModel'

class AppSettingsWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: DinoAPIWebSocketConstants.ALERT_APP_SETTINGS_UPDATE,
        callback: (model: WebSocketAlertUpdateModel) => {
          AppSettingsService.update(model.newVersion)
        },
      },
    ]
    super(items)
  }
}

export default new AppSettingsWebSocketSubscriber()
