import React from 'react'
import NoteBodyColumnProps from './props'
import './styles.css'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import NoteBodyColumnCard from './card'
import NoteBodyColumnHeader from './header'
import NoteViewModel from '../../../../../types/note/view/NoteViewModel'
import { isMobile } from 'react-device-detect'
import NoteDraggableType from '../../../../../constants/NoteDroppableType'

const NoteContentColumn: React.FC<NoteBodyColumnProps> = ({column, columnIndex, onClickNote: onEditQuestion, onDelete}) => {
  
    const renderCard = (note: NoteViewModel, noteIndex: number): JSX.Element | undefined => {
        if (note.showByTag || note.showByQuestion) {
            return (
              <NoteBodyColumnCard
                note={note}
                key={noteIndex}
                noteIndex={noteIndex}
                onClickNote={onEditQuestion}
                onDelete={onDelete}
              ></NoteBodyColumnCard>
            )
        }
    }

    return (
      <Draggable draggableId={columnIndex.toString()} index={columnIndex}>
        {(provided) => (
          <div
            className={`note__note_content__column ${!isMobile && 'desktop'}`}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div
              className="note__note_content__column__title"
              {...provided.dragHandleProps}
            >
              <NoteBodyColumnHeader title={column.title} />
            </div>
            <Droppable
              droppableId={column.title}
              type={NoteDraggableType.NOTE}
            >
              {(provided) => (
                <div
                  className="note__note_content__column__droppable"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {column.notes.map((note, index) => renderCard(note, index))}
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