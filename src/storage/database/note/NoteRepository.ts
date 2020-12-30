import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import NoteEntity from '../../../types/note/database/NoteEntity'
import NoteColumnEntity from '../../../types/note/database/NoteColumnEntity'

export class NoteRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  NoteEntity
> {
  constructor() {
    super(Database.note)
  }
  
  getAllByColumn = async (column: NoteColumnEntity): Promise<NoteEntity[]> => {
    if (column.localId !== undefined) {
      return this.table.where('localColumnId').equals(column.localId).toArray()
    }

    return []
  }
}

export default new NoteRepositoryImpl()
