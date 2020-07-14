export interface NoteValue {
  id: number
  question: string
  answer: string
  answered: boolean
  tagNames: string[]
  lastUpdate: number
  savedOnServer: boolean
}

export default interface NotesProviderValue {
  notes: NoteValue[]
  tags: string[]
}
