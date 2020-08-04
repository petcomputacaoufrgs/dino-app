import NoteViewModel from './NoteViewModel'

export interface NoteBoardColumnViewModel {
  id: number
  cards: NoteViewModel[]
}

export default interface NoteBoardViewModel {
  columns: NoteBoardColumnViewModel[]
}
