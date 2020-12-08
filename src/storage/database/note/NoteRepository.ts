import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import NoteEntity from '../../../types/note/database/NoteEntity'

export class NoteRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  NoteEntity
> {}

export default new NoteRepositoryImpl(Database.note)
