import NoteViewModel from '../model/view/NoteViewModel'
import NoteLocalModel from '../model/local_storage/NoteLocalModel';
import NotesLocalStorageService from './local_storage/NotesLocalStorageService'
import DinoHttpService from './DinoHttpService'
import DinoAPIURLConstants from '../constants/dino_api/DinoAPIURLConstants'
import NoteAPIModel from '../model/dino_api/note/NoteAPIModel'
import HttpStatus from 'http-status-codes'
import AuthService from './AuthService'
import NoteSaveAPIModel from '../model/dino_api/note/NoteAPISaveModel'
import NoteSaveResponseAPIModel from '../model/dino_api/note/NoteSaveResponseAPIModel'
import NoteOrderAPIModel from '../model/dino_api/note/NoteOrderAPIModel'
import ArraySeparate from '../utils/ArraySeparate'
import NoteDeleteAPIModel from '../model/dino_api/note/NoteDeleteAPIModel';
import NoteAPIQuestionModel from '../model/dino_api/note/NoteAPIQuestionModel';
import NoteAPIAnswerModel from '../model/dino_api/note/NoteAnswerModel';
import StringUtils from '../utils/StringUtils';

class NotesService {  

    //#region SERVER UPDATER

    checkUpdates = async (): Promise<void> => {
      NotesLocalStorageService.setUpdateNotesWithError(false)

      if (AuthService.isAuthenticated()) { 
        NotesLocalStorageService.setUpdatingNotes(true)

        const response = await DinoHttpService.get(DinoAPIURLConstants.NOTE_GET_VERSION)

        if (response.status === HttpStatus.OK) {
          const serverVersion: number = response.body

          const savedVersion = NotesLocalStorageService.getVersion()

          if (serverVersion !== savedVersion) {
            await this.updateNotesVersion(serverVersion)
          } 
        } else {
          NotesLocalStorageService.setUpdateNotesWithError(true)
        }
        
        NotesLocalStorageService.setUpdatingNotes(false)
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

        NotesLocalStorageService.setNotes(localNotes)
        NotesLocalStorageService.setTags(tags)
        NotesLocalStorageService.setVersion(version)
      }
      NotesLocalStorageService.setUpdateNotesWithError(true)
    } 

    //#endregion
  
    //#region GET

    getSavedNotes = (): NoteViewModel[] => {
        const savedNotes = NotesLocalStorageService.getNotes()

        const viewModels = savedNotes.sort((n1, n2) => n1.order - n2.order)
        .map(savedNote => ({...savedNote, id: savedNote.order, api_id: savedNote.id,
            showByQuestion: true, showByTag: true} as NoteViewModel))

        return viewModels
    }

    getSavedTags = (): string[] => {
      const savedTags = NotesLocalStorageService.getTags()

      return savedTags
    }

    //#endregion

    //#region VALIDATE

    questionAlreadyExists = (question: string): boolean => {
      const notes = NotesLocalStorageService.getNotes()

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

      const notes = NotesLocalStorageService.getNotes()

      notes.push(localModel)

      NotesLocalStorageService.setNotes(notes)
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

        const notes = NotesLocalStorageService.getNotes()

        const savedNote = notes.find(note => note.question === newNote.question)

        if (savedNote) {
          savedNote.savedOnServer = true
          savedNote.id = body.noteId

          NotesLocalStorageService.setNotes(notes)
          NotesLocalStorageService.setVersion(body.version)
          this.updateTagsByNotes()
        }
      }
    }

    //#endregion

    //#region SAVE & UPDATE
    
    saveTagsOnLocalStorage = (tagNames: string[]) => {
      const savedTags = NotesLocalStorageService.getTags()

      const newTags = tagNames
        .filter(name => savedTags.every(tag => tag !== name))

      if (newTags.length > 0) {
        const tags = savedTags.concat(newTags)

        NotesLocalStorageService.setTags(tags)
      }
    }

    updateNotesOrder = (notes: NoteViewModel[])  => {
      const viewNote = [...notes]

      const savedNotes = NotesLocalStorageService.getNotes()

      savedNotes.forEach(note => {
        const newOrder = viewNote.findIndex(n => n.question === note.question)
        
        note.order = newOrder
      })

      NotesLocalStorageService.setNotes(savedNotes)
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
        NotesLocalStorageService.setVersion(response.body)
      }
    }

    deleteNote = (noteModel: NoteViewModel) => {
      const savedNotes = NotesLocalStorageService.getNotes()

      const [newSavedNotes, deletedNotes] = ArraySeparate(savedNotes, n => n.order !== noteModel.id)

      if (deletedNotes.length === 1) {
        const deletedNote = deletedNotes[0]
        
        const notesToDelete = NotesLocalStorageService.getNotesToDelete()

        notesToDelete.push(deletedNote)

        NotesLocalStorageService.setNotesToDelete(notesToDelete)
        NotesLocalStorageService.setNotes(newSavedNotes)
        this.updateTagsByNotes()
        this.deleteNoteOnServer(deletedNote)
      }
    } 

    private deleteNoteOnServer = async (note: NoteLocalModel) => {
      if (note.id) {
        const model: NoteDeleteAPIModel = { id: note.id }

        const response = await DinoHttpService.delete(DinoAPIURLConstants.NOTE_DELETE).send(model)

        if (response.status === HttpStatus.OK && response.body === 1) {
          const notesToDelete = NotesLocalStorageService.getNotesToDelete()

          const updatedData = notesToDelete.filter(n => n.id !== note.id)

          NotesLocalStorageService.setNotesToDelete(updatedData)
        } 
      }
    }

    updateNoteQuestion = (noteModel: NoteViewModel) => {
      const savedNotes = NotesLocalStorageService.getNotes()

      const [changedNotes, unchangedNotes] = ArraySeparate(savedNotes, n => n.order === noteModel.id)

      if (changedNotes.length === 1) {
        const changedNote = changedNotes[0]

        changedNote.question = noteModel.question
        changedNote.tagNames = noteModel.tagNames
        changedNote.savedOnServer = false

        unchangedNotes.push(changedNote)

        NotesLocalStorageService.setNotes(unchangedNotes)
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
          const notes = NotesLocalStorageService.getNotes()
          
          const updatedNote = notes.find(n => n.question === note.question)

          if (updatedNote) {
            updatedNote.savedOnServer = true;

            NotesLocalStorageService.setNotes(notes)

            NotesLocalStorageService.setVersion(response.body)
          }
        } 
      }
    }

    updateNoteAnswer = (noteModel: NoteViewModel) => {
      const savedNotes = NotesLocalStorageService.getNotes()

      const [editedNotes, unchangedNotes] = ArraySeparate(savedNotes, n => n.order === noteModel.id)
      
      if (editedNotes.length === 1) {
        const editedNote = editedNotes[0]
        
        editedNote.answer = noteModel.answer
        editedNote.answered = noteModel.answered
        editedNote.savedOnServer = false

        unchangedNotes.push(editedNote)

        NotesLocalStorageService.setNotes(unchangedNotes)

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
          const notes = NotesLocalStorageService.getNotes()
          
          const updatedNote = notes.find(n => n.question === note.question)

          if (updatedNote) {
            updatedNote.savedOnServer = true;

            NotesLocalStorageService.setNotes(notes)
            NotesLocalStorageService.setVersion(response.body)
          }
        } 
      }
    }

    private updateTagsByNotes = () => {
      const notes = NotesLocalStorageService.getNotes()

      const tags: string[] = []

      notes.forEach(n => 
        n.tagNames.forEach(tag => {
          const notIncluded = !tags.includes(tag)

          if (notIncluded) {
            tags.push(tag)
          }
        })
      )

      NotesLocalStorageService.setTags(tags)
    } 

    //#endregion
}

export default new NotesService()

