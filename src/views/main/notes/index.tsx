import React, { useState } from 'react'
import Board, { moveCard } from '@lourenci/react-kanban'
import ReactKanbanCard from './react_kanban_card'
import NotesCardDialog from './card_dialog/index'
import Note from '../../../types/Note';
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import NoteSVG from '../../../images/note.svg'
import NotesService from '../../../services/NotesService'
import SearchBar from '../../../components/search_bar'
import './styles.css'

const HEADER_TEXT_FIELD_CLASS = 'notes_header_text_field'

const Notes = () => {

    const [data, setData] = useState(NotesService.getBoard())
    const [selectedData, setSelectedData] = useState(data)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [isNewNote, setIsNewNote] = useState(false)
    const [openModel, setOpenModel] = useState({} as Note)
    const [editingQuestion, setEditingQuestion] = useState(true)

    const handleCardMove = (card, source, destination) => {
      const updatedData = moveCard(selectedData, source, destination)

      const from = source.fromPosition

      const to = destination.toPosition

      NotesService.updateNotesOrderOnAPI(updatedData, from, to)

      setSelectedData(updatedData)
    }

    const handleCloseCardDialog = () => {
      setDialogOpen(false)
    }

    const handleSave = (id: number, text: string, tagList: string[]) => {
      const newData = {...data}
      
      if (isNewNote) {
        NotesService.addNewCard(text, newData, tagList)
      } else {
        NotesService.updateNote(id, text, editingQuestion, newData, tagList)
      }

      setDialogOpen(false)
      setData(newData)
      setSelectedData(newData)
    }

    const handleNewQuestion = () => {
      if (!editingQuestion) {
        setEditingQuestion(true)
      }
      setIsNewNote(true)
      setOpenModel({} as Note)
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
      setSelectedData(newData)
    }

    const handleSearch = (tagsSearch: string[]) => {
      const newData = NotesService.searchNotes(data, tagsSearch)

      setSelectedData(newData)
    }

    const renderColumnHeader = (): JSX.Element => (
        <div className='notes__column_header'>
            <img className='notes__column_header__image' src={NoteSVG} alt={'alt'}/>
            <SearchBar 
              textFieldClass={HEADER_TEXT_FIELD_CLASS}
              options={NotesService.getTags()}
              onSearch={handleSearch} />
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

    const updateListMarginTop = () => {
      const foundDivs = document.getElementsByClassName('sc-fzozJi GHGWz')

      if (foundDivs.length === 1) {
        const noteListContainer = foundDivs[0]

        setTimeout(() => {
          const textField: HTMLElement | null = document.querySelector('.' + HEADER_TEXT_FIELD_CLASS)

          if (textField) {

            const value = (textField.offsetHeight + 94).toString() + 'px'
            
            noteListContainer.setAttribute("style", "top: " + value + ";")
          }
        }, 0.1)
        
      }
    }

    updateListMarginTop()

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
                {selectedData}
            </Board>
            {renderAddButton()}
            <NotesCardDialog
              model={openModel}
              open={dialogOpen}
              tagOptions={NotesService.getTags()}
              newCard={isNewNote}
              questionCard={editingQuestion}
              onClose={handleCloseCardDialog}
              onSave={handleSave}
            />
        </div>
    )
}

export default Notes