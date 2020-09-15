import React from 'react'
import NoteBodyColumnProps from './props'
import './styles.css'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import NoteContentColumnCard from './card'
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
        <NoteContentColumnCard
          note={note}
          key={noteIndex}
          noteIndex={noteIndex}
          onClickNote={onClickNote}
          onDelete={onDelete}
        ></NoteContentColumnCard>
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
    <div className={`note__note_content__column${isMobile ? '' : ' desktop'}`}>
      <Draggable draggableId={columnIndex.toString()} index={columnIndex}>
        {(provided) => (
          <div
            className="note__note_content__column__draggable"
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div
              className="note__note_content__column__draggable__title"
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
                  className="note__note_content__column__draggable__droppable"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="note__note_content__column__draggable__droppable__scroll">
                    {column.notes.map((note, index) => renderCard(note, index))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="note__note_content__column__draggable__add_button">
              <NotesContentColumnAddNote onAdd={handleAddNote} />
            </div>
          </div>
        )}
      </Draggable>
    </div>
  )
}

export default NoteContentColumn
