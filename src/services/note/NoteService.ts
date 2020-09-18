import NoteVersionLocalStorage from '../../local_storage/note/NoteVersionLocalStorage'
import NoteSaveModel from '../../types/note/server/NoteSaveRequestModel'
import NoteDoc from '../../types/note/database/NoteDoc'
import NoteDatabase from '../../database/note/NoteDatabase'
import DeletedNoteDatabase from '../../database/note/DeletedNoteDatabase'
import NoteSyncLocalStorage from '../../local_storage/note/NoteSyncLocalStorage'
import NoteContextUpdater from '../../context_updater/NoteContextUpdater'
import NoteServerService from './NoteServerService'
import { NoteColumnViewModel } from '../../types/note/view/NoteColumnViewModel'

class NoteService {
  //#region GET

  getNotes = async (): Promise<NoteDoc[]> => {
    const docs = await NoteDatabase.getAll()

    return docs
  }

  getDeletedNotes = async (): Promise<NoteDoc[]> => {
    return DeletedNoteDatabase.getAll()
  }

  getTags = async (): Promise<string[]> => {
    return NoteDatabase.getAllTags()
  }

  getVersion = (): number => NoteVersionLocalStorage.getVersion()

  getVersionFromServer = async (): Promise<number | undefined> => {
    return NoteServerService.getVersion()
  }

  //#endregion

  //#region SAVE

  setVersion = (version: number) => {
    NoteVersionLocalStorage.setVersion(version)
  }

  saveNote = async (note: NoteDoc) => {
    note.savedOnServer = false
    note.lastUpdate = new Date().getTime()

    await NoteDatabase.put(note)

    NoteContextUpdater.update()

    this.saveNoteOnServer(note)
  }

  createNote = async (
    question: string,
    tagNames: string[],
    colunm: NoteColumnViewModel
  ) => {
    const date = new Date().getTime()

    const note: NoteDoc = {
      answer: '',
      question: question,
      tagNames: tagNames,
      lastUpdate: date,
      lastOrderUpdate: date,
      savedOnServer: false,
      order: colunm.notes.length,
      columnTitle: colunm.title,
      _rev: '',
      _id: ''
    }

    await NoteDatabase.put(note)

    NoteContextUpdater.update()

    this.saveNoteOnServer(note)
  }

  saveNoteOnServer = async (noteModel: NoteDoc) => {
    const newVersion = await NoteServerService.save(noteModel)

    if (newVersion !== null) {
      this.setVersion(newVersion)
    } else {
      this.setShouldSync(true)
    }
  }

  saveNotesOnServer = async (models: NoteSaveModel[]) => {
    const newVersion = await NoteServerService.saveAll(models)

    if (newVersion !== null) {
      this.setVersion(newVersion)
    } else {
      this.setShouldSync(true)
    }
  }

  saveNotesOrder = async (noteDocs: NoteDoc[]) => {
    if (noteDocs.length > 0) {
      noteDocs.forEach(noteDoc => {
        noteDoc.lastOrderUpdate = new Date().getTime()
      })

      await NoteDatabase.putAll(noteDocs)

      this.saveOrderOnServer(noteDocs)
    }
  }

  saveOrderOnServer = async (noteDocs: NoteDoc[]): Promise<void> => {
    const newVersion = await NoteServerService.saveOrder(noteDocs)

    if (newVersion !== null) {
      this.setVersion(newVersion)
    } else {
      NoteSyncLocalStorage.setShouldSync(true)
    }
  }

  //#endregion

  //#region DELETE

  removeUserData = () => {
    NoteVersionLocalStorage.removeUserData()
    NoteSyncLocalStorage.removeUserData()
    NoteDatabase.removeAll()
    DeletedNoteDatabase.removeAll()
  }

  deleteAllDatabaseNotesByColumnTitle = async (columnTitle: string): Promise<number> => {
    const deletedNotes = await NoteDatabase.deleteByColumnTitle(columnTitle)

    NoteContextUpdater.update()
    
    return deletedNotes
  }

  deleteNote = async (note: NoteDoc) => {
    await NoteDatabase.deleteByDoc(note)

    NoteContextUpdater.update()

    this.deleteNoteOnServer(note)
  }

  deleteNotesOnServer = async () => {
    const deletedDocs = await this.getDeletedNotes()

    if (deletedDocs.length > 0) {
      const newVersion = await NoteServerService.deleteAll(deletedDocs)

      if (newVersion !== null) {
        DeletedNoteDatabase.removeAll()
        this.setVersion(newVersion)
      } else {
        NoteSyncLocalStorage.setShouldSync(true)
      }
    }
  }

  private deleteNoteOnServer = async (noteDoc: NoteDoc) => {
    const deletedNote = await DeletedNoteDatabase.getByDoc(noteDoc)

    if (!deletedNote && noteDoc.external_id) {
      const newVersion = await NoteServerService.delete(noteDoc.external_id)

      if (newVersion !== null) {
        DeletedNoteDatabase.deleteByDoc(noteDoc)
        this.setVersion(newVersion)
      } else {
        await DeletedNoteDatabase.putNew(noteDoc)
        NoteSyncLocalStorage.setShouldSync(true)
      }
    }
  }

  //#endregion

  //#region UPDATE

  updateContext = () => {
    NoteContextUpdater.update()
  }

  updateNoteColumnTitle = async (newTitle: string, oldTitle: string) => {
    await NoteDatabase.updateColumnTitle(newTitle, oldTitle)
    
    NoteContextUpdater.update()
  }

  updateNotesFromServer = async (newVersion: number) => {
    const localVersion = this.getVersion()
    
    if (newVersion > localVersion) {
      const serverNotes = await NoteServerService.get()

      if (serverNotes) {
        let maxOrder = 0

        const deletedNotes = await this.getDeletedNotes()
        const serverNotesDocs: NoteDoc[] = []

        serverNotes.forEach((serverNote) => {
          if (serverNote.order > maxOrder) {
            maxOrder = serverNote.order
          }
          const localDeletedSearch = deletedNotes.filter(
            (deletedNote) => deletedNote.external_id === serverNote.id
          )
          if (localDeletedSearch.length > 0) {
            const localDeleted = localDeletedSearch[0]
            if (localDeleted.lastUpdate > serverNote.lastUpdate) {
              return
            } else {
              DeletedNoteDatabase.deleteByDoc(localDeleted)
            }
          }
          serverNotesDocs.push({
            external_id: serverNote.id,
            order: serverNote.order,
            answer: serverNote.answer,
            lastUpdate: serverNote.lastUpdate,
            lastOrderUpdate: serverNote.lastOrderUpdate,
            question: serverNote.question,
            tagNames: serverNote.tags,
            savedOnServer: true,
            columnTitle: serverNote.columnTitle,
          } as NoteDoc)
        })

        const localNotes = await this.getNotes()

        await NoteDatabase.removeAll()

        await NoteDatabase.putAll(serverNotesDocs)

        const mergedNotes = localNotes.filter((doc) => {
          const serverVersionSearch = serverNotesDocs.filter((serverNote) =>
            serverNote.question === doc.question
          )
          if (serverVersionSearch.length > 0) {
            const serverVersion = serverVersionSearch[0]
            const localOrderMoreUpdated = serverVersion.lastOrderUpdate < doc.lastOrderUpdate
            if (serverVersion.lastUpdate > doc.lastUpdate) {
              if (localOrderMoreUpdated) {
                serverVersion.order = doc.order
                serverVersion.columnTitle = doc.columnTitle
                serverVersion.lastOrderUpdate = doc.lastOrderUpdate
              }
              return serverVersion
            } else {
              if (!localOrderMoreUpdated) {
                doc.order = serverVersion.order
                doc.columnTitle = serverVersion.columnTitle
                doc.lastOrderUpdate = serverVersion.lastOrderUpdate
              }
              return doc
            }
          } else {
            maxOrder++

            doc.order = maxOrder

            return doc
          }
        })

        await NoteDatabase.putAll(mergedNotes)

        if (newVersion !== null) {
          this.setVersion(newVersion)
        } 

        NoteContextUpdater.update()
      } else {
        NoteSyncLocalStorage.setShouldSync(true)
      }
    }
  }

  //#endregion

  //#region SYNC

  shouldSync = (): boolean => {
    return NoteSyncLocalStorage.getShouldSync()
  }

  setShouldSync = (should: boolean) => {
    return NoteSyncLocalStorage.setShouldSync(should)
  }

  //#endregion

  //#region VALIDATE

  questionAlreadyExists = async (question: string): Promise<boolean> => {
    const note = await NoteDatabase.getByQuestion(question)

    if (note) {
      return true
    }

    return false
  }

  //#endregion
}

export default new NoteService()
