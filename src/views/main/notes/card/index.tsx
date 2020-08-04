import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../../provider/app_settings_provider'
import clsx from 'clsx'
import DateUtils from '../../../../utils/DateUtils'
import TagList from '../../../../components/tag_list/index'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import MaterialCard from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline'
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder'
import EditIcon from '@material-ui/icons/Edit'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import NoteCardProps from './props'
import './styles.css'

const NoteCard = (props: NoteCardProps): JSX.Element => {
  const language = useLanguage().current

  const classes = useStyles()

  const [expanded, setExpanded] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [note, setNote] = useState(props.note)

  const handleEditQuestion = () => {
    props.onEditQuestion(note)
  }

  const handleEditAnswer = () => {
    props.onEditAnswer(note)
  }

  const handleExpand = () => {
    if (note.answered) {
      setExpanded(!expanded)
    }
  }

  const handleDelete = () => {
    props.onDelete(note.id)
  }

  useEffect(() => {
    setDragging(props.dragging)
    setNote(props.note)

    if (expanded && props.dragging) {
      setExpanded(false)
    }
  }, [
    props.dragging,
    props.note.question,
    props.note.tagNames,
    props.note.answer,
    props.note.answered,
    props.note,
    expanded,
  ])

  const renderStateButton = (): JSX.Element => {
    const done = note.answered
    const icon = done ? <DoneOutlineIcon /> : <QueryBuilderIcon />
    const state = done ? language.NOTE_STATE_DONE : language.NOTE_STATE_NOT_DONE

    return <IconButton aria-label={state}>{icon}</IconButton>
  }

  const renderMore = (): JSX.Element => {
    if (note.answered) {
      return (
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpand}
          aria-expanded={expanded}
          aria-label={language.NOTE_SHOW_ANSWER}
        >
          <ExpandMoreIcon />
        </IconButton>
      )
    }

    return <></>
  }

  const renderHeader = (): JSX.Element => (
    <CardHeader
      action={renderStateButton()}
      title={note.question}
      subheader={DateUtils.getDateStringFormated(note.lastUpdate, language)}
    />
  )

  const renderTags = (): JSX.Element => (
    <CardContent className="card__tag_list">
      <TagList tagList={note.tagNames} />
    </CardContent>
  )

  const renderActions = (): JSX.Element => (
    <CardActions disableSpacing>
      <IconButton
        onClick={handleEditAnswer}
        aria-label={language.NOTE_EDIT_ANSWER_BUTTON}
      >
        <AssignmentTurnedInIcon />
      </IconButton>
      <IconButton
        onClick={handleEditQuestion}
        aria-label={language.NOTE_EDIT_QUESTION_BUTTON}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        onClick={handleDelete}
        aria-label={language.NOTE_DELETE_BUTTON}
      >
        <DeleteIcon />
      </IconButton>
      {renderMore()}
    </CardActions>
  )

  const renderCollapse = (): JSX.Element => (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent>
        <Typography paragraph>{note.answer}</Typography>
      </CardContent>
    </Collapse>
  )

  const getMainClass = (): string => {
    let main_class = 'react_kanban_card'

    if (dragging) {
      main_class = main_class + ' dragging'
    }

    return main_class
  }

  return (
    <MaterialCard className={getMainClass()}>
      {renderHeader()}
      {renderTags()}
      {renderActions()}
      {renderCollapse()}
    </MaterialCard>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
  })
)

export default NoteCard
