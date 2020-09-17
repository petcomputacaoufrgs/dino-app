import BaseWebSocketSubscriber from './BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../constants/dino_api/DinoAPIWebSocketConstants'
import SubscriberItem from '../types/web_socket/SubscriberItem'
import NoteColumnService from '../services/note/NoteColumnService'
import NoteColumnWebSocketTitleUpdateModel from '../types/note/server/NoteColumnWebSocketTitleUpdateModel'
import NoteService from '../services/note/NoteService'
import NoteColumnWebSocketAlertUpdateOrderModel from '../types/note/server/NoteColumnWebSocketAlertUpdateOrderModel'
import NoteColumnWebSocketAlertDeleteModel from '../types/note/server/NoteColumnWebSocketAlertDeleteModel'
import NoteColumnWebSocketAlertUpdateModel from '../types/note/server/NoteColumnWebSocketAlertUpdateModel'

class NoteColumnWebSocketSubscriber implements BaseWebSocketSubscriber {
  items: SubscriberItem[] = [
    {
      path: DinoAPIWebSocketConstants.ALERT_NOTE_COLUMN_UPDATE,
      callback: (model: NoteColumnWebSocketAlertUpdateModel) => {
        NoteColumnService.updateColumnsFromServer(model.newVersion)
      },
    },
    {
      path: DinoAPIWebSocketConstants.ALERT_NOTE_COLUMN_TITLE_UPDATE,
      callback: (model: NoteColumnWebSocketTitleUpdateModel) => {
        console.log(model)
        NoteColumnService.updateColumnTitleFromServer(model)
        NoteService.updateNoteColumnTitle(model.newTitle, model.oldTitle)
      },
    },
    {
      path: DinoAPIWebSocketConstants.ALERT_NOTE_COLUMN_ORDER_UPDATE,
      callback: (model: NoteColumnWebSocketAlertUpdateOrderModel) => {
        NoteColumnService.updateColumnsOrderFromServer(model)
      },
    },
    {
      path: DinoAPIWebSocketConstants.ALERT_NOTE_COLUMN_DELETE,
      callback: (model: NoteColumnWebSocketAlertDeleteModel) => {
        NoteColumnService.updateDeletedColumnsFromServer(model)
      },
    }
  ]
}

export default new NoteColumnWebSocketSubscriber()
