import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import NoteColumnEntity from '../../../types/note/database/NoteColumnEntity'

export class NoteColumnRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  NoteColumnEntity
> {
  getById = async (columnId: number): Promise<NoteColumnEntity | undefined> => {
    return this.table.where('id').equals(columnId).first()
  }

  getByLocalId = async (columnId: number): Promise<NoteColumnEntity | undefined> => {
    return this.table.where('id').equals(columnId).first()
  }
}

export default new NoteColumnRepositoryImpl(Database.noteColumn)
