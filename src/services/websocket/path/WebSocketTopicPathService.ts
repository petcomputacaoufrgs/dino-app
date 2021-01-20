import WebSocketURLService from './WebSocketPathService'

class WebSocketTopicPathService implements WebSocketURLService {
	generateDestinationPath = (dest: string) => {
		return '/topic/' + dest
	}
}

export default new WebSocketTopicPathService()
