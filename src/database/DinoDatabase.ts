import Dexie from 'dexie'
import NoteEntity from '../types/note/database/NoteEntity'
import NoteColumnEntity from '../types/note/database/NoteColumnEntity'
import DeletedNoteEntity from '../types/note/database/DeletedNoteEntity'
import DeletedNoteColumnEntity from '../types/note/database/DeletedNoteColumnEntity'

const DATABASE_NAME = 'DinoDatabase'
const DATABASE_VERSION = 1

class DinoDatabase extends Dexie {
  note: Dexie.Table<NoteEntity, number>
  deletedNote: Dexie.Table<DeletedNoteEntity, number>
  noteColumn: Dexie.Table<NoteColumnEntity, number>
  deletedNoteColumn: Dexie.Table<DeletedNoteColumnEntity, number>

  constructor() {
    super(DATABASE_NAME)
    this.version(DATABASE_VERSION).stores({
      note:
        '++id,external_id,order,question,answer,tagNames,lastUpdate,lastOrderUpdate,savedOnServer,columnTitle',
      deletedNote:
        '++id,external_id,order,question,answer,tagNames,lastUpdate,lastOrderUpdate,savedOnServer,columnTitle',
      noteColumn: '++id,external_id',
      deletedNoteColumn: '++id,external_id',
    })
    this.note = this.table('note')
    this.deletedNote = this.table('deletedNote')
    this.noteColumn = this.table('noteColumn')
    this.deletedNoteColumn = this.table('deletedNoteColumn')
  }
}

export default new DinoDatabase()
