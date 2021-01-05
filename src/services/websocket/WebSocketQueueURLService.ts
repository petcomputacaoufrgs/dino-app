import WebSocketURLService from './WebSocketURLService'

class WebSocketQueueURLService implements WebSocketURLService {
    generateDestinationURL = (dest: string) => {
        return '/user/queue/' + dest
    }
}

export default new WebSocketQueueURLService()