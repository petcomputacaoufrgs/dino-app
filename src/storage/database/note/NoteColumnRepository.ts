import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import NoteColumnEntity from '../../../types/note/database/NoteColumnEntity'

export class NoteColumnRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  NoteColumnEntity
> {
  getLocalColumnIdByColumnId = async (columnId: number): Promise<NoteColumnEntity | undefined> => {
    return this.table.where('columnId').equals(columnId).first()
  }
}

export default new NoteColumnRepositoryImpl(Database.noteColumn)
