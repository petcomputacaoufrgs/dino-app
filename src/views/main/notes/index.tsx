import React, { useState } from 'react'
import Board, { moveCard } from '@lourenci/react-kanban'
import ReactKanbanCard from './react_kanban_card'
import NotesCardDialog from './card_dialog/index'
import Note from '../../../types/Note'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography'
import NoteSVG from '../../../images/note.svg'
import NotesService from '../../../services/NotesService'
import './styles.css'

const Notes = () => {

    const [data, setData] = useState(NotesService.getBoard())
    const [dialogOpen, setDialogOpen] = useState(false)
    const [isNewNote, setIsNewNote] = useState(false)
    const [openModel, setOpenModel] = useState({} as Note)
    const [editingQuestion, setEditingQuestion] = useState(true)

    const handleCardMove = (card, source, destination) => {

      const updatedData = moveCard(data, source, destination);

      const from = source.fromPosition

      const to = destination.toPosition

      const newData = NotesService.updateNotesOrder(data, from, to)

      setData(newData)
    }

    const handleCloseCardDialog = () => {
      setDialogOpen(false)
    }

    const handleSave = (id: number, text: string) => {
      const newData = {...data}
      
      if (isNewNote) {
        NotesService.addNewCard(text, newData)
      } else {
        NotesService.updateNote(id, text, editingQuestion, newData)
      }

      setData(newData)
      setDialogOpen(false)
    }

    const handleNewQuestion = () => {
      if (!editingQuestion) {
        setEditingQuestion(true)
      }
      setIsNewNote(true)
      setDialogOpen(true)
    }

    const handleEditQuestion = (model: Note) => {
      if (!editingQuestion) {
        setEditingQuestion(true)
      }
      handleEdit(model)
    }

    const handleEditAnswer = (model: Note) => {
      if (editingQuestion) {
        setEditingQuestion(false)
      }
      handleEdit(model)
    }

    const handleEdit = (model: Note) => {
      setIsNewNote(false)
      setOpenModel(model)
      setDialogOpen(true)
    }

    const handleDelete = (id: number) => {
      const newData = {...data}

      NotesService.removeNoteById(newData, id)

      setData(newData)
    }

    const renderColumnHeader = (): JSX.Element => (
        <div className='notes__column_header'>
            <img className='notes__column_header__image' src={NoteSVG} alt={'alt'}/>
            <Typography className='notes__column_header_text' variant="h5" component="h2">
                Notas
            </Typography> 
        </div>
    )

    const renderCard = (content: any, dragging: any): JSX.Element => (
        <ReactKanbanCard 
            dragging={dragging}
            content={content}
            onEditQuestion={handleEditQuestion}
            onEditAnswer={handleEditAnswer}
            onDelete={handleDelete}>
        </ReactKanbanCard>
    )

    const renderAddButton = (): JSX.Element => (
      <Fab onClick={handleNewQuestion} className='notes__add' aria-label="add">
        <AddIcon />
      </Fab>
    )

    return (
        <div className='notes'>
            <Board
                renderCard={(content, { dragging }) => (
                    renderCard(content, dragging)
                )}
                renderColumnHeader = {renderColumnHeader}
                onCardDragEnd = {handleCardMove}
                allowAddColumn = {false}
                allowRemoveColumn = {false}
                allowRenameColumn = {false}
                disableColumnDrag = {true}
                
            >
                {data}
            </Board>
            {renderAddButton()}
            <NotesCardDialog
              model={openModel}
              open={dialogOpen}
              newCard={isNewNote}
              questionCard={editingQuestion}
              onClose={handleCloseCardDialog}
              onSave={handleSave}
            />
        </div>
    )

}

export default Notes