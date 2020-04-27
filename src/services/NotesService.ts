import NoteViewModel from '../model/view/NoteViewModel'
import NoteLocalModel from '../model/local_storage/NoteLocalModel';
import NotesLocalStorageService from './local_storage/NotesLocalStorageService'
import NoteTagLocalModel from '../model/local_storage/NoteTagLocalModel';

class NotesService {
  
    getSavedNotes = (): NoteViewModel[] => {
        const savedNotes = NotesLocalStorageService.getNotes()

        const viewModels = savedNotes.sort((n1, n2) => n1.order - n2.order)
        .map(savedNote => ({
            'id': savedNote.order,
            'question': savedNote.question,
            'answer': savedNote.answer,
            'answered': savedNote.answered,
            'tagList': savedNote.tagList,
            'creationDay': savedNote.creationDay,
            'creationMonth': savedNote.creationMonth,
            'creationYear': savedNote.creationYear,
            'showByQuestion': true,
            'showByTag': true,
            'savedOnServer': savedNote.savedOnServer
          } as NoteViewModel))

        return viewModels
    }

    getSavedTags = (): string[] => {
      const savedTags = NotesLocalStorageService.getTags()

      return savedTags.map(tag => tag.name)
    }

    saveTags = (tagNames: string[]) => {
      const savedTags = NotesLocalStorageService.getTags()

      const newTags = tagNames.filter(name => !savedTags.some(savedTag => savedTag.name === name))
        .map(name => ({
          name: name,
          savedOnServer: false
        } as NoteTagLocalModel))

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

    //#region Note CRUD

    //#region Save

    saveNote = (noteModel: NoteViewModel) => {
      noteModel.savedOnServer = false
      this.saveOnLocalHistory(noteModel)
    }

    saveOnServer = (noteModel: NoteViewModel) => {

    }

    protected noteViewModelToLocalStorageModel = (noteModel: NoteViewModel) => {
      const localModel: NoteLocalModel = {
        'id': noteModel.api_id,
        'order': noteModel.id,
        'question': noteModel.question,
        'answer': noteModel.answer,
        'answered': noteModel.answered,
        'tagList': noteModel.tagList,
        'creationDay': noteModel.creationDay,
        'creationMonth': noteModel.creationMonth,
        'creationYear': noteModel.creationYear,
        'savedOnServer': noteModel.savedOnServer
      }

      return localModel
    }

    //#endregion

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

}

export default new NotesService()

