import BaseWebSocketSubscriber from '../../types/services/BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import UserAlertUpdateModel from '../../types/user/UserAlertUpdateModel'
import UserService from './UserService'

class UserWebSocketSubscriber implements BaseWebSocketSubscriber {
  items = [
    {
      path: DinoAPIWebSocketConstants.ALERT_USER_UPDATE,
      callback: (model: UserAlertUpdateModel) => {
        UserService.update(model.newVersion)
      },
    },
  ]
}

export default new UserWebSocketSubscriber()
