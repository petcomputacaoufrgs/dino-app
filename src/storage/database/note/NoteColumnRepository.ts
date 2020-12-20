import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import NoteColumnEntity from '../../../types/note/database/NoteColumnEntity'

export class NoteColumnRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  NoteColumnEntity
> {}

export default new NoteColumnRepositoryImpl(Database.noteColumn)
