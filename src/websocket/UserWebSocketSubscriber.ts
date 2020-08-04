import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import UserAlertUpdateModel from '../types/user/UserAlertUpdateModel'
import UserService from '../services/user/UserService'
import SubscriberItem from '../types/web_socket/SubscriberItem'

class UserWebSocketSubscriber implements BaseWebSocketSubscriber {
  items: SubscriberItem[] = [
    {
      path: DinoAPIWebSocketConstants.ALERT_USER_UPDATE,
      callback: (model: UserAlertUpdateModel) => {
        UserService.update(model.newVersion)
      },
    },
  ]
}

export default new UserWebSocketSubscriber()
