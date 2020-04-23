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
                    answered: false,
                    tagList: ['teste', 'oi']
                  }
                ] as Note[]
              }
            ]
        } as NoteBoardType;

        return board
    }

    getTags = (): string[] => {
      return [
        'teste', 'oi', 'teste2', 'teste3', 'teste4'
      ]
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

    removeNoteById = (data: NoteBoardType, order: number) => {
      const uniqueColumn = this.getUniqueColumnFromBoard(data)

      uniqueColumn.cards = uniqueColumn.cards.filter(card => card.id !== order)
    } 

    searchNotes = (data: NoteBoardType, searchTags: string[]) : NoteBoardType => {
      if (searchTags.length === 0) {
        const newData = {...data}

        return newData
      }
      
      const notes: Note[] = []

      data.columns[0].cards.forEach(note => {
        const included = note.tagList.some(tag=> searchTags.includes(tag))

        if (included) {
          notes.push({...note})
        }
      })

      const columns = [{
        'id': this.getUniqueColumnFromBoard(data).id,
        'cards': notes,
      }]
      
      const newBoard: NoteBoardType = {
        'columns': columns
      }

      return newBoard
    }

    addNewCard = (text: string, dataCopy: NoteBoardType, tagList: string[]) => {
      const notes = this.getNotesFromBoard(dataCopy)
      
      const orderValues = notes.map(note => note.id)

      const newNote: Note = {
        'answer': '',
        'answered': false,
        'question': text,
        'id': Math.max(...orderValues) + 1,
        'tagList': tagList
      }

      notes.push(newNote)
    }

    updateNote = (order: number, text: string, editing: boolean, dataCopy: NoteBoardType, tagList: string[]) => {
      const note = this.getNoteById(dataCopy, order)

      if (note) {
        if (editing) {
          note.question = text
          note.tagList = tagList
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

    private setNoteIdByOrder = (notes: Note[]) => {
      notes.forEach((note, index) => {
        note.id = index
      })
    } 

    private getUniqueColumnFromBoard = (board: NoteBoardType): NoteColumnsType => {
      return board.columns[0]
    }
}

export default new NotesService()

