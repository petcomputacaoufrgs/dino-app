import NoteEntity from '../database/NoteEntity'

export default interface NoteViewModel extends NoteEntity {
  id: number
  showByTag: boolean
  showByQuestion: boolean
}
