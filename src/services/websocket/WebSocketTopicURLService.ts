import WebSocketURLService from './WebSocketURLService'

class WebSocketTopicURLService implements WebSocketURLService {
    generateDestinationURL = (dest: string) => {
        return '/topic/' + dest
    }
}

export default new WebSocketTopicURLService()