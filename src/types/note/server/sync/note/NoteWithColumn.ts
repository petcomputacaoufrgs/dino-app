import NoteEntity from '../../../database/NoteEntity'
import NoteColumnEntity from '../../../database/NoteColumnEntity'

export default interface NoteWithColumn extends NoteEntity {
  column?: NoteColumnEntity
}
