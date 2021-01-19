import WebSocketURLService from './WebSocketPathService'

class WebSocketTopicURLService implements WebSocketURLService {
	generateDestinationPath = (dest: string) => {
		return '/topic/' + dest
	}
}

export default new WebSocketTopicURLService()
