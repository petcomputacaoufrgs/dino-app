import NoteDoc from "../note/database/NoteDoc";

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
  notes: NoteDoc[]
  tags: string[]
}
