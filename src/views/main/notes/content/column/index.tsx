import React from 'react'
import NoteBodyColumnProps from './props'
import './styles.css'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import NoteBodyColumnCard from './card'
import NoteBodyColumnHeader from './header'
import NoteViewModel from '../../../../../types/note/view/NoteViewModel'
import { isMobile } from 'react-device-detect'
import NoteDraggableType from '../../../../../constants/NoteDroppableType'
import NotesContentColumnAddNote from './add_note'

const NoteContentColumn: React.FC<NoteBodyColumnProps> = ({
  column,
  columnIndex,
  onClickNote,
  onDelete,
  onEditColumn,
  onDeleteColumn,
  onAddNote
}) => {
  const renderCard = (
    note: NoteViewModel,
    noteIndex: number
  ): JSX.Element | undefined => {
    if (note.showByTag || note.showByQuestion) {
      return (
        <NoteBodyColumnCard
          note={note}
          key={noteIndex}
          noteIndex={noteIndex}
          onClickNote={onClickNote}
          onDelete={onDelete}
        ></NoteBodyColumnCard>
      )
    }
  }

  const handleColumnEdit = () => {
    onEditColumn(column)
  }

  const handleColumnDelete = () => {
    onDeleteColumn(column)
  }

  const handleAddNote = () => {
    onAddNote(column)
  }

  return (
    <Draggable draggableId={columnIndex.toString()} index={columnIndex}>
      {(provided) => (
        <div
          className={`note__note_content__column ${!isMobile ? 'desktop' : ''}`}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div
            className="note__note_content__column__title"
            {...provided.dragHandleProps}
          >
            <NoteBodyColumnHeader
              title={column.title}
              onEdit={handleColumnEdit}
              onDelete={handleColumnDelete}
            />
          </div>
          <Droppable droppableId={column.title} type={NoteDraggableType.NOTE}>
            {(provided) => (
              <div
                className="note__note_content__column__droppable"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {column.notes.map((note, index) => renderCard(note, index))}
                <NotesContentColumnAddNote onAdd={handleAddNote}/>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}

export default NoteContentColumn
