import Dexie from 'dexie'
import NoteEntity from '../../types/note/database/NoteEntity'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'
import LogAppErrorEntity from '../../types/log_app_error/database/LogAppErrorEntity'
import CalendarEventEntity from '../../types/calendar/database/CalendarEventEntity'
import GlossaryItemEntity from '../../types/glossary/database/GlossaryItemEntity'
import UserEntity from '../../types/user/database/UserEntity'

const DATABASE_NAME = 'DinoDatabase'
const DATABASE_VERSION = 2

class Database extends Dexie {
  note: Dexie.Table<NoteEntity, number>
  noteColumn: Dexie.Table<NoteColumnEntity, number>
  logAppError: Dexie.Table<LogAppErrorEntity, number>
  calendarEvent: Dexie.Table<CalendarEventEntity, number>
  glossary: Dexie.Table<GlossaryItemEntity, number>
  user: Dexie.Table<UserEntity, number>

  constructor() {
    super(DATABASE_NAME)

    /**
     * Add only attributes that you will use in where clause
    **/
    this.version(DATABASE_VERSION).stores({
      glossary: generateSynchronizableTableString(),
      note: generateSynchronizableTableString(['columnId', 'localColumnId']),
      noteColumn: generateSynchronizableTableString(),
      user: generateSynchronizableTableString(),
      logAppError: '++id,title,file,error,date',
      calendarEvent:
        '++id,external_id,name,description,color,init_date,end_date,reminder_alarm_ms,type',
    })

    this.user = this.table('user')
    this.glossary = this.table('glossary')
    this.note = this.table('note')
    this.noteColumn = this.table('noteColumn')
    this.logAppError = this.table('logAppError')
    this.calendarEvent = this.table('calendarEvent')
  }
}

/**
 * Return param index concatenated with synchronizable basic indexes
 * @param attributes attributes to index
 */
const generateSynchronizableTableString = (attributes?: string[]): string => {
  if (attributes && attributes.length > 0) {
    return '++localId,localState,id,' + attributes.join(',')
  }

  return '++localId,localState,id'
}

export default new Database()
