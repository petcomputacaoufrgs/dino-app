import NoteColumnService from '../../services/note/NoteColumnService'
import { NoteColumnRepositoryImpl } from '../../storage/database/note/NoteColumnRepository'
import NoteColumnDataModel from '../../types/note/api/NoteColumnDataModel'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'
import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'

class NoteColumnWebSocketSubscriber extends SynchronizableWSSubscriber<
  number,
  NoteColumnDataModel,
  NoteColumnEntity,
  NoteColumnRepositoryImpl
> {
  constructor() {
    super(NoteColumnService)
  }
}

export default new NoteColumnWebSocketSubscriber()
