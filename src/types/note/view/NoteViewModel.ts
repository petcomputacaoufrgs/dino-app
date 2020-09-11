import NoteDoc from '../database/NoteDoc'

export default interface NoteViewModel extends NoteDoc {
  showByTag: boolean
  showByQuestion: boolean
}
