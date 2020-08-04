import { NoteValue } from '../../provider/notes_provider/value'

export default interface NoteViewModel extends NoteValue {
  showByTag: boolean
  showByQuestion: boolean
}
