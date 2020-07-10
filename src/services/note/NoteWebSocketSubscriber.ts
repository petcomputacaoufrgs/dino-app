import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import DinoAPIWebSocketConstants from '../../constants/dino_api/DinoAPIWebSocketConstants'
import NoteWebSocketAlertUpdateModel from '../../types/note/NoteWebSocketAlertUpdateModel'
import NoteService from './NoteService'

class NoteWebSocketSubscriber implements BaseWebSocketSubscriber {
  items = [
    {
      path: DinoAPIWebSocketConstants.ALERT_NOTE_UPDATE,
      callback: (model: NoteWebSocketAlertUpdateModel) => {
        NoteService.updateNotesFromServer(model.newVersion)
      },
    },
  ]
}

export default new NoteWebSocketSubscriber()
