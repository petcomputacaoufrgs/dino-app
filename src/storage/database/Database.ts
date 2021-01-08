import Dexie from 'dexie'
import NoteEntity from '../../types/note/database/NoteEntity'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'
import LogAppErrorEntity from '../../types/log_app_error/database/LogAppErrorEntity'
import CalendarEventEntity from '../../types/calendar/database/CalendarEventEntity'
import GlossaryItemEntity from '../../types/glossary/database/GlossaryItemEntity'
import UserEntity from '../../types/user/database/UserEntity'
import ContactEntity from '../../types/contact/database/ContactEntity'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import GoogleContactEntity from '../../types/contact/database/GoogleContactEntity'
import FaqEntity from '../../types/faq/database/FaqEntity'
import FaqItemEntity from '../../types/faq/database/FaqItemEntity'
import FaqUserQuestionEntity from '../../types/faq/database/FaqUserQuestionEntity'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import UserSettingsEntity from '../../types/user/database/UserSettingsEntity'
import GoogleScopeEntity from '../../types/auth/google/database/GoogleScopeEntity'
import AuthEntity from '../../types/auth/database/AuthEntity'

const DATABASE_NAME = 'DinoDatabase'
const DATABASE_VERSION = 3

class Database extends Dexie {
  auth: Dexie.Table<AuthEntity, number>
  userSettings: Dexie.Table<UserSettingsEntity, number>
  note: Dexie.Table<NoteEntity, number>
  noteColumn: Dexie.Table<NoteColumnEntity, number>
  logAppError: Dexie.Table<LogAppErrorEntity, number>
  calendarEvent: Dexie.Table<CalendarEventEntity, number>
  glossary: Dexie.Table<GlossaryItemEntity, number>
  contact: Dexie.Table<ContactEntity, number>
  googleContact: Dexie.Table<GoogleContactEntity, number>
  phone: Dexie.Table<PhoneEntity, number>
  user: Dexie.Table<UserEntity, number>
  faq: Dexie.Table<FaqEntity, number>
  faqItem: Dexie.Table<FaqItemEntity, number>
  faqUserQuestion: Dexie.Table<FaqUserQuestionEntity, number>
  treatment: Dexie.Table<TreatmentEntity, number>
  googleScope: Dexie.Table<GoogleScopeEntity, number>

  constructor() {
    super(DATABASE_NAME)

    /**
     * Add only attributes that you will use in where clause
     **/
    this.version(DATABASE_VERSION).stores({
      userSettings: generateSynchronizableTableString(),
      glossary: generateSynchronizableTableString(),
      contact: generateSynchronizableTableString(),
      googleContact: generateSynchronizableTableString(),
      phone: generateSynchronizableTableString('localContactId'),
      noteColumn: generateSynchronizableTableString(),
      note: generateSynchronizableTableString('columnId', 'localColumnId'),
      user: generateSynchronizableTableString(),
      faq: generateSynchronizableTableString('localTreatmentId'),
      faqItem: generateSynchronizableTableString('localFaqId'),
      faqUserQuestion: generateSynchronizableTableString(),
      treatment: generateSynchronizableTableString(),
      googleScope: generateSynchronizableTableString('name'),
      auth: '++id',
      logAppError: '++id,title,file,error,date',
      calendarEvent:
        '++id,external_id,name,description,color,init_date,end_date,reminder_alarm_ms,type',
    })

    this.auth = this.table('auth')
    this.userSettings = this.table('userSettings')
    this.user = this.table('user')
    this.glossary = this.table('glossary')
    this.contact = this.table('contact')
    this.googleContact = this.table('googleContact')
    this.phone = this.table('phone')
    this.note = this.table('note')
    this.noteColumn = this.table('noteColumn')
    this.faq = this.table('faq')
    this.faqItem = this.table('faqItem')
    this.faqUserQuestion = this.table('faqUserQuestion')
    this.logAppError = this.table('logAppError')
    this.calendarEvent = this.table('calendarEvent')
    this.treatment = this.table('treatment')
    this.googleScope = this.table('googleScope')
  }
}

/**
 * Return param index concatenated with synchronizable basic indexes
 * @param attributes attributes to index
 */
const generateSynchronizableTableString = (...attributes: string[]): string => {
  const basic = '++localId,localState,id'
  if (attributes && attributes.length > 0) {
    return basic + ',' + attributes.join(',')
  }

  return basic
}

export default new Database()
