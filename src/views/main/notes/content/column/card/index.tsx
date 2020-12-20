import React from 'react'
import DateUtils from '../../../../../../utils/DateUtils'
import TagList from '../../../../../../components/tag_list/index'
import MaterialCard from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import NoteBodyColumnCardProps from './props'
import { Draggable } from 'react-beautiful-dnd'
import { CardActions } from '@material-ui/core'
import './styles.css'
import { useUserSettings } from '../../../../../../context/provider/user_settings'

const NoteContentColumnCard: React.FC<NoteBodyColumnCardProps> = ({
  note,
  noteIndex,
  columnIndex,
  searching,
  onClickNote,
}) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  
  const handleCardClick = () => {
    onClickNote(note)
  }
  return (
    <Draggable
      draggableId={columnIndex.toString() + '_' + noteIndex}
      index={noteIndex}
      isDragDisabled={searching}
    >
      {(provided) => (
        <MaterialCard
          className={'note__note_content__column__column_card'}
          onClick={handleCardClick}
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          data-dino-draggable={true}
        >
          <CardHeader
            title={note.question}
            subheader={DateUtils.getDateStringFormated(
              note.lastUpdate!,
              language
            )}
          />
          <CardContent className="note__note_content__column__column_card__card__card_content">
            <TagList tagList={note.tags} />
          </CardContent>
          {note.answer && note.answer.length > 0 && (
            <CardActions className="note__note_content__column__column_card__card__card_answer">
              <p>{note.answer}</p>
            </CardActions>
          )}
        </MaterialCard>
      )}
    </Draggable>
  )
}

export default NoteContentColumnCard
