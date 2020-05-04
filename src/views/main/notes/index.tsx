import React, { useState, useContext } from 'react'
import { DateTime } from 'luxon'
import { LanguageContext } from '../../../components/language_provider'
import StringUtils from '../../../utils/StringUtils'
import Board, { moveCard } from '@lourenci/react-kanban'
import NoteCard from './note_card'
import AnswerDialog from './answer_dialog'
import QuestionDialog from './question_dialog'
import NoteViewModel from '../../../model/view/NoteViewModel';
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import NoteSVG from '../../../images/note.svg'
import NotesService from '../../../services/NotesService'
import SearchBar from '../../../components/search_bar'
import NoteBoardViewModel from '../../../model/view/NoteBoardViewModel'
import { NoteBoardColumnViewModel } from '../../../model/view/NoteBoardViewModel'
import AgreementDialogProps from '../../../components/generic_agreement_dialog/props'
import AgreementDialog from '../../../components/generic_agreement_dialog'
import DinoAPIGeneralConstants from '../../../constants/dino_api/DinoAPIGeneralConstants'
import './styles.css'

const HEADER_TEXT_FIELD_CLASS = 'notes_header_text_field'

const Notes = () => {

    const languageProvider = useContext(LanguageContext)
    const language = languageProvider.currentLanguage

    const [answer, setAnswer] = useState('')
    const [answerDialogOpen, setAnswerDialogOpen] = useState(false)
    const [question, setQuestion] = useState('')
    const [tagList, setTagList] = useState([] as string[])
    const [questionDialogOpen, setQuestionDialogOpen] = useState(false)
    const [newQuestionDialogOpen, setNewQuestionDialogOpen] = useState(false)
    const [textSearch, setTextSearch] = useState('')
    const [tagSearch, setTagSearch] = useState([] as string[])
    const [note, setNote] = useState(undefined as NoteViewModel | undefined)
    const [board, setBoard] = useState({
      columns: [
        {
          'id': 0,
          'cards': NotesService.getSavedNotes()
        } as NoteBoardColumnViewModel
      ] as NoteBoardColumnViewModel[]
    } as NoteBoardViewModel)
    const [idNoteToDelete, setIdNoteToDelete] = useState(undefined as number | undefined)

    //#region Editing Answer
    const handleOpenAnswerDialog = (note: NoteViewModel) => {
      setNote(note)
      setAnswer(note.answer)
      setAnswerDialogOpen(true)
    }

    const handleSaveAnswer = (newAnswer: string) => {
      if (!note) {
        return
      }

      const newData = {...board}

      const notes = newData.columns[0].cards

      const editedNote = notes.find(n => n.id === note.id)

      if (editedNote) {
        editedNote.answer = newAnswer
        editedNote.answered = true

        NotesService.updateNoteAnswer(editedNote)
      }

      setNote(undefined)
      setBoard(newData)
      setAnswerDialogOpen(false)
    } 

    const handleCloseAnswerDialog = () => {
      setAnswerDialogOpen(false)
    }

    const renderUpdateAnswerDialog = (): JSX.Element => (
      <AnswerDialog 
        open={answerDialogOpen}
        answer={answer}
        onSave={handleSaveAnswer}
        onClose={handleCloseAnswerDialog}
      />
    )

    //#endregion

    //#region Editing Question

    const handleOpenEditQuestionDialog = (note: NoteViewModel) => {
      setNote(note)
      setQuestion(note.question)
      setTagList(note.tagNames)
      setQuestionDialogOpen(true)
    }

    const handleSaveQuestion = (newQuestion: string, newTagNames: string[]) => {
      if (!note) {
        return
      }

      const newData = {...board}

      const editedNote = newData.columns[0].cards.find(n => n.id === note.id)

      if (editedNote) {
        editedNote.question = newQuestion
        editedNote.tagNames = newTagNames

        NotesService.updateNoteQuestion(editedNote)
      }

      setNote(undefined)
      setBoard(newData)
      setQuestionDialogOpen(false)
    }

    const handleCloseQuestionDialog = () => {
      setQuestionDialogOpen(false)
    }

    const renderUpdateQuestionDialog = (): JSX.Element => (
      <QuestionDialog 
        open={questionDialogOpen}
        question={question}
        tagList={tagList}
        tagOptions={NotesService.getSavedTags().map(tag => tag.name)}
        onSave={handleSaveQuestion}
        onClose={handleCloseQuestionDialog}
      />
    )

    //#endregion 

    //#region Deleting Note

    const handleOpenDeleteNoteDialog = (id: number) => {
      setIdNoteToDelete(id)

      showDeleteDialog()
    }

    const handleDeleteNote = () => {
      const newData = {...board}

      const notes = newData.columns[0].cards

      const deletedNote = notes.find(note => note.id === idNoteToDelete)

      const newNotes = notes.filter(note => note.id !== idNoteToDelete)

      if (deletedNote) {
        NotesService.deleteNote(deletedNote)
      }
      
      newData.columns[0].cards = newNotes

      setBoard(newData)
    }

    const agreementDialogProps: AgreementDialogProps = {
      onAgree: handleDeleteNote,
      question: language.DELETE_NOTE_ALERT_TITLE,
      description: language.DELETE_NOTE_ALERT_TEXT,
      agreeOptionText: language.AGREEMENT_OPTION_TEXT,
      disagreeOptionText: language.DISAGREEMENT_OPTION_TEXT
    }

    const [DeleteDialog, showDeleteDialog] = AgreementDialog(agreementDialogProps)

    //#endregion
    
    //#region Adding new Note

    const handleOpenNewQuestionDialog = () => {
      setNewQuestionDialogOpen(true)
    }

    const handleSaveNewQuestion = (newQuestion: string, newTagNames: string[]) => {
      const newBoard = {...board}

      const newNotes = newBoard.columns[0].cards

      const newId = newNotes.length

      const date = DateTime.local().setZone(DinoAPIGeneralConstants.DEFAULT_TIMEZONE).toMillis()

      const newNote: NoteViewModel = {
        answer: '',
        answered: false,
        question: newQuestion,
        id: newId,
        tagNames: newTagNames,
        showByTag: hasSomeTag(newTagNames, tagSearch),
        showByQuestion: hasText(newQuestion, textSearch),
        lastUpdate: date,
        savedOnServer: false
      }

      NotesService.saveNote(newNote)

      newNotes.push(newNote)
      
      setBoard(newBoard)
      setNewQuestionDialogOpen(false)
    }

    const handleCloseNewQuestionDialog = () => {
      setNewQuestionDialogOpen(false)
    }

    const renderNewQuestionDialog = (): JSX.Element => (
      <QuestionDialog 
        open={newQuestionDialogOpen}
        question={''}
        tagList={[]}
        tagOptions={NotesService.getSavedTags().map(tag => tag.name)}
        onSave={handleSaveNewQuestion}
        onClose={handleCloseNewQuestionDialog}
      />
    )

    //#endregion

    //#region Searching

    const handleTagSearch = (newTagSearch: string[]) => {
      const newBoard = {...board}

      const notes = newBoard.columns[0].cards

      setTagSearch(newTagSearch)

      notes.forEach(n => {
        n.showByTag = hasSomeTag(n.tagNames, newTagSearch)
        n.showByQuestion = false
      })

      setBoard(newBoard)
    }

    const handleTextSearch = (newTextSearch: string) => {
      const newBoard = {...board}

      const notes = newBoard.columns[0].cards


      setTextSearch(newTextSearch)

      notes.forEach(n => {
        n.showByTag = hasSomeTag(n.tagNames, tagSearch, newTextSearch)
        n.showByQuestion = hasText(n.question, newTextSearch)
      })

      setBoard(newBoard)
    }

    const hasText = (nodeText: string, searchText: string): boolean => {
      if(searchText.trim()) {
        return StringUtils.contains(nodeText, searchText)
      }

      return tagSearch.length === 0
    }

    const hasSomeTag = (nodeTagNames: string[], searchTags: string[], tSearch?: string): boolean => {
      if (searchTags.length > 0) {
        return nodeTagNames.some(name => searchTags.includes(name))
      } 

      if (tSearch && tSearch.length !== 0) {
        return false
      } 
      
      return true
    }


    const renderSearchBar = (): JSX.Element => (
      <SearchBar 
        options={NotesService.getSavedTags().map(tag => tag.name)}
        onTagSearch={handleTagSearch}
        onTextSearch={handleTextSearch} 
        textFieldClass={HEADER_TEXT_FIELD_CLASS}
      />
    )
    
    //#endregion

    //#region Moving card
    const handleCardMove = (card, source, destination) => {
      const newBoard: NoteBoardViewModel  = moveCard(board, source, destination)

      NotesService.updateNotesOrder(newBoard.columns[0].cards)

      setBoard(newBoard)
    }
    //#endregion
   
    const renderColumnHeader = (): JSX.Element => (
      <div className='notes__column_header'>
          <img className='notes__column_header__image' src={NoteSVG} alt={language.NOTES_HEADER_IMAGE_DESC}/>
          {renderSearchBar()}
      </div>
    )
    
    const renderCard = (cardNote: NoteViewModel, dragging: boolean): JSX.Element => (
        <>
        {(cardNote.showByTag || cardNote.showByQuestion) &&
          <NoteCard 
            dragging={dragging}
            note={cardNote}
            onEditQuestion={handleOpenEditQuestionDialog}
            onEditAnswer={handleOpenAnswerDialog}
            onDelete={handleOpenDeleteNoteDialog}>
          </NoteCard>
        }
        </>
    )

    const renderAddButton = (): JSX.Element => (
      <Fab onClick={handleOpenNewQuestionDialog} className='notes__add' aria-label={language.NOTES_ADD_BUTTON}>
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
                renderCard={(cardNote, { dragging }) => (
                    renderCard(cardNote, dragging)
                )}
                renderColumnHeader = {renderColumnHeader}
                onCardDragEnd = {handleCardMove}
                allowAddColumn = {false}
                allowRemoveColumn = {false}
                allowRenameColumn = {false}
                disableColumnDrag = {true}
                
            >
                {board}
            </Board>
            {renderAddButton()}
            {renderUpdateAnswerDialog()}
            {renderUpdateQuestionDialog()}
            {renderNewQuestionDialog()}
            <DeleteDialog />
        </div>
    )
}

export default Notes