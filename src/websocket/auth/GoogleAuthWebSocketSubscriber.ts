import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import SubscriberItem from '../../types/web_socket/SubscriberItem'
import AuthService from '../../services/auth/AuthService'

class GoogleAuthWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: DinoAPIWebSocketConstants.ALERT_AUTH_SCOPE_UPDATE,
        callback: () => {
          AuthService.refreshGoogleAccessToken()
        },
      },
    ]
    super(items)
  }
}

export default new GoogleAuthWebSocketSubscriber()
