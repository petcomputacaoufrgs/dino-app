import NoteViewModel from '../model/view/NoteViewModel'
import NoteLocalModel from '../model/local_storage/NoteLocalModel'
import NotesLocalStorage from '../local_storage/NotesLocalStorage'
import DinoHttpService from './DinoHttpService'
import DinoAPIURLConstants from '../constants/dino_api/DinoAPIURLConstants'
import NoteAPIModel from '../model/dino_api/note/NoteAPIModel'
import HttpStatus from 'http-status-codes'
import AuthService from './AuthService'
import NoteSaveAPIModel from '../model/dino_api/note/NoteAPISaveModel'
import NoteSaveResponseAPIModel from '../model/dino_api/note/NoteSaveResponseAPIModel'
import NoteOrderAPIModel from '../model/dino_api/note/NoteOrderAPIModel'
import ArraySeparate from '../utils/ArraySeparate'
import NoteDeleteAPIModel from '../model/dino_api/note/NoteDeleteAPIModel'
import NoteAPIQuestionModel from '../model/dino_api/note/NoteAPIQuestionModel'
import NoteAPIAnswerModel from '../model/dino_api/note/NoteAnswerModel'
import StringUtils from '../utils/StringUtils'

class NotesService {  

    //#region SERVER UPDATER

    checkUpdates = async (): Promise<void> => {
      NotesLocalStorage.setUpdateNotesWithError(false)

      if (AuthService.isAuthenticated()) { 
        NotesLocalStorage.setUpdatingNotes(true)

        const response = await DinoHttpService.get(DinoAPIURLConstants.NOTE_GET_VERSION)

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
      const response = await DinoHttpService.get(DinoAPIURLConstants.NOTE_GET)

      if (response.status === HttpStatus.OK) {
        const notes: NoteAPIModel[] = response.body
        const tags: string[] = []

        const localNotes: NoteLocalModel[] = notes.map(n => {
          const localNote: NoteLocalModel = {...n, savedOnServer: true, tagNames: n.tags.map(t => {
            const tag: string = t.name
            
            const tagNotPushed = !tags.includes(tag)

            if (tagNotPushed) {
              tags.push(tag)
            }
            
            return tag
          })}

          return localNote
        })

        NotesLocalStorage.setNotes(localNotes)
        NotesLocalStorage.setTags(tags)
        NotesLocalStorage.setVersion(version)
      }
      NotesLocalStorage.setUpdateNotesWithError(true)
    } 

    //#endregion
  
    //#region GET

    getSavedNotes = (): NoteViewModel[] => {
        const savedNotes = NotesLocalStorage.getNotes()

        const viewModels = savedNotes.sort((n1, n2) => n1.order - n2.order)
        .map(savedNote => ({...savedNote, id: savedNote.order, api_id: savedNote.id,
            showByQuestion: true, showByTag: true} as NoteViewModel))

        return viewModels
    }

    getSavedTags = (): string[] => {
      const savedTags = NotesLocalStorage.getTags()

      return savedTags
    }

    //#endregion

    //#region VALIDATE

    questionAlreadyExists = (question: string): boolean => {
      const notes = NotesLocalStorage.getNotes()

      return notes.some(n => StringUtils.areEqual(n.question, question))
    }

    //#endregion
    
    //#region SAVE

    saveNote = (noteModel: NoteViewModel) => {
      const localModel: NoteLocalModel = {
        answer: noteModel.answer,
        answered: noteModel.answered,
        lastUpdate: noteModel.lastUpdate,
        question: noteModel.question,
        savedOnServer: false,
        order: noteModel.id,
        tagNames: noteModel.tagNames
      }

      const notes = NotesLocalStorage.getNotes()

      notes.push(localModel)

      NotesLocalStorage.setNotes(notes)
      this.updateTagsByNotes()
      this.saveNoteOnServer(noteModel)
    }

    saveNoteOnServer = async (noteModel: NoteViewModel) => {      
      const newNote: NoteSaveAPIModel = {
        order: noteModel.id,
        question: noteModel.question,
        lastUpdate: noteModel.lastUpdate,
        tagNames: noteModel.tagNames
      }

      const response = await DinoHttpService.post(DinoAPIURLConstants.NOTE_SAVE).send(newNote)

      if (response.status === HttpStatus.OK) {
        const body: NoteSaveResponseAPIModel = response.body

        const notes = NotesLocalStorage.getNotes()

        const savedNote = notes.find(note => note.question === newNote.question)

        if (savedNote) {
          savedNote.savedOnServer = true
          savedNote.id = body.noteId

          NotesLocalStorage.setNotes(notes)
          NotesLocalStorage.setVersion(body.version)
          this.updateTagsByNotes()
        }
      }
    }

    //#endregion

    //#region SAVE & UPDATE
    
    saveTagsOnLocalStorage = (tagNames: string[]) => {
      const savedTags = NotesLocalStorage.getTags()

      const newTags = tagNames
        .filter(name => savedTags.every(tag => tag !== name))

      if (newTags.length > 0) {
        const tags = savedTags.concat(newTags)

        NotesLocalStorage.setTags(tags)
      }
    }

    updateNotesOrder = (notes: NoteViewModel[])  => {
      const viewNote = [...notes]

      const savedNotes = NotesLocalStorage.getNotes()

      savedNotes.forEach(note => {
        const newOrder = viewNote.findIndex(n => n.question === note.question)
        
        note.order = newOrder
      })

      NotesLocalStorage.setNotes(savedNotes)
      this.updateOrderOnServer(savedNotes)
    }

    private updateOrderOnServer = async (notes: NoteLocalModel[]): Promise<void> => {
      const model: NoteOrderAPIModel[] = []

      notes.forEach(note => {
        model.push({
          id: note.id,
          order: note.order
        } as NoteOrderAPIModel)
      })

      const response = await DinoHttpService.put(DinoAPIURLConstants.NOTE_ORDER).send(model)

      if (response.status === HttpStatus.OK) {
        NotesLocalStorage.setVersion(response.body)
      }
    }

    deleteNote = (noteModel: NoteViewModel) => {
      const savedNotes = NotesLocalStorage.getNotes()

      const [newSavedNotes, deletedNotes] = ArraySeparate(savedNotes, n => n.order !== noteModel.id)

      if (deletedNotes.length === 1) {
        const deletedNote = deletedNotes[0]
        
        const notesToDelete = NotesLocalStorage.getNotesToDelete()

        notesToDelete.push(deletedNote)

        NotesLocalStorage.setNotesToDelete(notesToDelete)
        NotesLocalStorage.setNotes(newSavedNotes)
        this.updateTagsByNotes()
        this.deleteNoteOnServer(deletedNote)
      }
    } 

    private deleteNoteOnServer = async (note: NoteLocalModel) => {
      if (note.id) {
        const model: NoteDeleteAPIModel = { id: note.id }

        const response = await DinoHttpService.delete(DinoAPIURLConstants.NOTE_DELETE).send(model)

        if (response.status === HttpStatus.OK && response.body === 1) {
          const notesToDelete = NotesLocalStorage.getNotesToDelete()

          const updatedData = notesToDelete.filter(n => n.id !== note.id)

          NotesLocalStorage.setNotesToDelete(updatedData)
        } 
      }
    }

    updateNoteQuestion = (noteModel: NoteViewModel) => {
      const savedNotes = NotesLocalStorage.getNotes()

      const [changedNotes, unchangedNotes] = ArraySeparate(savedNotes, n => n.order === noteModel.id)

      if (changedNotes.length === 1) {
        const changedNote = changedNotes[0]

        changedNote.question = noteModel.question
        changedNote.tagNames = noteModel.tagNames
        changedNote.savedOnServer = false

        unchangedNotes.push(changedNote)

        NotesLocalStorage.setNotes(unchangedNotes)
        this.updateTagsByNotes()
        this.updateNoteQuestionOnServer(changedNote)
      }
    }

    private updateNoteQuestionOnServer = async (note: NoteLocalModel) => {
      if (note.id) {
        const model: NoteAPIQuestionModel = { 
          id: note.id, 
          question: note.question, 
          tagNames: note.tagNames,
          lastUpdate: note.lastUpdate
        }

        const response = await DinoHttpService.put(DinoAPIURLConstants.NOTE_UPDATE_QUESTION).send(model)

        if (response.status === HttpStatus.OK) {
          const notes = NotesLocalStorage.getNotes()
          
          const updatedNote = notes.find(n => n.question === note.question)

          if (updatedNote) {
            updatedNote.savedOnServer = true;

            NotesLocalStorage.setNotes(notes)

            NotesLocalStorage.setVersion(response.body)
          }
        } 
      }
    }

    updateNoteAnswer = (noteModel: NoteViewModel) => {
      const savedNotes = NotesLocalStorage.getNotes()

      const [editedNotes, unchangedNotes] = ArraySeparate(savedNotes, n => n.order === noteModel.id)
      
      if (editedNotes.length === 1) {
        const editedNote = editedNotes[0]
        
        editedNote.answer = noteModel.answer
        editedNote.answered = noteModel.answered
        editedNote.savedOnServer = false

        unchangedNotes.push(editedNote)

        NotesLocalStorage.setNotes(unchangedNotes)

        this.updateNoteAnswerOnServer(editedNote);
      }
    }

    updateNoteAnswerOnServer = async (note: NoteLocalModel) => {
      if (note.id) {
        const model: NoteAPIAnswerModel = { 
          id: note.id, 
          answer: note.answer
        }

        const response = await DinoHttpService.put(DinoAPIURLConstants.NOTE_UPDATE_ANSWER).send(model)

        if (response.status === HttpStatus.OK) {
          const notes = NotesLocalStorage.getNotes()
          
          const updatedNote = notes.find(n => n.question === note.question)

          if (updatedNote) {
            updatedNote.savedOnServer = true;

            NotesLocalStorage.setNotes(notes)
            NotesLocalStorage.setVersion(response.body)
          }
        } 
      }
    }

    private updateTagsByNotes = () => {
      const notes = NotesLocalStorage.getNotes()

      const tags: string[] = []

      notes.forEach(n => 
        n.tagNames.forEach(tag => {
          const notIncluded = !tags.includes(tag)

          if (notIncluded) {
            tags.push(tag)
          }
        })
      )

      NotesLocalStorage.setTags(tags)
    } 

    //#endregion
}

export default new NotesService()

