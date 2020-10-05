import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import UserService from '../../services/user/UserService'
import SubscriberItem from '../../types/web_socket/SubscriberItem'
import WebSocketAlertUpdateModel from '../../types/web_socket/WebSocketAlertUpdateModel'

class UserWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: DinoAPIWebSocketConstants.ALERT_USER_UPDATE,
        callback: (model: WebSocketAlertUpdateModel) => {
          UserService.update(model.newVersion)
        },
      },
    ]

    super(items)
  }
}

export default new UserWebSocketSubscriber()
