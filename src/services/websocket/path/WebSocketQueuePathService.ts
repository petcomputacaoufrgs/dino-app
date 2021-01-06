import WebSocketURLService from './WebSocketPathService'

class WebSocketQueueURLService implements WebSocketURLService {
    generateDestinationPath = (dest: string) => {
        return '/user/queue/' + dest
    }
}

export default new WebSocketQueueURLService()