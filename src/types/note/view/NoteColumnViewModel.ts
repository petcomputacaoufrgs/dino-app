import NoteViewModel from './NoteViewModel'
import NoteColumnEntity from '../database/NoteColumnEntity'

export interface NoteColumnViewModel extends NoteColumnEntity {
  id: number
  notes: NoteViewModel[]
  showBySearch: boolean
}
