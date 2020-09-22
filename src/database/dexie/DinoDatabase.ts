import Dexie from 'dexie'
import NoteColumnEntity from './entities/INoteColumnEntity'
import Tables from './Tables'

const DATABASE_NAME = 'DinoDatabase'
const DATABASE_VERSION = 1

class DinoDatabase extends Dexie {
    public noteColumns: Dexie.Table<NoteColumnEntity, number>
 
    public constructor() {
        super(DATABASE_NAME)
        this.version(DATABASE_VERSION).stores({
          noteColumns: '++id,external_id,order,question,answer,tagNames,lastUpdate,lastOrderUpdate,savedOnServer,columnTitle',
        })
        this.noteColumns = this.table(Tables.NOTE_COLUMN)
    }
}

export default new DinoDatabase()