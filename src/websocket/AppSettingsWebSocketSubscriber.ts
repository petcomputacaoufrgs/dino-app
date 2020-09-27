import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import WebSocketAlertUpdateModel from '../types/web_socket/WebSocketAlertUpdateModel'
import AppSettingsService from '../services/app_settings/AppSettingsService'
import SubscriberItem from '../types/web_socket/SubscriberItem'

class AppSettingsWebSocketSubscriber implements BaseWebSocketSubscriber {
  items: SubscriberItem[] = [
    {
      path: DinoAPIWebSocketConstants.ALERT_APP_SETTINGS_UPDATE,
      callback: (model: WebSocketAlertUpdateModel) => {
        AppSettingsService.update(model.newVersion)
      },
    },
  ]
}

export default new AppSettingsWebSocketSubscriber()
