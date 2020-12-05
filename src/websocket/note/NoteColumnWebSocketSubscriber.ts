import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import SubscriberItem from '../../types/web_socket/SubscriberItem'
import NoteColumnService from '../../services/note/NoteColumnService'
import NoteColumnWebSocketAlertUpdateOrderModel from '../../types/note/web_socket/NoteColumnWebSocketAlertUpdateOrderModel'
import NoteColumnWebSocketAlertDeleteModel from '../../types/note/web_socket/NoteColumnWebSocketAlertDeleteModel'
import WebSocketAlertUpdateModel from '../../types/web_socket/WebSocketAlertUpdateModel'

class NoteColumnWebSocketSubscriber extends BaseWebSocketSubscriber {
  constructor() {
    const items: SubscriberItem[] = [
      {
        path: APIWebSocketDestConstants.ALERT_NOTE_COLUMN_UPDATE,
        callback: (model: WebSocketAlertUpdateModel) => {
          this.conflictingMethodsQueue(
            async () =>
              await NoteColumnService.updateColumnsFromServer(model.newVersion)
          )
        },
      },
      {
        path: APIWebSocketDestConstants.ALERT_NOTE_COLUMN_ORDER_UPDATE,
        callback: (model: NoteColumnWebSocketAlertUpdateOrderModel) => {
          this.conflictingMethodsQueue(
            async () =>
              await NoteColumnService.updateColumnsOrderFromServer(model)
          )
        },
      },
      {
        path: APIWebSocketDestConstants.ALERT_NOTE_COLUMN_DELETE,
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
