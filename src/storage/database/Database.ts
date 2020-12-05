import Dexie from 'dexie'
import NoteEntity from '../../types/note/database/NoteEntity'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'
import DeletedNoteEntity from '../../types/note/database/DeletedNoteEntity'
import DeletedNoteColumnEntity from '../../types/note/database/DeletedNoteColumnEntity'
import LogAppErrorEntity from '../../types/log_app_error/database/LogAppErrorEntity'
import CalendarEventEntity from '../../types/calendar/database/CalendarEventEntity'
import GlossaryItemEntity from '../../types/glossary/database/GlossaryItemEntity'

const DATABASE_NAME = 'DinoDatabase'
const DATABASE_VERSION = 2

class Database extends Dexie {
  note: Dexie.Table<NoteEntity, number>
  deletedNote: Dexie.Table<DeletedNoteEntity, number>
  noteColumn: Dexie.Table<NoteColumnEntity, number>
  deletedNoteColumn: Dexie.Table<DeletedNoteColumnEntity, number>
  logAppError: Dexie.Table<LogAppErrorEntity, number>
  calendarEvent: Dexie.Table<CalendarEventEntity, number>
  glossary: Dexie.Table<GlossaryItemEntity, number>

  constructor() {
    super(DATABASE_NAME)
    //Add only attributes that you will use in where clause
    this.version(DATABASE_VERSION).stores({
      note:
        '++id,external_id,order,question,answer,tagNames,lastUpdate,lastOrderUpdate,savedOnServer,columnTitle',
      deletedNote:
        '++id,external_id,order,question,answer,tagNames,lastUpdate,lastOrderUpdate,savedOnServer,columnTitle',
      noteColumn: '++id,external_id',
      deletedNoteColumn: '++id,external_id',
      logAppError: '++id,title,file,error,date',
      calendarEvent:
        '++id,external_id,name,description,color,init_date,end_date,reminder_alarm_ms,type',
      glossary: generateSynchronizableTableString([])
    })

    this.note = this.table('note')
    this.deletedNote = this.table('deletedNote')
    this.noteColumn = this.table('noteColumn')
    this.deletedNoteColumn = this.table('deletedNoteColumn')
    this.logAppError = this.table('logAppError')
    this.calendarEvent = this.table('calendarEvent')
    this.glossary = this.table('glossary')
  }
}

/**
 * Return param index concatenated with synchronizable basic indexes
 * @param attributes attributes to index
 */
const generateSynchronizableTableString = (attributes: string[]): string => {
  if (attributes.length > 0) {
    return '++localId,localState,id,' + attributes.join(',')
  }

  return '++localId,localState,id'
}

export default new Database()
