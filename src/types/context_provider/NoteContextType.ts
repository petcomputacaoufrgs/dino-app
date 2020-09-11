import NoteDoc from '../note/database/NoteDoc'

export default interface NoteContextType {
  notes: NoteDoc[]
  tags: string[]
}
