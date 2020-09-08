import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import SubscriberItem from '../types/web_socket/SubscriberItem'
import NoteColumnWebSocketAlertUpdateModel from '../types/note/server/NoteColumnWebSocketAlertUpdateModel'
import NoteColumnService from '../services/note/NoteColumnService'

class NoteColumnWebSocketSubscriber implements BaseWebSocketSubscriber {
  items: SubscriberItem[] = [
    {
      path: DinoAPIWebSocketConstants.ALERT_NOTE_COLUMN_UPDATE,
      callback: (model: NoteColumnWebSocketAlertUpdateModel) => {
        NoteColumnService.updateColumnsFromServer(model.newVersion)
      },
    },
  ]
}

export default new NoteColumnWebSocketSubscriber()
