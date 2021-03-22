import APIMainPathsConstants from '../../constants/api/APIMainPathsConstants'
import LogoutMessage from '../../types/auth/api/LogoutMessage'
import WebSocketSubscriber from '../../types/web_socket/WebSocketSubscriber'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import WebSocketSubscriberableService from '../websocket/WebSocketSubscriberableService'
import AuthService from './AuthService'

class LogoutService extends WebSocketSubscriberableService {
	public start() {}

	protected getWebSocketSubscribers(): WebSocketSubscriber<LogoutMessage>[] {
		return [
			{
				path: WebSocketQueuePathService.generateDestinationPath(
					APIMainPathsConstants.LOGOUT_REQUEST,
				),
				callback: this.webSocketCallback,
			},
		]
	}

	protected getWebSocketDependencies(): WebSocketSubscriberableService[] {
		return []
	}

	private webSocketCallback = async (model: LogoutMessage | undefined) => {
		AuthService.logout()
	}
}

export default new LogoutService()
