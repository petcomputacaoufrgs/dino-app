import NoteViewModel from '../model/view/NoteViewModel'
import NoteLocalModel from '../model/local_storage/NoteLocalModel';
import NotesLocalStorageService from './local_storage/NotesLocalStorageService'
import NoteTagLocalModel from '../model/local_storage/NoteTagLocalModel'
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
        const tags: NoteTagLocalModel[] = []

        const localNotes: NoteLocalModel[] = notes.map(n => {
          const localNote: NoteLocalModel = {...n, savedOnServer: true, tagNames: n.tags.map(t => {
            const tag: NoteTagLocalModel = {...t, savedOnServer: true}
            
            const tagNotPushed = !tags.map(t => t.name).includes(tag.name)

            if (tagNotPushed) {
              tags.push(tag)
            }
            
            return tag.name
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

    getSavedTags = (): NoteTagLocalModel[] => {
      const savedTags = NotesLocalStorageService.getTags()

      return savedTags
    }

    //#endregion

    //#region SAVE

    saveNote = (noteModel: NoteViewModel) => {
      noteModel.savedOnServer = false
      this.saveOnLocalHistory(noteModel)
      this.saveTagsOnLocalStorage(noteModel.tagNames)
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

        const tags = NotesLocalStorageService.getTags()

        const newTags = tags.map(tag => {
          const savedTag = body.newTags.find(t => t.name === tag.name)
          
          if (savedTag) {
            tag.savedOnServer = true
            tag.id = savedTag.id
          }

          return tag
        })

        const notes = NotesLocalStorageService.getNotes()

        const savedNote = notes.find(note => note.question === newNote.question)

        if (savedNote) {
          savedNote.savedOnServer = true
          savedNote.id = body.noteId

          NotesLocalStorageService.setNotes(notes)
          NotesLocalStorageService.setTags(newTags)
          NotesLocalStorageService.setVersion(body.version)
        }
      }
    }

    //#endregion

    //#region SAVE & UPDATE
    
    saveTagsOnLocalStorage = (tagNames: string[]) => {
      const savedTags = NotesLocalStorageService.getTags()

      const newTags = tagNames
        .filter(name => savedTags.every(tag => tag.name !== name))
        .map(name => ({name: name, savedOnServer: false} as NoteTagLocalModel))

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

        if (!deletedNote.id) {
          return 
        }

        const deletedTagNames = noteModel.tagNames
          .filter(tagName => newSavedNotes.every(note => !note.tagNames.includes(tagName)))

        const savedTags = NotesLocalStorageService.getTags()

        const newSavedTags = savedTags.filter(tag => deletedTagNames.every(t => t !== tag.name))
        
        const notesToDelete = NotesLocalStorageService.getNotesToDelete()

        notesToDelete.push(deletedNote)

        NotesLocalStorageService.setNotesToDelete(notesToDelete)
        NotesLocalStorageService.setNotes(newSavedNotes)
        NotesLocalStorageService.setTags(newSavedTags)
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

      const unchangedNotes = savedNotes.filter(n => n.order !== noteModel.id)
      const changedNote = savedNotes.find(n => n.order === noteModel.id)
      
      if (changedNote) {
        changedNote.question = noteModel.question
        changedNote.tagNames = noteModel.tagNames
        changedNote.savedOnServer = false

        unchangedNotes.push(changedNote)

        NotesLocalStorageService.setNotes(unchangedNotes)

        const tags = NotesLocalStorageService.getTags()

        changedNote.tagNames.forEach(name => {
          const isNew = tags.every(tag => tag.name !== name)

          if (isNew) {
            const newTag: NoteTagLocalModel = {
              name: name,
              savedOnServer: false
            }

            tags.push(newTag)
          }
        })

        NotesLocalStorageService.setTags(tags)
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
      }
    }

    //#endregion

    private saveOnLocalHistory = (noteModel: NoteViewModel) => {
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
    }
}

export default new NotesService()

