import NoteView from '../../../../../types/note/view/NoteView'
import NoteColumnEntity from '../../../../../types/note/database/NoteColumnEntity'
import NoteEntity from '../../../../../types/note/database/NoteEntity'

export default interface NoteBodyColumnProps {
	noteView: NoteView
	columnIndex: number
	searching: boolean
	onClickNote: (note: NoteEntity) => void
	onEditColumn: (column: NoteColumnEntity) => void
	onDeleteColumn: (column: NoteColumnEntity) => void
	onAddNote: (column: NoteColumnEntity) => void
}
