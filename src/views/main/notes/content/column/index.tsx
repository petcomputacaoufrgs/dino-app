import React from 'react'
import NoteBodyColumnProps from './props'
import './styles.css'
import { Droppable } from 'react-beautiful-dnd'
import NoteViewModel from '../../../../../types/note/NoteViewModel'
import NoteBodyColumnCard from './card'
import NoteBodyColumnHeader from './header'

const NOTE_BOARD_ID = 'Perguntas'

const NoteContentColumn: React.FC<NoteBodyColumnProps> = ({notes, onClickNote: onEditQuestion, onDelete}) => {

    const renderCard = (note: NoteViewModel, key: number): JSX.Element => {
        if (note.showByTag || note.showByQuestion) {
            return (
              <NoteBodyColumnCard
                key={key}
                note={note}
                onClickNote={onEditQuestion}
                onDelete={onDelete}
              ></NoteBodyColumnCard>
            )
        } else {
            return <></>
        }
    }

    return (
      <div className="note__note_content__column">
        <NoteBodyColumnHeader title={NOTE_BOARD_ID} />
        <Droppable droppableId={NOTE_BOARD_ID}>
          {(provided) => (
            <div
              className="notes__board__container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {notes.map((note, index) => renderCard(note, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    )
}

export default NoteContentColumn