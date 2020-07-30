export interface NoteContextType {
  id: number
  question: string
  answer: string
  answered: boolean
  tagNames: string[]
  lastUpdate: number
  savedOnServer: boolean
}

export default interface NotesContextType {
  notes: NoteContextType[]
  tags: string[]
}
