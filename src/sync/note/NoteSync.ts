import NoteServiceImpl from '../../services/note/NoteService'
import { NoteRepositoryImpl } from '../../storage/database/note/NoteRepository'
import NoteDataModel from '../../types/note/api/NoteDataModel'
import NoteEntity from '../../types/note/database/NoteEntity'
import SynchronizableSync from '../synchronizable/SynchronizableSync'

class NoteSync extends SynchronizableSync<
  number,
  number,
  NoteDataModel,
  NoteEntity,
  NoteRepositoryImpl
> {
  constructor() {
    super(NoteServiceImpl)
  }
}

export default new NoteSync()
