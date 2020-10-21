import NoteEntity from '../note/database/NoteEntity'

export default interface NoteContextType {
  notes: NoteEntity[]
  tags: string[]
}
