import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import NoteService from '../../services/note/NoteService'
import SubscriberItem from '../../types/web_socket/SubscriberItem'
import NoteWebSocketOrderUpdateModel from '../../types/note/web_socket/NoteWebSocketOrderUpdateModel'
import NoteWebSocketAlertDeleteModel from '../../types/note/web_socket/NoteWebSocketAlertDeleteModel'
import WebSocketAlertUpdateModel from '../../types/web_socket/WebSocketAlertUpdateModel'

class NoteWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: DinoAPIWebSocketConstants.ALERT_NOTE_UPDATE,
        callback: (model: WebSocketAlertUpdateModel) => {
          this.conflictingMethodsQueue(
            async () =>
              await NoteService.updateNotesFromServer(model.newVersion)
          )
        },
      },
      {
        path: DinoAPIWebSocketConstants.ALERT_NOTE_ORDER_UPDATE,
        callback: (model: NoteWebSocketOrderUpdateModel) => {
          this.conflictingMethodsQueue(
            async () => await NoteService.updateNotesOrderFromServer(model)
          )
        },
      },
      {
        path: DinoAPIWebSocketConstants.ALERT_NOTE_DELETE,
        callback: (model: NoteWebSocketAlertDeleteModel) => {
          this.conflictingMethodsQueue(
            async () => await NoteService.updateDeletedNotesFromServer(model)
          )
        },
      },
    ]

    super(items)
  }
}

export default new NoteWebSocketSubscriber()
