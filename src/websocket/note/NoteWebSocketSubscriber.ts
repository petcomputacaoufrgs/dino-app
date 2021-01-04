import NoteService from '../../services/note/NoteService'
import { NoteRepositoryImpl } from '../../storage/database/note/NoteRepository'
import NoteDataModel from '../../types/note/api/NoteDataModel'
import NoteEntity from '../../types/note/database/NoteEntity'
import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'

class NoteWebSocketSubscriber extends SynchronizableWSSubscriber<
  number,
  NoteDataModel,
  NoteEntity,
  NoteRepositoryImpl
> {
  constructor() {
    super(NoteService)
  }
}

export default new NoteWebSocketSubscriber()
