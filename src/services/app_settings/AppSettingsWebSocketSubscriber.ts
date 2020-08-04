import BaseWebSocketSubscriber from '../../types/services/web_socket/BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import AppSettingsWebSocketAlertUpdateModel from '../../types/app_settings/AppSettingsWebSocketAlertUpdateModel'
import AppSettingsService from './AppSettingsService'

class AppSettingsWebSocketSubscriber implements BaseWebSocketSubscriber {
  items = [
    {
      path: DinoAPIWebSocketConstants.ALERT_APP_SETTINGS_UPDATE,
      callback: (model: AppSettingsWebSocketAlertUpdateModel) => {
        AppSettingsService.update(model.newVersion)
      },
    },
  ]
}

export default new AppSettingsWebSocketSubscriber()
