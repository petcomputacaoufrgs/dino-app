import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import SubscriberItem from '../../types/web_socket/SubscriberItem'
import NoteColumnService from '../../services/note/NoteColumnService'
import NoteColumnWebSocketAlertUpdateOrderModel from '../../types/note/web_socket/NoteColumnWebSocketAlertUpdateOrderModel'
import NoteColumnWebSocketAlertDeleteModel from '../../types/note/web_socket/NoteColumnWebSocketAlertDeleteModel'
import WebSocketAlertUpdateModel from '../../types/web_socket/WebSocketAlertUpdateModel'

class NoteColumnWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: DinoAPIWebSocketConstants.ALERT_NOTE_COLUMN_UPDATE,
        callback: (model: WebSocketAlertUpdateModel) => {
          this.conflictingMethodsQueue(
            async () =>
              await NoteColumnService.updateColumnsFromServer(model.newVersion)
          )
        },
      },
      {
        path: DinoAPIWebSocketConstants.ALERT_NOTE_COLUMN_ORDER_UPDATE,
        callback: (model: NoteColumnWebSocketAlertUpdateOrderModel) => {
          this.conflictingMethodsQueue(
            async () =>
              await NoteColumnService.updateColumnsOrderFromServer(model)
          )
        },
      },
      {
        path: DinoAPIWebSocketConstants.ALERT_NOTE_COLUMN_DELETE,
        callback: (model: NoteColumnWebSocketAlertDeleteModel) => {
          this.conflictingMethodsQueue(
            async () =>
              await NoteColumnService.updateDeletedColumnsFromServer(model)
          )
        },
      },
    ]

    super(items)
  }
}

export default new NoteColumnWebSocketSubscriber()
