import WebSocketURLService from './WebSocketPathService'

class WebSocketQueuePathService implements WebSocketURLService {
	generateDestinationPath = (dest: string) => {
		return '/user/queue/' + dest
	}
}

export default new WebSocketQueuePathService()
