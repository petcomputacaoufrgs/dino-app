import { NoteContextType } from '../context_provider/NotesContextType'

export default interface NoteViewModel extends NoteContextType {
  showByTag: boolean
  showByQuestion: boolean
}
