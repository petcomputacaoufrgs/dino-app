import NoteVersionLocalStorage from './local_storage/NoteVersionLocalStorage'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import NoteSaveModel from '../../types/note/NoteSaveModel'
import NoteSaveResponseAPIModel from '../../types/note/NoteSaveResponseAPIModel'
import NoteOrderAPIModel from '../../types/note/NoteOrderAPIModel'
import NoteDeleteModel from '../../types/note/NoteDeleteModel'
import NoteQuestionModel from '../../types/note/NoteQuestionModel'
import NoteAPIAnswerModel from '../../types/note/NoteAnswerModel'
import NoteDoc from '../../types/note/database/NoteDoc'
import NoteDatabase from './database/NoteDatabase'
import DeletedNoteDatabase from './database/DeletedNoteDatabase'
import DinoAgentService from '../dino_agent/DinoAgentService'
import NoteSyncLocalStorage from './local_storage/NoteSyncLocalStorage'
import DinoAgentStatus from '../../types/dino_agent/DinoAgentStatus'
import NoteUpdateModel from '../../types/note/NoteUpdateModel'
import NoteModel from '../../types/note/NoteModel'
import NoteContextUpdater from './NoteContextUpdater'
import NoteViewModel from '../../types/note/NoteViewModel'
import { NoteValue } from '../../provider/notes_provider/value'

class NoteService {
  //#region GET

  getNotes = async (): Promise<NoteValue[]> => {
    const noteDocs = await NoteDatabase.getAll()

    const notes = noteDocs
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
          } as NoteValue)
      )

    return notes
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

  saveNote = async (noteModel: NoteValue) => {
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

  saveNoteOnServer = async (noteModel: NoteValue) => {
    const newNote: NoteSaveModel = {
      order: noteModel.id,
      question: noteModel.question,
      lastUpdate: noteModel.lastUpdate,
      tagNames: noteModel.tagNames,
      answered: false,
      id: 0,
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

            NoteContextUpdater.update()

            this.setVersion(body.version)
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

  deleteNote = async (noteModel: NoteValue) => {
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

    if (noteDocs.length > 0) {
      noteDocs.forEach((noteDoc) => {
        const newOrder = viewNotes.findIndex(
          (n) => n.question === noteDoc.question
        )

        noteDoc.order = newOrder
      })

      await NoteDatabase.putAll(noteDocs)

      NoteContextUpdater.update()

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

          NoteContextUpdater.update()

          this.setVersion(newVersion)

          return
        }
      } catch {
        /**TO-DO Save log error */
      }
    }

    this.setShouldSync(true)
  }

  updateNoteQuestion = async (oldQuestion: string, noteModel: NoteValue) => {
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

  updateNoteAnswer = async (noteModel: NoteValue) => {
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

              await NoteDatabase.put(savedNoteDoc)

              NoteContextUpdater.update()

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

  updateNotesFromServer = async (newVersion: number) => {
    const localVersion = this.getVersion()

    if (newVersion > localVersion) {
      const request = DinoAgentService.get(DinoAPIURLConstants.NOTE_GET)

      if (request.status === DinoAgentStatus.OK) {
        try {
          const response = await request.get()

          if (response.status === HttpStatus.OK) {
            const notes: NoteModel[] = response.body

            const noteDocs: NoteDoc[] = notes.map(
              (n) =>
                ({
                  external_id: n.id,
                  order: n.order,
                  answer: n.answer,
                  answered: n.answered,
                  lastUpdate: n.lastUpdate,
                  question: n.question,
                  tagNames: n.tags,
                  savedOnServer: true,
                } as NoteDoc)
            )

            await NoteDatabase.removeAll()

            await NoteDatabase.putAll(noteDocs)

            NoteContextUpdater.update()

            this.setVersion(newVersion)

            return
          }
        } catch {
          /**TO-DO Salvar log de erro */
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
