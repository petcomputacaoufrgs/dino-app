import NoteViewModel from '../model/view/NoteViewModel'
import NotesLocalStorage from '../local_storage/NotesLocalStorage'
import DinoAgentService from './DinoAgentService'
import DinoAPIURLConstants from '../constants/dino_api/DinoAPIURLConstants'
import NoteAPIModel from '../model/dino_api/note/NoteAPIModel'
import HttpStatus from 'http-status-codes'
import AuthService from './AuthService'
import NoteSaveAPIModel from '../model/dino_api/note/NoteAPISaveModel'
import NoteSaveResponseAPIModel from '../model/dino_api/note/NoteSaveResponseAPIModel'
import NoteOrderAPIModel from '../model/dino_api/note/NoteOrderAPIModel'
import NoteDeleteAPIModel from '../model/dino_api/note/NoteDeleteAPIModel'
import NoteAPIQuestionModel from '../model/dino_api/note/NoteAPIQuestionModel'
import NoteAPIAnswerModel from '../model/dino_api/note/NoteAnswerModel'
import NoteDoc from '../database/note/NoteDoc'
import NoteDatabase from '../database/note/NoteDatabase'

class NotesService {  

    //#region SERVER UPDATER

    checkUpdates = async (): Promise<void> => {
      NotesLocalStorage.setUpdateNotesWithError(false)

      if (AuthService.isAuthenticated()) { 
        NotesLocalStorage.setUpdatingNotes(true)

        const response = await DinoAgentService.get(DinoAPIURLConstants.NOTE_GET_VERSION)

        if (response.status === HttpStatus.OK) {
          const serverVersion: number = response.body

          const savedVersion = NotesLocalStorage.getVersion()

          if (serverVersion !== savedVersion) {
            await this.updateNotesVersion(serverVersion)
          } 
        } else {
          NotesLocalStorage.setUpdateNotesWithError(true)
        }
        
        NotesLocalStorage.setUpdatingNotes(false)
      }
    }

    private updateNotesVersion = async (version: number): Promise<void> => {
      const response = await DinoAgentService.get(DinoAPIURLConstants.NOTE_GET)

      if (response.status === HttpStatus.OK) {
        const notes: NoteAPIModel[] = response.body

        const noteDocs: NoteDoc[] = notes.map(n => ({
            external_id: n.id,
            order: n.order,
            answer: n.answer,
            answered: n.answered,
            lastUpdate: n.lastUpdate,
            question: n.question,
            tagNames: n.tags.map(tag => tag.name),
            savedOnServer: true
          } as NoteDoc
        ))

        NotesLocalStorage.setVersion(version)

        await NoteDatabase.putAll(noteDocs)
      }

      NotesLocalStorage.setUpdateNotesWithError(true)
    } 

    //#endregion
  
    //#region GET

    getNotes = async (): Promise<NoteViewModel[]> => {
        const noteDocs = await NoteDatabase.getAll()

        const viewModels = noteDocs.sort((n1, n2) => n1.order - n2.order)
        .map(note => (
          {
            id: note.order, 
            answer: note.answer,
            answered: note.answered,
            lastUpdate: note.lastUpdate,
            question: note.question,
            tagNames: note.tagNames,
            savedOnServer: note.savedOnServer,
            showByQuestion: true, 
            showByTag: true
          } as NoteViewModel)
        )

        return viewModels
    }

    getTags = async (): Promise<string[]> => {
      return NoteDatabase.getAllTags()
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
    
    //#region SAVE

    saveNote = async (noteModel: NoteViewModel, updateState: () => void) => {
      const noteDoc: NoteDoc = {
        answer: noteModel.answer,
        answered: noteModel.answered,
        lastUpdate: noteModel.lastUpdate,
        question: noteModel.question,
        savedOnServer: false,
        order: noteModel.id,
        tagNames: noteModel.tagNames
      }

      this.saveNoteOnServer(noteModel)

      await NoteDatabase.put(noteDoc)
      
      if (updateState) {
        updateState()
      }
    }

    saveNoteOnServer = async (noteModel: NoteViewModel) => {      
      const newNote: NoteSaveAPIModel = {
        order: noteModel.id,
        question: noteModel.question,
        lastUpdate: noteModel.lastUpdate,
        tagNames: noteModel.tagNames
      }

      const response = await DinoAgentService.post(DinoAPIURLConstants.NOTE_SAVE).send(newNote)

      if (response.status === HttpStatus.OK) {
        const body: NoteSaveResponseAPIModel = response.body

        const noteDoc = await NoteDatabase.getByQuestion(noteModel.question)

        if (noteDoc) {
          noteDoc.savedOnServer = true
          noteDoc.external_id = body.noteId

          await NoteDatabase.put(noteDoc)
          NotesLocalStorage.setVersion(body.version)
        }
      }
    }

    //#endregion

    //#region SAVE & UPDATE

    updateNotesOrder = async (viewNotes: NoteViewModel[])  => {
      const noteDocs = await NoteDatabase.getAll()

      noteDocs.forEach(noteDoc => {
        const newOrder = viewNotes.findIndex(n => n.question === noteDoc.question)
        
        noteDoc.order = newOrder
      })

      NoteDatabase.putAll(noteDocs)
      this.updateOrderOnServer(noteDocs)
    }

    private updateOrderOnServer = async (noteDocs: NoteDoc[]): Promise<void> => {
      const model: NoteOrderAPIModel[] = []

      noteDocs.forEach(note => {
        if (note.external_id) {
          model.push({
            id: note.external_id,
            order: note.order
          } as NoteOrderAPIModel)
        }
      })

      const response = await DinoAgentService.put(DinoAPIURLConstants.NOTE_ORDER).send(model)

      if (response.status === HttpStatus.OK) {
        NotesLocalStorage.setVersion(response.body)
      }
    }

    deleteNote = async (noteModel: NoteViewModel, updateState: () => {}) => {
      const noteDoc = await NoteDatabase.getByQuestion(noteModel.question)

      if (noteDoc) {

        if (noteDoc.external_id) {
          const notesToDelete = NotesLocalStorage.getNotesToDelete()

          notesToDelete.push(noteDoc)

          NotesLocalStorage.setNotesToDelete(notesToDelete)

          this.deleteNoteOnServer(noteDoc)
        }

        await NoteDatabase.deleteByNoteDoc(noteDoc)
        
        if (updateState) {
          updateState()
        }
      }
    } 

    private deleteNoteOnServer = async (noteDoc: NoteDoc) => {
      if (noteDoc.external_id) {
        const model: NoteDeleteAPIModel = { id: noteDoc.external_id }

        const response = await DinoAgentService.delete(DinoAPIURLConstants.NOTE_DELETE).send(model)

        if (response.status === HttpStatus.OK && response.body === 1) {
          const notesToDelete = NotesLocalStorage.getNotesToDelete()

          const updatedData = notesToDelete.filter(n => n.external_id !== noteDoc.external_id)

          NotesLocalStorage.setNotesToDelete(updatedData)
        } 
      }
    }

    updateNoteQuestion = async (noteModel: NoteViewModel, updateState: () => void) => {
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
        const model: NoteAPIQuestionModel = { 
          id: noteDoc.external_id, 
          question: noteDoc.question, 
          tagNames: noteDoc.tagNames,
          lastUpdate: noteDoc.lastUpdate
        }

        const response = await DinoAgentService.put(DinoAPIURLConstants.NOTE_UPDATE_QUESTION).send(model)

        if (response.status === HttpStatus.OK) {
            const savedNoteDoc = await NoteDatabase.getByQuestion(noteDoc.question)

            if (savedNoteDoc) {
              savedNoteDoc.savedOnServer = true

              NoteDatabase.put(savedNoteDoc)

              NotesLocalStorage.setVersion(response.body)
            }
        } 
      }
    }

    updateNoteAnswer = async (noteModel: NoteViewModel) => {
      const noteDoc = await NoteDatabase.getByQuestion(noteModel.question)
      
      if (noteDoc) {
        noteDoc.answer = noteModel.answer
        noteDoc.answered = noteModel.answered
        noteDoc.savedOnServer = false

        NoteDatabase.put(noteDoc)

        this.updateNoteAnswerOnServer(noteDoc);
      }
    }

    updateNoteAnswerOnServer = async (noteDoc: NoteDoc) => {
      if (noteDoc.external_id) {
        const model: NoteAPIAnswerModel = { 
          id: noteDoc.external_id, 
          answer: noteDoc.answer
        }

        const response = await DinoAgentService.put(DinoAPIURLConstants.NOTE_UPDATE_ANSWER).send(model)

        if (response.status === HttpStatus.OK) {
          const savedNoteDoc = await NoteDatabase.getByQuestion(noteDoc.question)
          
          if (savedNoteDoc) {
            savedNoteDoc.savedOnServer = true;

            NoteDatabase.put(savedNoteDoc)
            NotesLocalStorage.setVersion(response.body)
          }
        } 
      }
    }

    //#endregion
}

export default new NotesService()