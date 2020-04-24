import NoteBoardModel from '../model/NoteBoardModel'
import { NoteBoardColumnModel } from '../model/NoteBoardModel'
import NoteModel from '../model/NoteModel'

class NotesService {
  
    getNotesFromServer = (): NoteModel[] => {
        return []
    }

    getTagsFromServer = (): string[] => {
      return [
        'remédio', 'tratamento', 'sintomas'
      ]
    }

    saveNewNotesIdsOnServer = (notes: NoteModel[])  => {
      const newNotes = [...notes]

      newNotes.forEach((note, index) => {
        note.id = index
      })
    }

    //#region Note CRUD

    saveNoteOnServer = (noteModel: NoteModel) => {
      
    }

    deleteNoteOnServer = (noteModel: NoteModel) => {
      
    } 

    updateNoteQuestionOnServer = (noteModel: NoteModel) => {
      
    }

    updateNoteAnswerOnServer = (noteModel: NoteModel) => {
     
    }

    //#endregion

    //#region Private methods

    private getNotesFromBoard = (board: NoteBoardModel): NoteModel[] => {
      return this.getDataFromBoard(board).cards
    }

    private getDataFromBoard = (board: NoteBoardModel): NoteBoardColumnModel => {
      return board.columns[0]
    }

    //#endregion

}

export default new NotesService()

