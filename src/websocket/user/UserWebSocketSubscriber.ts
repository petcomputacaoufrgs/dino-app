import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import UserAlertUpdateModel from '../../types/user/UserAlertUpdateModel'
import UserService from '../../services/user/UserService'
import SubscriberItem from '../../types/web_socket/SubscriberItem'

class UserWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: DinoAPIWebSocketConstants.ALERT_USER_UPDATE,
        callback: (model: UserAlertUpdateModel) => {
          UserService.update(model.newVersion)
        },
      },
    ]

    super(items)
  }
}

export default new UserWebSocketSubscriber()
