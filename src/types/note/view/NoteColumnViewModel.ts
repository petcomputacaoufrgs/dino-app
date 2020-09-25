import NoteViewModel from './NoteViewModel'
import NoteColumnEntity from '../database/NoteColumnEntity'

export interface NoteColumnViewModel extends NoteColumnEntity {
  notes: NoteViewModel[]
}
