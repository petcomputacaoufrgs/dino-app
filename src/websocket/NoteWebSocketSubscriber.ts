import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import NoteWebSocketAlertUpdateModel from '../types/web_socket/WebSocketAlertUpdateModel'
import NoteService from '../services/note/NoteService'
import SubscriberItem from '../types/web_socket/SubscriberItem'

class NoteWebSocketSubscriber implements BaseWebSocketSubscriber {
  items: SubscriberItem[] = [
    {
      path: DinoAPIWebSocketConstants.ALERT_NOTE_UPDATE,
      callback: (model: NoteWebSocketAlertUpdateModel) => {
        NoteService.updateNotesFromServer(model.newVersion)
      },
    },
  ]
}

export default new NoteWebSocketSubscriber()
