import NoteVersionLocalStorage from '../../local_storage/NoteVersionLocalStorage'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import NoteSaveModel from '../../types/note/NoteSaveModel'
import NoteSaveResponseModel from '../../types/note/NoteSaveResponseModel'
import NoteOrderAPIModel from '../../types/note/NoteOrderAPIModel'
import NoteDeleteModel from '../../types/note/NoteDeleteModel'
import NoteDoc from '../../types/note/database/NoteDoc'
import NoteDatabase from '../../database/NoteDatabase'
import DeletedNoteDatabase from '../../database/DeletedNoteDatabase'
import DinoAgentService from '../../agent/DinoAgentService'
import NoteSyncLocalStorage from '../../local_storage/NoteSyncLocalStorage'
import NoteModel from '../../types/note/NoteModel'
import NoteContextUpdater from '../../context_updater/NoteContextUpdater'
import NoteViewModel from '../../types/note/NoteViewModel'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import StringUtils from '../../utils/StringUtils'

class NoteService {
  //#region GET

  getNotes = async (): Promise<NoteDoc[]> => {
    const noteDocs = await NoteDatabase.getAll()

    return noteDocs
  }

  getDatabaseNotes = async (): Promise<NoteDoc[]> => {
    return NoteDatabase.getAll()
  }

  getDeletedNotes = async (): Promise<NoteDoc[]> => {
    return DeletedNoteDatabase.getAll()
  }

  getTags = async (): Promise<string[]> => {
    return NoteDatabase.getAllTags()
  }

  getVersion = (): number => NoteVersionLocalStorage.getVersion()

  getVersionFromServer = async (): Promise<number | undefined> => {
    const request = await DinoAgentService.get(
      DinoAPIURLConstants.NOTE_GET_VERSION
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()

        const serverVersion: number = response.body

        return serverVersion
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return undefined
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

  createNote = async (question: string, tagNames: string[], answer: string, order: number) => {
    const date = new Date().getTime()

    const note: NoteDoc = {
      answer: answer,
      question: question,
      tagNames: tagNames,
      lastUpdate: date,
      savedOnServer: false,
      order: order,
      _rev: '',
    }

    await NoteDatabase.put(note)

    NoteContextUpdater.update()

    this.saveNoteOnServer(note)
  }

  saveNoteOnServer = async (noteModel: NoteDoc) => {
    const noteSaveModel: NoteSaveModel = {
      answer: noteModel.answer,
      question: noteModel.question,
      lastUpdate: noteModel.lastUpdate,
      tagNames: noteModel.tagNames,
      id: noteModel.external_id,
      order: noteModel.order
    }

    const request = await DinoAgentService.post(DinoAPIURLConstants.NOTE_SAVE)

    if (request.canGo) {
      try {
        const response = await request
          .authenticate()
          .setBody(noteSaveModel)
          .go()
        const body: NoteSaveResponseModel = response.body
        const noteDoc = await NoteDatabase.getByQuestion(noteModel.question)
        if (noteDoc) {
          noteDoc.savedOnServer = true
          noteDoc.external_id = body.id
          await NoteDatabase.put(noteDoc)
          NoteContextUpdater.update()
          this.setVersion(body.userNoteVersion)
          return
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    NoteSyncLocalStorage.setShouldSync(true)
  }

  saveNotesOnServer = async (models: NoteSaveModel[]) => {
    const request = await DinoAgentService.put(
      DinoAPIURLConstants.NOTE_UPDATE_ALL
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(models).go()
        const newVersion = response.body
        const promises = models.map(async (model) => {
          const noteDoc = await NoteDatabase.getByQuestion(model.question)
          if (noteDoc) {
            noteDoc.savedOnServer = true
            NoteDatabase.put(noteDoc)
          }
        })
        await Promise.all(promises)
        NoteContextUpdater.update()
        this.setVersion(newVersion)
        return
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    this.setShouldSync(true)
  }

  //#endregion

  //#region DELETE

  removeUserData = () => {
    NoteVersionLocalStorage.removeUserData()
    NoteSyncLocalStorage.removeUserData()
    NoteDatabase.removeAll()
    DeletedNoteDatabase.removeAll()
  }

  deleteNote = async (note: NoteDoc) => {
    await NoteDatabase.deleteByNoteDoc(note)

    NoteContextUpdater.update()
    
    if (note.external_id) {
      const deletedNote = await DeletedNoteDatabase.getById(note)
      if (!deletedNote) {
        await DeletedNoteDatabase.putNew(note)
        this.deleteNoteOnServer(note)
      }
    }
  }

  deleteNotesOnServer = async () => {
    const deletedDocs = await this.getDeletedNotes()

    if (deletedDocs.length === 0) {
      return
    }

    const models = deletedDocs.map(
      (doc) =>
        ({
          id: doc.external_id,
        } as NoteDeleteModel)
    )

    const request = await DinoAgentService.delete(
      DinoAPIURLConstants.NOTE_DELETE_ALL
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(models).go()
        const newVersion = response.body
        DeletedNoteDatabase.removeAll()
        NoteVersionLocalStorage.setVersion(newVersion)
        return
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    NoteSyncLocalStorage.setShouldSync(true)
  }

  private deleteNoteOnServer = async (noteDoc: NoteDoc) => {
    if (noteDoc.external_id) {
      const model: NoteDeleteModel = { id: noteDoc.external_id }

      const request = await DinoAgentService.delete(
        DinoAPIURLConstants.NOTE_DELETE
      )

      if (request.canGo) {
        try {
          const response = await request.authenticate().setBody(model).go()
          const newVersion = response.body

          DeletedNoteDatabase.deleteByNoteDoc(noteDoc)
          NoteVersionLocalStorage.setVersion(newVersion)
          return
        } catch (e) {
          LogAppErrorService.saveError(e)
        }
      }
      NoteSyncLocalStorage.setShouldSync(true)
    }
  }

  //#endregion

  //#region UPDATE

  updateNotesOrder = async (viewNotes: NoteViewModel[]) => {
    const noteDocs = await NoteDatabase.getAll()

    if (noteDocs.length > 0) {
      noteDocs.forEach((noteDoc) => {
        const newOrder = viewNotes.findIndex(
          (n) => n.question === noteDoc.question
        )

        noteDoc.order = newOrder
      })

      await NoteDatabase.putAll(noteDocs)

      this.updateOrderOnServer(noteDocs)
    }
  }

  updateOrderOnServer = async (noteDocs: NoteDoc[]): Promise<void> => {
    const model: NoteOrderAPIModel[] = []

    noteDocs.forEach((note) => {
      if (note.external_id) {
        model.push({
          id: note.external_id,
          order: note.order,
        } as NoteOrderAPIModel)
      }
    })

    const request = await DinoAgentService.put(DinoAPIURLConstants.NOTE_ORDER)

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(model).go()
        NoteVersionLocalStorage.setVersion(response.body)
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    NoteSyncLocalStorage.setShouldSync(true)
  }

  updateNotesFromServer = async (newVersion: number) => {
    const localVersion = this.getVersion()

    if (newVersion > localVersion) {
      const request = await DinoAgentService.get(DinoAPIURLConstants.NOTE_GET)

      if (request.canGo) {
        try {
          let maxOrder = 0
          const deletedNotes = await this.getDeletedNotes()

          const response = await request.authenticate().go()
          const serverNotes: NoteModel[] = response.body
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
                DeletedNoteDatabase.deleteByNoteDoc(localDeleted)
              }
            }

            serverNotesDocs.push({
              external_id: serverNote.id,
              order: serverNote.order,
              answer: serverNote.answer,
              lastUpdate: serverNote.lastUpdate,
              question: serverNote.question,
              tagNames: serverNote.tags,
              savedOnServer: true,
            } as NoteDoc)
          })

          const localNotes = await this.getDatabaseNotes()

          await NoteDatabase.removeAll()

          await NoteDatabase.putAll(serverNotesDocs)

          const newNotes = localNotes.filter((doc) => {
            const serverVersionSearch = serverNotesDocs.filter(
              (serverNote) =>
                StringUtils.areEqual(serverNote.question, doc.question)
            )

            if (serverVersionSearch.length > 0) {
              const serverVersion = serverVersionSearch[0]
              if (serverVersion.lastUpdate > doc.lastUpdate) {
                return serverVersion
              }
            } 

            maxOrder++
            return {
              answer: doc.answer,
              lastUpdate: doc.lastUpdate,
              question: doc.question,
              tagNames: doc.tagNames,
              savedOnServer: doc.savedOnServer,
              order: maxOrder,
            } as NoteDoc
          })

          await NoteDatabase.putAll(newNotes)

          this.setVersion(newVersion)

          NoteContextUpdater.update()
          return
        } catch (e) {
          LogAppErrorService.saveError(e)
        }
      }
      NoteSyncLocalStorage.setShouldSync(true)
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
