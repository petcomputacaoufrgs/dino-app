import React from 'react'
import { useLanguage } from '../../../../../../context_provider/app_settings'
import DateUtils from '../../../../../../utils/DateUtils'
import TagList from '../../../../../../components/tag_list/index'
import MaterialCard from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import NoteBodyColumnCardProps from './props'
import { Draggable } from 'react-beautiful-dnd'
import './styles.css'

const NoteContentColumnCard: React.FC<NoteBodyColumnCardProps> = ({
  note,
  noteIndex,
  onClickNote
}) => {
  const language = useLanguage().current

  const handleCardClick = () => {
    onClickNote(note)
  }

  return (
    <Draggable
      draggableId={note.columnTitle + noteIndex.toString()}
      index={noteIndex}
    >
      {(provided) => (
        <MaterialCard
          className={'note__note_content__column__column_card'}
          onClick={handleCardClick}
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <CardHeader
            title={note.question}
            subheader={DateUtils.getDateStringFormated(
              note.lastUpdate,
              language
            )}
          />
          <CardContent className="note__note_content__column__column_card__card__tag_list">
            <TagList tagList={note.tagNames} />
          </CardContent>
        </MaterialCard>
      )}
    </Draggable>
  )
}

export default NoteContentColumnCard
