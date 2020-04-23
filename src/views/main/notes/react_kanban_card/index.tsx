import React, { useState, useEffect } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
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
import CardProps from './props'
import './styles.css'
import Note from '../../../../types/Note';
import TagList from '../../../../components/tag_list/index';

const ReactKanbanCard = (props: CardProps): JSX.Element => {
    const classes = useStyles()

    const [expanded, setExpanded] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [content, setContent] = useState(props.content as Note)

    const handleEditQuestion = () => {
        props.onEditQuestion(content)
    }

    const handleEditAnswer = () => {
        props.onEditAnswer(content)
    }

    const handleExpand = () => {
        if (content.answered) {
            setExpanded(!expanded)
        }
    }

    const handleDelete = () => {
        props.onDelete(content.id)
    }

    const showCardDoneMessage = () => {
        console.log('done')
    }

    const showCardWaitingResponseMessage = () => {
        console.log('waiting')
    }

    const renderStateButton = (): JSX.Element => {
        const done = content.answered

        const icon = done ?  <DoneOutlineIcon /> : <QueryBuilderIcon />
        const onClick = done ? showCardDoneMessage : showCardWaitingResponseMessage

        return (
            <IconButton onClick={onClick} aria-label='state'>
                {icon}
            </IconButton>
        )
    }

    useEffect((() => {
        setDragging(props.dragging)

        if (expanded && props.dragging) {
            setExpanded(false)
        } 

        if (props.content !== content) {
            setContent(content)
        }

    }), [props.dragging, props.content, expanded, content])

    const renderMore = (): JSX.Element => {
        if (content.answered) { 
            return (
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded
                    })}
                    onClick={handleExpand}
                    aria-expanded={expanded}
                    aria-label="show more"
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
            title={content.question}
            subheader="September 14, 2016"
        />
    )

    const renderTags = (): JSX.Element => (
        <CardContent className='card__tag_list'>
            <TagList
                tagList={content.tagList}
            />
        </CardContent>
    )

    const renderActions = (): JSX.Element => (
        <CardActions disableSpacing>
            <IconButton onClick={handleEditAnswer} aria-label=''>
                <AssignmentTurnedInIcon />
            </IconButton>
            <IconButton onClick={handleEditQuestion} arie-label=''>
                <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete} aria-label=''>
                <DeleteIcon />                 
            </IconButton>
            {renderMore()}
        </CardActions>
    )

    const renderCollapse = (): JSX.Element => (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
                <Typography paragraph>
                    {content.answer}
                </Typography>
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
      maxWidth: 345
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(180deg)"
    }
  })
);

export default ReactKanbanCard