import NoteViewModel from '../model/view/NoteViewModel'
import NoteLocalModel from '../model/local_storage/NoteLocalModel'
import NotesLocalStorageService from './local_storage/NotesLocalStorageService'
import NoteTagLocalModel from '../model/local_storage/NoteTagLocalModel'
import DinoHttpService from './DinoHttpService'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import NoteAPIModel from '../model/dino_api/note/NoteAPIModel'
import HttpStatus from 'http-status-codes'
import AuthService from './AuthService'
import NoteAPISaveModel from '../model/dino_api/note/NoteAPISaveModel'
import NoteSaveResponseAPIModel from '../model/dino_api/note/NoteSaveResponseAPIModel'

class NotesService {

    //#region SERVER UPDATER

    checkUpdates = async (): Promise<void> => {
      if (AuthService.isAuthenticated()) { 
        NotesLocalStorageService.setUpdatingNotes(true)

        const serverVersion = await this.getServerNotesVersion()

        const savedVersion = NotesLocalStorageService.getVersion()

        if (serverVersion !== savedVersion) {
          await this.updateNotesVersion()
        }

        NotesLocalStorageService.setUpdatingNotes(false)
      }
    }

    private updateNotesVersion = async (): Promise<void> => {
      const response = await DinoHttpService.get(DinoAPIURLConstants.NOTE_GET)

      if (response.status === HttpStatus.OK) {
        const notes: NoteAPIModel[] = response.body
        const tags: NoteTagLocalModel[] = []

        const localNotes: NoteLocalModel[] = notes.map(n => {
          const localNote: NoteLocalModel = {...n, savedOnServer: true, tagList: n.tagList.map(t => {
            const tag: NoteTagLocalModel = {...t, savedOnServer: true}
            
            const tagNotPushed = !tags.map(t => t.name).includes(tag.name)

            if (tagNotPushed) {
              tags.push(tag)
            }
            
            return tag
          })}

          return localNote
        })

        NotesLocalStorageService.setNotes(localNotes)
        NotesLocalStorageService.setTags(tags)
        NotesLocalStorageService.setUpdateNotesWithError(false)
      } else {
        NotesLocalStorageService.setUpdateNotesWithError(true)
      }
    } 

    private getServerNotesVersion = async (): Promise<number> => {
      const response = await DinoHttpService.get(DinoAPIURLConstants.NOTE_GET_VERSION)

      const version: number = response.body

      return version
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
      this.saveTagsOnLocalStorage(noteModel.tagList)
      this.saveNoteOnServer(noteModel)
    }

    saveNoteOnServer = async (noteModel: NoteViewModel) => {
      const newNote: NoteAPISaveModel = {
        order: noteModel.id,
        question: noteModel.question,
        lastUpdateDay: noteModel.lastUpdateDay,
        lastUpdateMonth: noteModel.lastUpdateMonth,
        lastUpdateYear: noteModel.lastUpdateYear,
        tagIdList: noteModel.tagList.filter(t => t.id).map(t => t.id ? t.id : -1),
        newTags: noteModel.tagList.filter(t => !t.id).map(t => t.name)
      }

      const response = await DinoHttpService.post(DinoAPIURLConstants.NOTE_SAVE).send(newNote)

      if (response.status === HttpStatus.OK) {
        const body: NoteSaveResponseAPIModel = response.body

        NotesLocalStorageService.setVersion(body.version)

        const tags = NotesLocalStorageService.getTags()

        const newTags = tags
        .map(tag => {
          const savedTag = body.tags.some(t => t.name === tag.name)
          
          if (savedTag) {
            tag.savedOnServer = true
          }

          return tag
        })

        NotesLocalStorageService.setTags(newTags)

        const notes = NotesLocalStorageService.getNotes()

        const savedNote = notes.find(note => note.question === newNote.question)

        if (savedNote) {
          savedNote.savedOnServer = true

          savedNote.tagList.forEach(tag => tag.savedOnServer = true)

          NotesLocalStorageService.setNotes(notes)
        }
      }
    }

    //#endregion

    //#region SAVE & UPDATE
    
    saveTagsOnLocalStorage = (tagNames: NoteTagLocalModel[]) => {
      const savedTags = NotesLocalStorageService.getTags()

      const newTags = tagNames.filter(tag => !savedTags.some(savedTag => savedTag.name === tag.name))

      if (newTags.length > 0) {
        const tags = savedTags.concat(newTags)

        NotesLocalStorageService.setTags(tags)
      }
    }

    saveNewNoteIds = (notes: NoteViewModel[])  => {
      const newNotes = [...notes]

      NotesLocalStorageService.removeNotes()

      const newStorageNotes: NoteLocalModel[] = []

      newNotes.forEach((note, index) => {
        note.id = index
        note.savedOnServer = false

        const localModel = this.noteViewModelToLocalStorageModel(note)

        newStorageNotes.push(localModel)
      })

      NotesLocalStorageService.setNotes(newStorageNotes)
    }



    saveOnServer = (noteModel: NoteViewModel) => {

    }

    deleteNote = (noteModel: NoteViewModel) => {
      const savedNotes = NotesLocalStorageService.getNotes()

      const newSavedNotes = savedNotes.filter(n => n.order !== noteModel.id)

      NotesLocalStorageService.setNotes(newSavedNotes)
    } 

    updateNoteQuestion = (noteModel: NoteViewModel) => {
      const savedNotes = NotesLocalStorageService.getNotes()

      const unchangedNotes = savedNotes.filter(n => n.order !== noteModel.id)
      const changedNote = savedNotes.find(n => n.order === noteModel.id)
      
      if (changedNote) {
        changedNote.question = noteModel.question
        changedNote.tagList = noteModel.tagList
        changedNote.savedOnServer = false

        unchangedNotes.push(changedNote)

        NotesLocalStorageService.setNotes(unchangedNotes)
        this.saveTagsOnLocalStorage(changedNote.tagList)
      }
    }

    updateNoteAnswer = (noteModel: NoteViewModel) => {
      const savedNotes = NotesLocalStorageService.getNotes()

      const unchangedNotes = savedNotes.filter(n => n.order !== noteModel.id)
      const editedNote = savedNotes.find(n => n.order === noteModel.id)
      
      if (editedNote) {
        editedNote.answer = noteModel.answer
        editedNote.answered = noteModel.answered
        editedNote.savedOnServer = false

        unchangedNotes.push(editedNote)

        NotesLocalStorageService.setNotes(unchangedNotes)
      }
    }

    //#endregion

    private saveOnLocalHistory = (noteModel: NoteViewModel) => {
      const localModel = this.noteViewModelToLocalStorageModel(noteModel)

      const notes = NotesLocalStorageService.getNotes()

      notes.push(localModel)

      NotesLocalStorageService.setNotes(notes)
    }

    protected noteViewModelToLocalStorageModel = (noteModel: NoteViewModel) => {
      const localModel: NoteLocalModel = {...noteModel, 
        'id': noteModel.api_id,'order': noteModel.id}

      return localModel
    }

}

export default new NotesService()

