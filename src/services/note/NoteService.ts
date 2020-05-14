import NoteViewModel from '../../views/main/notes/model/NoteViewModel'
import NoteVersionLocalStorage from './local_storage/NoteVersionLocalStorage'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import NoteSaveModel from './api_model/NoteSaveModel'
import NoteSaveResponseAPIModel from './api_model/NoteSaveResponseAPIModel'
import NoteOrderAPIModel from './api_model/NoteOrderAPIModel'
import NoteDeleteModel from './api_model/NoteDeleteModel'
import NoteQuestionModel from './api_model/NoteQuestionModel'
import NoteAPIAnswerModel from './api_model/NoteAnswerModel'
import NoteDoc from './database/docs/NoteDoc'
import NoteDatabase from './database/NoteDatabase'
import DeletedNoteDatabase from './database/DeletedNoteDatabase'
import DinoAgentService from '../dino_agent/DinoAgentService'
import NoteSyncLocalStorage from './local_storage/NoteSyncLocalStorage'
import DinoAgentStatus from '../dino_agent/model/DinoAgentStatus'
import NoteUpdateModel from './api_model/NoteUpdateModel'

class NoteService {
  //#region GET

  getNotes = async (): Promise<NoteViewModel[]> => {
    const noteDocs = await NoteDatabase.getAll()

    const viewModels = noteDocs
      .sort((n1, n2) => n1.order - n2.order)
      .map(
        (note) =>
          ({
            id: note.order,
            answer: note.answer,
            answered: note.answered,
            lastUpdate: note.lastUpdate,
            question: note.question,
            tagNames: note.tagNames,
            savedOnServer: note.savedOnServer,
            showByQuestion: true,
            showByTag: true,
          } as NoteViewModel)
      )

    return viewModels
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
    const request = DinoAgentService.get(DinoAPIURLConstants.NOTE_GET_VERSION)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get()

        if (response.status === HttpStatus.OK) {
          const serverVersion: number = response.body

          return serverVersion
        }
      } catch {
        /**TO-DO Salvar log com o erro*/
      }
    }

    return undefined
  }

  setVersion = (version: number) => {
    NoteVersionLocalStorage.setVersion(version)
  }

  saveNote = async (noteModel: NoteViewModel, updateState: () => void) => {
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

    this.saveNoteOnServer(noteModel)

    await NoteDatabase.put(noteDoc)

    if (updateState) {
      updateState()
    }
  }

  saveNoteOnServer = async (noteModel: NoteViewModel) => {
    const newNote: NoteSaveModel = {
      order: noteModel.id,
      question: noteModel.question,
      lastUpdate: noteModel.lastUpdate,
      tagNames: noteModel.tagNames,
    }

    const request = DinoAgentService.post(DinoAPIURLConstants.NOTE_SAVE)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get().send(newNote)

        if (response.status === HttpStatus.OK) {
          const body: NoteSaveResponseAPIModel = response.body

          const noteDoc = await NoteDatabase.getByQuestion(noteModel.question)

          if (noteDoc) {
            noteDoc.savedOnServer = true
            noteDoc.external_id = body.noteId

            await NoteDatabase.put(noteDoc)
            NoteVersionLocalStorage.setVersion(body.version)
          }

          return
        }
      } catch {
        /**TO-DO Fazer log de erro */
      }
    }

    NoteSyncLocalStorage.setShouldSync(true)
  }

  //#endregion

  //#region DELETE

  removeUserData = () => {
    NoteVersionLocalStorage.removeVersion()
    NoteSyncLocalStorage.removeShouldSync()
    NoteDatabase.removeAll()
    DeletedNoteDatabase.removeAll()
  }

  deleteNote = async (noteModel: NoteViewModel, updateState: () => {}) => {
    const noteDoc = await NoteDatabase.getByQuestion(noteModel.question)

    if (noteDoc) {
      await NoteDatabase.deleteByNoteDoc(noteDoc)

      if (noteDoc.external_id) {
        const deletedNote = await DeletedNoteDatabase.getByQuestion(
          noteDoc.question
        )

        if (!deletedNote) {
          await DeletedNoteDatabase.putNew(noteDoc)

          this.deleteNoteOnServer(noteDoc)
        }
      }

      if (updateState) {
        updateState()
      }
    }
  }

  deleteNotesOnServer = async () => {
    const deletedDocs = await this.getDeletedNotes()

    const models = deletedDocs.map(
      (doc) =>
        ({
          id: doc.external_id,
        } as NoteDeleteModel)
    )

    const request = DinoAgentService.delete(DinoAPIURLConstants.NOTE_DELETE_ALL)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get().send(models)

        if (response.status === HttpStatus.OK) {
          const newVersion = response.body

          DeletedNoteDatabase.removeAll()
          NoteVersionLocalStorage.setVersion(newVersion)

          return
        }
      } catch {
        /**Save error log */
      }
    }

    NoteSyncLocalStorage.setShouldSync(true)
  }

  private deleteNoteOnServer = async (noteDoc: NoteDoc) => {
    if (noteDoc.external_id) {
      const model: NoteDeleteModel = { id: noteDoc.external_id }

      const request = DinoAgentService.delete(DinoAPIURLConstants.NOTE_DELETE)

      if (request.status === DinoAgentStatus.OK) {
        try {
          const response = await request.get().send(model)

          if (response.status === HttpStatus.OK) {
            const newVersion = response.body

            const deletedNote = await DeletedNoteDatabase.getByQuestion(
              noteDoc.question
            )

            if (deletedNote) {
              DeletedNoteDatabase.deleteByNoteDoc(deletedNote)
            }

            NoteVersionLocalStorage.setVersion(newVersion)

            return
          }
        } catch {
          /**TO-DO Fazer log do erro */
        }
      }
      NoteSyncLocalStorage.setShouldSync(true)
    }
  }

  //#endregion

  //#region SAVE & UPDATE

  updateNotesOrder = async (viewNotes: NoteViewModel[]) => {
    const noteDocs = await NoteDatabase.getAll()

    noteDocs.forEach((noteDoc) => {
      const newOrder = viewNotes.findIndex(
        (n) => n.question === noteDoc.question
      )

      noteDoc.order = newOrder
    })

    NoteDatabase.putAll(noteDocs)
    this.updateOrderOnServer(noteDocs)
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

    const request = DinoAgentService.put(DinoAPIURLConstants.NOTE_ORDER)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get().send(model)

        if (response.status === HttpStatus.OK) {
          NoteVersionLocalStorage.setVersion(response.body)

          return
        }
      } catch {
        /**TO-DO Salvar log de erro */
      }
    }

    NoteSyncLocalStorage.setShouldSync(true)
  }

  updateNotes = async (models: NoteUpdateModel[]) => {
    const request = DinoAgentService.put(DinoAPIURLConstants.NOTE_UPDATE_ALL)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get().send(models)

        if (response.status === HttpStatus.OK) {
          const newVersion = response.body

          const promises = models.map(async (model) => {
            const noteDoc = await NoteDatabase.getByQuestion(model.question)

            if (noteDoc) {
              noteDoc.savedOnServer = true

              NoteDatabase.put(noteDoc)
            }
          })

          await Promise.all(promises)

          this.setVersion(newVersion)

          return
        }
      } catch {
        /**TO-DO Save log error */
      }
    }

    this.setShouldSync(true)
  }

  updateNoteQuestion = async (
    noteModel: NoteViewModel,
    updateState: () => void
  ) => {
    const noteDoc = await NoteDatabase.getByQuestion(noteModel.question)

    if (noteDoc) {
      noteDoc.question = noteModel.question
      noteDoc.tagNames = noteModel.tagNames
      noteDoc.lastUpdate = noteModel.lastUpdate
      noteDoc.savedOnServer = false

      this.updateNoteQuestionOnServer(noteDoc)
      await NoteDatabase.put(noteDoc)

      if (updateState) {
        updateState()
      }
    }
  }

  private updateNoteQuestionOnServer = async (noteDoc: NoteDoc) => {
    if (noteDoc.external_id) {
      const model: NoteQuestionModel = {
        id: noteDoc.external_id,
        question: noteDoc.question,
        tagNames: noteDoc.tagNames,
        lastUpdate: noteDoc.lastUpdate,
      }

      const request = DinoAgentService.put(
        DinoAPIURLConstants.NOTE_UPDATE_QUESTION
      )

      if (request.status === DinoAgentStatus.OK) {
        try {
          const response = await request.get().send(model)

          if (response.status === HttpStatus.OK) {
            const savedNoteDoc = await NoteDatabase.getByQuestion(
              noteDoc.question
            )

            if (savedNoteDoc) {
              savedNoteDoc.savedOnServer = true

              NoteDatabase.put(savedNoteDoc)

              NoteVersionLocalStorage.setVersion(response.body)
            }

            return
          }
        } catch {
          /**TO-DO Salvar log de erro */
        }
      }
    }

    return NoteSyncLocalStorage.setShouldSync(true)
  }

  updateNoteAnswer = async (noteModel: NoteViewModel) => {
    const noteDoc = await NoteDatabase.getByQuestion(noteModel.question)

    if (noteDoc) {
      noteDoc.answer = noteModel.answer
      noteDoc.answered = noteModel.answered
      noteDoc.savedOnServer = false

      NoteDatabase.put(noteDoc)

      this.updateNoteAnswerOnServer(noteDoc)
    }
  }

  updateNoteAnswerOnServer = async (noteDoc: NoteDoc) => {
    if (noteDoc.external_id) {
      const model: NoteAPIAnswerModel = {
        id: noteDoc.external_id,
        answer: noteDoc.answer,
      }

      const request = DinoAgentService.put(
        DinoAPIURLConstants.NOTE_UPDATE_ANSWER
      )

      if (request.status === DinoAgentStatus.OK) {
        try {
          const response = await request.get().send(model)

          if (response.status === HttpStatus.OK) {
            const savedNoteDoc = await NoteDatabase.getByQuestion(
              noteDoc.question
            )

            if (savedNoteDoc) {
              savedNoteDoc.savedOnServer = true

              NoteDatabase.put(savedNoteDoc)
              NoteVersionLocalStorage.setVersion(response.body)
            }

            return
          }
        } catch {
          /**TO-DO Salvar log de erro */
        }
      }
    }

    NoteSyncLocalStorage.setShouldSync(true)
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
