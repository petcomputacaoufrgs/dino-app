import NoteBoardType from '../views/main/notes/NoteBoardType'
import { NoteColumnsType } from '../views/main/notes/NoteBoardType'
import Note from '../types/Note'

class NotesService {
    getBoard = () => {
        const board = {
            columns: [
              {
                id: 0,
                cards: [
                  {
                    id: 0,
                    api_id: 0,
                    question: "Qual os efeitos colaterais do antibiótico prescrito?",
                    answer: "",
                    answered: false
                  }
                ] as Note[]
              }
            ]
        } as NoteBoardType;

        return board
    }

    updateNotesOrderOnAPI = (board: NoteBoardType, from: number, to: number): NoteBoardType  => {
      const cards: Note[] = []

      board.columns[0].cards.forEach(card => {
        cards.push({...card})
      })

      this.setNoteIdByOrder(cards)

      const columns = [{
        'id': board.columns[0].id,
        'cards': cards,
      }]
      
      const newBoard: NoteBoardType = {
        'columns': columns
      }

      return newBoard
    }

    compareNotes = (n1: Note, n2: Note) => {
      return n1.id - n2.id
    }

    removeNoteById = (searchData: NoteBoardType, order: number) => {
      const uniqueColumn = this.getUniqueColumnFromBoard(searchData)

      uniqueColumn.cards = uniqueColumn.cards.filter(card => card.id !== order)
    } 

    addNewCard = (text: string, dataCopy: NoteBoardType) => {
      const notes = this.getNotesFromBoard(dataCopy)
      
      const orderValues = notes.map(note => note.id)

      const newNote: Note = {
        'answer': '',
        'answered': false,
        'question': text,
        'id': Math.max(...orderValues) + 1,
      }

      notes.push(newNote)
    }

    updateNote = (order: number, text: string, editing: boolean, dataCopy: NoteBoardType) => {
      const note = this.getNoteById(dataCopy, order)

      if (note) {
        if (editing) {
          note.question = text
        } else {
          note.answer = text
          note.answered = Boolean(text)
        }
      }
    }

    getNotesFromBoard = (board: NoteBoardType): Note[] => {
      return this.getUniqueColumnFromBoard(board).cards
    }

    private getNoteById = (searchData: NoteBoardType, id: number): Note | undefined => {
      const notes = this.getNotesFromBoard(searchData)

      return notes.find(card => card.id === id)
    }

    private getUniqueColumnFromBoard = (board: NoteBoardType): NoteColumnsType => {
      return board.columns[0]
    }

    private setNoteIdByOrder = (notes: Note[]) => {
      notes.forEach((note, index) => {
        note.id = index
      })
    } 
}

export default new NotesService()

