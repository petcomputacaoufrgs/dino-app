import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../../../../context_provider/app_settings'
import DateUtils from '../../../../../../utils/DateUtils'
import TagList from '../../../../../../components/tag_list/index'
import MaterialCard from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import NoteBodyColumnCardProps from './props'
import { Draggable } from 'react-beautiful-dnd'
import './styles.css'

const NoteBodyColumnCard: React.FC<NoteBodyColumnCardProps> = ({
  note,
  onDelete,
  onClickNote
}) => {
  const language = useLanguage().current

  const [cardNote, setCardNote] = useState(note)

  const handleDelete = () => {
    onDelete(cardNote)
  }

  const handleCardClick = () => {
    onClickNote(note)
  }

  useEffect(() => {
    setCardNote(note)
  }, [note])
  
  return (
    <Draggable draggableId={cardNote.question} index={cardNote.order}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <MaterialCard
            className={'note__note_content__column__column_card'}
            onClick={handleCardClick}
          >
            <CardHeader
              title={note.question}
              subheader={DateUtils.getDateStringFormated(
                cardNote.lastUpdate,
                language
              )}
            />
            <CardContent className="note__note_content__column__column_card__card__tag_list">
              <TagList tagList={cardNote.tagNames} />
            </CardContent>
          </MaterialCard>
        </div>
      )}
    </Draggable>
  )
}

export default NoteBodyColumnCard
