import NoteVersionLocalStorage from '../../local_storage/note/NoteVersionLocalStorage'
import NoteDoc from '../../types/note/database/NoteDoc'
import NoteDatabase from '../../database/note/NoteDatabase'
import DeletedNoteDatabase from '../../database/note/DeletedNoteDatabase'
import NoteSyncLocalStorage from '../../local_storage/note/NoteSyncLocalStorage'
import NoteContextUpdater from '../../context_updater/NoteContextUpdater'
import NoteServerService from './NoteServerService'
import { NoteColumnViewModel } from '../../types/note/view/NoteColumnViewModel'
import NoteConstants from '../../constants/NoteConstants'
import NoteWebSocketOrderUpdateModel from '../../types/note/web_socket/NoteWebSocketOrderUpdateModel'
import NoteWebSocketAlertDeleteModel from '../../types/note/web_socket/NoteWebSocketAlertDeleteModel'

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
    const updatedNote = await NoteDatabase.getById(note._id)

    if (updatedNote) {
      updatedNote.answer = note.answer
      updatedNote.question = note.question
      updatedNote.tagNames = note.tagNames
      updatedNote.savedOnServer = false
      updatedNote.lastUpdate = new Date().getTime()

      await NoteDatabase.put(updatedNote)

      this.saveNoteOnServer(note)
    }

    NoteContextUpdater.update()
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
      _id: '',
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

  saveNotesOnServer = async (notes: NoteDoc[]) => {
    const newVersion = await NoteServerService.saveAll(notes)

    if (newVersion !== null) {
      this.setVersion(newVersion)
    } else {
      this.setShouldSync(true)
    }
  }

  saveNotesOrder = async (noteDocs: NoteDoc[]) => {
    if (noteDocs.length > 0) {
      const updatedDocs = await this.getNotes()

      noteDocs.forEach((noteDoc, index) => {
        const updatedNote = updatedDocs.find(
          (updatedDoc) => updatedDoc._id === noteDoc._id
        )

        if (updatedNote) {
          updatedNote.order = index
          updatedNote.lastOrderUpdate = new Date().getTime()
          updatedNote.columnTitle = noteDoc.columnTitle
        }
      })

      await NoteDatabase.putAll(updatedDocs)

      this.saveOrderOnServer(updatedDocs)
    }
  }

  saveOrderOnServer = async (noteDocs?: NoteDoc[]): Promise<void> => {
    if (!noteDocs) {
      noteDocs = await this.getNotes()
    }

    const success = await NoteServerService.saveOrder(noteDocs)

    if (!success) {
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

  putAllDeletedNoteDatabase = async (docs: NoteDoc[]) => {
    await DeletedNoteDatabase.putAll(docs)
  }

  deleteAllDatabaseNotesByColumnTitle = async (
    columnTitle: string
  ): Promise<NoteDoc[]> => {
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
    const deletedNote = await DeletedNoteDatabase.getById(noteDoc._id)

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
  }

  checkQuestionConflict = (
    localVersion: NoteDoc,
    serverNotesDocs: NoteDoc[]
  ): boolean =>
    serverNotesDocs.some(
      (serverNote) =>
        serverNote.question === localVersion.question &&
        serverNote.lastUpdate !== localVersion.lastUpdate &&
        serverNote.external_id !== localVersion.external_id
    )

  updateNotesFromServer2 = async (newVersion: number) => {
    const localVersion = this.getVersion()
    if (newVersion > localVersion) {
      const serverData = await NoteServerService.get()

      if (serverData) {
        let maxOrder = 0
        const deletedNotes = await this.getDeletedNotes()
        const serverNotes: NoteDoc[] = []
        serverData.forEach((serverNote) => {
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
          serverNotes.push({
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

        const mergedNotes: NoteDoc[] = serverNotes

        for (const localVersion of localNotes) {
          let questionConflict = this.checkQuestionConflict(
            localVersion,
            serverNotes
          )

          while (questionConflict) {
            localVersion.question =
              localVersion.question + NoteConstants.SAME_QUESTION_CONFLICT_DIFF
            localVersion._id = NoteDatabase.getId(localVersion)

            questionConflict = this.checkQuestionConflict(
              localVersion,
              serverNotes
            )
          }

          const serverVersion = serverNotes.find(
            (serverNote) => serverNote.external_id === localVersion.external_id
          )

          if (serverVersion) {
            const localOrderMoreUpdated =
              localVersion.lastOrderUpdate > serverVersion.lastOrderUpdate

            const localDataMoreUpdated =
              localVersion.lastUpdate > serverVersion.lastUpdate

            serverVersion._id = localVersion._id

            if (localDataMoreUpdated) {
              serverVersion.question = localVersion.question
              serverVersion.lastUpdate = localVersion.lastUpdate
              serverVersion.answer = localVersion.answer
              serverVersion.tagNames = localVersion.tagNames
              serverVersion.savedOnServer = false
            }

            if (localOrderMoreUpdated) {
              serverVersion.lastOrderUpdate = localVersion.lastOrderUpdate
              serverVersion.order = localVersion.order
              serverVersion.columnTitle = localVersion.columnTitle
            }
          } else {
            const isUnsaved = !localVersion.savedOnServer

            if (isUnsaved) {
              maxOrder++

              localVersion.order = maxOrder

              mergedNotes.push(localVersion)
            }
          }
        }

        await NoteDatabase.removeAll()
        await NoteDatabase.putAll(mergedNotes)
        NoteContextUpdater.update()
        this.setVersion(newVersion)
      } else {
        this.setShouldSync(true)
      }
    }
  }

  updateNotesFromServer = async (newVersion: number) => {
    const localVersion = this.getVersion()
    if (newVersion > localVersion) {
      const serverData = await NoteServerService.get()

      if (serverData) {
        let maxOrder = 0
        const deletedNotes = await this.getDeletedNotes()
        const serverNotes: NoteDoc[] = []
        serverData.forEach((serverNote) => {
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
          serverNotes.push({
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

        const mergedNotes: NoteDoc[] = serverNotes

        for (const localVersion of localNotes) {
          let questionConflict = this.checkQuestionConflict(
            localVersion,
            serverNotes
          )

          while (questionConflict) {
            localVersion.question =
              localVersion.question + NoteConstants.SAME_QUESTION_CONFLICT_DIFF
            localVersion._id = NoteDatabase.getId(localVersion)

            questionConflict = this.checkQuestionConflict(
              localVersion,
              serverNotes
            )
          }

          const serverVersion = serverNotes.find(
            (serverNote) => serverNote.external_id === localVersion.external_id
          )

          if (serverVersion) {
            const localOrderMoreUpdated =
              localVersion.lastOrderUpdate > serverVersion.lastOrderUpdate

            const localDataMoreUpdated =
              localVersion.lastUpdate > serverVersion.lastUpdate

            serverVersion._id = localVersion._id

            if (localDataMoreUpdated) {
              serverVersion.question = localVersion.question
              serverVersion.lastUpdate = localVersion.lastUpdate
              serverVersion.answer = localVersion.answer
              serverVersion.tagNames = localVersion.tagNames
              serverVersion.savedOnServer = false
            }

            if (localOrderMoreUpdated) {
              serverVersion.lastOrderUpdate = localVersion.lastOrderUpdate
              serverVersion.order = localVersion.order
              serverVersion.columnTitle = localVersion.columnTitle
            }
          } else {
            const isUnsaved = !localVersion.savedOnServer

            if (isUnsaved) {
              maxOrder++

              localVersion.order = maxOrder

              mergedNotes.push(localVersion)
            }
          }
        }

        await NoteDatabase.removeAll()
        await NoteDatabase.putAll(mergedNotes)
        NoteContextUpdater.update()
        this.setVersion(newVersion)
      } else {
        this.setShouldSync(true)
      }
    }
  }

  updateNotesOrderFromServer = async (model: NoteWebSocketOrderUpdateModel) => {
    const docs = await this.getNotes()
    let updated = false

    docs.forEach((doc) => {
      const serverItem = model.items.find((item) => item.id === doc.external_id)
      if (serverItem) {
        const serverOrderMoreUpdated =
          serverItem.lastOrderUpdate > doc.lastOrderUpdate
        if (serverOrderMoreUpdated) {
          doc.order = serverItem.order
          doc.lastOrderUpdate = serverItem.lastOrderUpdate
          doc.columnTitle = serverItem.columnTitle
          updated = true
        }
      }
    })

    if (updated) {
      await NoteDatabase.putAll(docs)

      this.updateContext()
    }
  }

  updateDeletedNotesFromServer = async (
    model: NoteWebSocketAlertDeleteModel
  ) => {
    const localVersion = this.getVersion()

    if (model.newVersion > localVersion && model.idList) {
      const notes = await this.getNotes()

      const deletedNotes = notes.filter((note) =>
        model.idList.some((id) => id === note.external_id)
      )

      for (const deletedNote of deletedNotes) {
        await NoteDatabase.deleteByDoc(deletedNote)
      }

      this.setVersion(model.newVersion)

      this.updateContext()
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
