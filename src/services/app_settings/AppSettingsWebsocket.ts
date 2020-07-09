import BaseWebsocket from '../BaseWebsocket'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

class AppSettingsWebsocket implements BaseWebsocket {
  socket: WebSocket = new SockJS('http://localhost:5000/websocket')
  stompClient: Stomp.Client = Stomp.over(this.socket)

  start = () => {
    this.stompClient.connect({}, this.subscribe)
    setTimeout(this.sendName, 3000)
  }

  sendName = () => {
    this.stompClient.send(
      '/app/hello',
      {},
      JSON.stringify({ name: "teste" })
    )
  }

  subscribe = (frame) => {
    console.log('Connected: ' + frame)
    this.stompClient.subscribe('/topic/greetings', function (greeting) {
      console.log(JSON.parse(greeting.body).content)
    })
  }
}

export default new AppSettingsWebsocket()
