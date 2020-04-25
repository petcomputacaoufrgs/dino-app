import NoteBoardViewModel from '../model/view/NoteBoardViewModel'
import { NoteBoardColumnViewModel } from '../model/view/NoteBoardViewModel'
import NoteViewModel from '../model/view/NoteViewModel'
import NoteLocalModel from '../model/local_storage/NoteLocalModel'

class NotesService {
  
    getNotesFromServer = (): NoteViewModel[] => {
        return []
    }

    getTagsFromServer = (): string[] => {
      return [
        'remédio', 'tratamento', 'sintomas'
      ]
    }

    saveNewNotesIdsOnServer = (notes: NoteViewModel[])  => {
      const newNotes = [...notes]

      newNotes.forEach((note, index) => {
        note.id = index
      })
    }

    //#region Note CRUD

    //#region Save

    saveNote = (noteModel: NoteViewModel) => {
      this.saveOnLocalHistory(noteModel)
    }

    saveOnLocalHistory = (noteModel: NoteViewModel) => {
      const localModel: NoteLocalModel = {
        'id': undefined,
        'order': noteModel.id,
        'question': noteModel.question,
        'answer': noteModel.answer,
        'answered': noteModel.answered,
        'tagList': noteModel.tagList,
        'creationDay': noteModel.creationDay,
        'creationMonth': noteModel.creationMonth,
        'creationYear': noteModel.creationYear,
        'savedOnServer': false
      }

      
    }

    setOnServer = (noteModel: NoteViewModel) => {

    }

    //#endregion

    deleteNote = (noteModel: NoteViewModel) => {
      
    } 

    updateNoteQuestion = (noteModel: NoteViewModel) => {
      
    }

    updateNoteAnswer = (noteModel: NoteViewModel) => {
     
    }

    //#endregion

    //#region Private methods

    private getNotesFromBoard = (board: NoteBoardViewModel): NoteViewModel[] => {
      return this.getDataFromBoard(board).cards
    }

    private getDataFromBoard = (board: NoteBoardViewModel): NoteBoardColumnViewModel => {
      return board.columns[0]
    }

    //#endregion

}

export default new NotesService()

