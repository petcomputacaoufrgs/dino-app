import NoteVersionLocalStorage from '../../local_storage/NoteVersionLocalStorage'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import NoteSaveModel from '../../types/note/NoteSaveModel'
import NoteSaveResponseModel from '../../types/note/NoteSaveResponseModel'
import NoteOrderAPIModel from '../../types/note/NoteOrderAPIModel'
import NoteDeleteModel from '../../types/note/NoteDeleteModel'
import NoteQuestionModel from '../../types/note/NoteQuestionModel'
import NoteAPIAnswerModel from '../../types/note/NoteAnswerModel'
import NoteDoc from '../../types/note/database/NoteDoc'
import NoteDatabase from '../../database/NoteDatabase'
import DeletedNoteDatabase from '../../database/DeletedNoteDatabase'
import DinoAgentService from '../../agent/DinoAgentService'
import NoteSyncLocalStorage from '../../local_storage/NoteSyncLocalStorage'
import NoteUpdateModel from '../../types/note/NoteUpdateModel'
import NoteModel from '../../types/note/NoteModel'
import NoteContextUpdater from '../../context_updater/NoteContextUpdater'
import NoteViewModel from '../../types/note/NoteViewModel'
import { NoteContextType } from '../../types/context_provider/NotesContextType'
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

  //#endregion

  //#region SAVE

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

  setVersion = (version: number) => {
    NoteVersionLocalStorage.setVersion(version)
  }

  saveNote = async (noteModel: NoteContextType) => {
    const noteDoc: NoteDoc = {
      answer: noteModel.answer,
      answered: noteModel.answered,
      lastUpdate: noteModel.lastUpdate,
      question: noteModel.question,
      savedOnServer: false,
      order: noteModel.id,
      tagNames: noteModel.tagNames,
      _rev: '',
    }

    await NoteDatabase.put(noteDoc)

    NoteContextUpdater.update()

    this.saveNoteOnServer(noteModel)
  }

  saveNoteOnServer = async (noteModel: NoteContextType) => {
    const newNote: NoteSaveModel = {
      order: noteModel.id,
      question: noteModel.question,
      lastUpdate: noteModel.lastUpdate,
      tagNames: noteModel.tagNames,
      answered: false,
      id: 0,
    }

    const request = await DinoAgentService.post(DinoAPIURLConstants.NOTE_SAVE)

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(newNote).go()
        const body: NoteSaveResponseModel = response.body
        const noteDoc = await NoteDatabase.getByQuestion(noteModel.question)
        if (noteDoc) {
          noteDoc.savedOnServer = true
          noteDoc.external_id = body.noteId
          await NoteDatabase.put(noteDoc)
          NoteContextUpdater.update()
          this.setVersion(body.version)
          return
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    NoteSyncLocalStorage.setShouldSync(true)
  }

  //#endregion

  //#region DELETE

  removeUserData = () => {
    NoteVersionLocalStorage.removeUserData()
    NoteSyncLocalStorage.removeUserData()
    NoteDatabase.removeAll()
    DeletedNoteDatabase.removeAll()
  }

  deleteNote = async (noteModel: NoteContextType) => {
    const noteDoc = await NoteDatabase.getByQuestion(noteModel.question)

    if (noteDoc) {
      await NoteDatabase.deleteByNoteDoc(noteDoc)

      NoteContextUpdater.update()

      if (noteDoc.external_id) {
        const deletedNote = await DeletedNoteDatabase.getByQuestion(
          noteDoc.question
        )

        if (!deletedNote) {
          await DeletedNoteDatabase.putNew(noteDoc)

          this.deleteNoteOnServer(noteDoc)
        }
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
          const deletedNote = await DeletedNoteDatabase.getByQuestion(
            noteDoc.question
          )
          if (deletedNote) {
            DeletedNoteDatabase.deleteByNoteDoc(deletedNote)
          }
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

  //#region SAVE & UPDATE

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

  updateNotes = async (models: NoteUpdateModel[]) => {
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

  updateNoteQuestion = async (
    oldQuestion: string,
    noteModel: NoteContextType
  ) => {
    const noteDoc = await NoteDatabase.getByQuestion(oldQuestion)

    if (noteDoc) {
      noteDoc.question = noteModel.question
      noteDoc.tagNames = noteModel.tagNames
      noteDoc.lastUpdate = noteModel.lastUpdate
      noteDoc.savedOnServer = false

      await NoteDatabase.put(noteDoc)

      NoteContextUpdater.update()

      this.updateNoteQuestionOnServer(noteDoc)
    }
  }

  private updateNoteQuestionOnServer = async (noteDoc: NoteDoc) => {
    if (noteDoc.external_id) {
      const model: NoteQuestionModel = {
        id: noteDoc.external_id,
        question: noteDoc.question,
        tagNames: noteDoc.tagNames,
        lastUpdate: noteDoc.lastUpdate,
        answered: noteDoc.answered,
      }

      const request = await DinoAgentService.put(
        DinoAPIURLConstants.NOTE_UPDATE_QUESTION
      )

      if (request.canGo) {
        try {
          const response = await request.authenticate().setBody(model).go()
          const savedNoteDoc = await NoteDatabase.getByQuestion(
            noteDoc.question
          )
          if (savedNoteDoc) {
            savedNoteDoc.savedOnServer = true
            NoteDatabase.put(savedNoteDoc)
            NoteVersionLocalStorage.setVersion(response.body)
          }
          return
        } catch (e) {
          LogAppErrorService.saveError(e)
        }
      }
    }

    return NoteSyncLocalStorage.setShouldSync(true)
  }

  updateNoteAnswer = async (noteModel: NoteContextType) => {
    const noteDoc = await NoteDatabase.getByQuestion(noteModel.question)

    if (noteDoc) {
      noteDoc.answer = noteModel.answer
      noteDoc.answered = noteModel.answered
      noteDoc.savedOnServer = false

      await NoteDatabase.put(noteDoc)

      NoteContextUpdater.update()

      this.updateNoteAnswerOnServer(noteDoc)
    }
  }

  updateNoteAnswerOnServer = async (noteDoc: NoteDoc) => {
    if (noteDoc.external_id) {
      const model: NoteAPIAnswerModel = {
        id: noteDoc.external_id,
        answer: noteDoc.answer,
      }

      const request = await DinoAgentService.put(
        DinoAPIURLConstants.NOTE_UPDATE_ANSWER
      )

      if (request.canGo) {
        try {
          const response = await request.authenticate().setBody(model).go()
          const savedNoteDoc = await NoteDatabase.getByQuestion(
            noteDoc.question
          )
          if (savedNoteDoc) {
            savedNoteDoc.savedOnServer = true
            await NoteDatabase.put(savedNoteDoc)
            NoteContextUpdater.update()
            NoteVersionLocalStorage.setVersion(response.body)
          }
          return
        } catch (e) {
          LogAppErrorService.saveError(e)
        }
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
          const serverNotesDocs: NoteDoc[] = [];

          serverNotes.forEach(
            (serverNote) => {
              if (serverNote.order > maxOrder) {
                maxOrder = serverNote.order
              }

              const localDeletedSearch = deletedNotes.filter(deletedNote => deletedNote.external_id === serverNote.id)

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
                answered: serverNote.answered,
                lastUpdate: serverNote.lastUpdate,
                question: serverNote.question,
                tagNames: serverNote.tags,
                savedOnServer: true,
              } as NoteDoc)
            }  
          )
          
          const localNotes = await this.getDatabaseNotes()

          await NoteDatabase.removeAll()

          const localUnsavedNotes = localNotes.filter((localDoc) => {
            if (!localDoc.savedOnServer) {
              const existsUpdatedOnServer = serverNotesDocs.some(serverDoc =>
                StringUtils.areEqual(serverDoc.question, localDoc.question)
                && serverDoc.lastUpdate >= localDoc.lastUpdate
              )

              return !existsUpdatedOnServer
            }

            return false
          })

          const newNotes = serverNotesDocs.concat(localUnsavedNotes.map(doc => {
            maxOrder++

            return {
              answer: doc.answer,
              answered: doc.answered,
              lastUpdate: doc.lastUpdate,
              question: doc.question,
              tagNames: doc.tagNames,
              savedOnServer: doc.savedOnServer,
              order: maxOrder
            } as NoteDoc
          }))

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
