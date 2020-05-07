import React, { useState, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import StringUtils from '../../../utils/StringUtils'
import Board, { moveCard } from '@lourenci/react-kanban'
import NoteCard from './note_card'
import AnswerDialog from './answer_dialog'
import QuestionDialog from './question_dialog'
import NoteViewModel from './model/NoteViewModel'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import NoteSVG from '../../../images/note.svg'
import NoteBoardViewModel from './model/NoteBoardViewModel'
import { NoteBoardColumnViewModel } from './model/NoteBoardViewModel'
import AgreementDialogProps from '../../../components/agreement_dialog/props'
import AgreementDialog from '../../../components/agreement_dialog'
import TagSearchBar from '../../../components/tag_search_bar/index'
import { useLanguage } from '../../../provider/app_provider/index'
import NoteService from '../../../services/note/NoteService'
import './styles.css'
import DateUtils from '../../../utils/DateUtils'

const HEADER_TEXT_FIELD_CLASS = 'notes_header_text_field'

const Notes = () => {
  const language = useLanguage().currentLanguage

  const [answer, setAnswer] = useState('')
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false)
  const [newQuestionDialogOpen, setNewQuestionDialogOpen] = useState(false)
  const [textSearch, setTextSearch] = useState('')
  const [tagSearch, setTagSearch] = useState([] as string[])
  const [note, setNote] = useState(undefined as NoteViewModel | undefined)
  const [noteTags, setNoteTags] = useState([] as string[])
  const [board, setBoard] = useState({
    columns: [] as NoteBoardColumnViewModel[],
  } as NoteBoardViewModel)
  const [tags, setTags] = useState([] as string[])
  const [idNoteToDelete, setIdNoteToDelete] = useState(
    undefined as number | undefined,
  )

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

    const newData = { ...board }

    const notes = newData.columns[0].cards

    const editedNote = notes.find((n) => n.id === note.id)

    if (editedNote) {
      editedNote.answer = newAnswer
      editedNote.answered = true

      NoteService.updateNoteAnswer(editedNote)
    }

    setNote(undefined)
    setBoard(newData)
    setAnswerDialogOpen(false)
  }

  const handleCloseAnswerDialog = () => {
    setAnswerDialogOpen(false)
  }

  //#endregion

  //#region Editing Question

  const handleOpenEditQuestionDialog = (note: NoteViewModel) => {
    setNote(note)
    setQuestion(note.question)
    setNoteTags(note.tagNames)
    setQuestionDialogOpen(true)
  }

  const handleSaveQuestion = (newQuestion: string, newTagNames: string[]) => {
    if (!note) {
      return
    }

    const newData = { ...board }

    const editedNote = newData.columns[0].cards.find(
      (n) => n.question === note.question,
    )

    if (editedNote) {
      const date = DateUtils.getDatetimeInMillis()

      editedNote.question = newQuestion
      editedNote.tagNames = newTagNames
      editedNote.lastUpdate = date

      NoteService.updateNoteQuestion(editedNote, updateState)
    }

    setNote(undefined)
    setBoard(newData)
    setQuestionDialogOpen(false)
  }

  const handleCloseQuestionDialog = () => {
    setQuestionDialogOpen(false)
  }

  //#endregion

  //#region Deleting Note

  const handleOpenDeleteNoteDialog = (id: number) => {
    setIdNoteToDelete(id)

    showDeleteDialog()
  }

  const handleDeleteNote = () => {
    const newData = { ...board }

    const notes = newData.columns[0].cards

    const deletedNote = notes.find((note) => note.id === idNoteToDelete)

    const newNotes = notes.filter((note) => note.id !== idNoteToDelete)

    if (deletedNote) {
      NoteService.deleteNote(deletedNote, updateState)
    }

    newData.columns[0].cards = newNotes

    setBoard(newData)
  }

  const agreementDialogProps: AgreementDialogProps = {
    onAgree: handleDeleteNote,
    question: language.DELETE_NOTE_ALERT_TITLE,
    description: language.DELETE_NOTE_ALERT_TEXT,
    agreeOptionText: language.AGREEMENT_OPTION_TEXT,
    disagreeOptionText: language.DISAGREEMENT_OPTION_TEXT,
  }

  const [DeleteDialog, showDeleteDialog] = AgreementDialog(agreementDialogProps)

  //#endregion

  //#region Adding new Note

  const handleOpenNewQuestionDialog = () => {
    setNewQuestionDialogOpen(true)
  }

  const handleSaveNewQuestion = (
    newQuestion: string,
    newTagNames: string[],
  ) => {
    const newBoard = { ...board }

    const newNotes = newBoard.columns[0].cards

    const newId = newNotes.length

    const date = DateUtils.getDatetimeInMillis()

    const newNote: NoteViewModel = {
      answer: '',
      answered: false,
      question: newQuestion,
      id: newId,
      tagNames: newTagNames,
      showByTag: hasSomeTag(newTagNames, tagSearch),
      showByQuestion: hasText(newQuestion, textSearch),
      lastUpdate: date,
      savedOnServer: false,
    }

    NoteService.saveNote(newNote, updateState)

    newNotes.push(newNote)

    setBoard(newBoard)
    setNewQuestionDialogOpen(false)
  }

  const handleCloseNewQuestionDialog = () => {
    setNewQuestionDialogOpen(false)
  }

  //#endregion

  //#region Searching

  const handleTagSearch = (newTagSearch: string[]) => {
    const newBoard = { ...board }

    const notes = newBoard.columns[0].cards

    setTagSearch(newTagSearch)

    notes.forEach((n) => {
      n.showByTag = hasSomeTag(n.tagNames, newTagSearch)
      n.showByQuestion = false
    })

    setBoard(newBoard)
  }

  const handleTextSearch = (newTextSearch: string) => {
    const newBoard = { ...board }

    const notes = newBoard.columns[0].cards

    setTextSearch(newTextSearch)

    notes.forEach((n) => {
      n.showByTag = hasSomeTag(n.tagNames, tagSearch, newTextSearch)
      n.showByQuestion = hasText(n.question, newTextSearch)
    })

    setBoard(newBoard)
  }

  const hasText = (nodeText: string, searchText: string): boolean => {
    if (searchText.trim()) {
      return StringUtils.contains(nodeText, searchText)
    }

    return tagSearch.length === 0
  }

  const hasSomeTag = (
    nodeTagNames: string[],
    searchTags: string[],
    tSearch?: string,
  ): boolean => {
    if (searchTags.length > 0) {
      return nodeTagNames.some((name) => searchTags.includes(name))
    }

    if (tSearch && tSearch.length !== 0) {
      return false
    }

    return true
  }

  //#endregion

  //#region Moving card
  const handleCardMove = (card, source, destination) => {
    const newBoard: NoteBoardViewModel = moveCard(board, source, destination)

    NoteService.updateNotesOrder(newBoard.columns[0].cards)

    setBoard(newBoard)
  }
  //#endregion

  //#region Render

  const renderSearchBar = (): JSX.Element => (
    <TagSearchBar
      options={tags}
      onTagSearch={handleTagSearch}
      onTextSearch={handleTextSearch}
      textFieldClass={HEADER_TEXT_FIELD_CLASS}
    />
  )

  const renderHeader = (): JSX.Element => (
    <div className={isMobile ? 'notes__header' : 'notes__header_desktop'}>
      <img
        className="notes__header__image"
        src={NoteSVG}
        alt={language.NOTES_HEADER_IMAGE_DESC}
      />
      {renderSearchBar()}
    </div>
  )

  const renderCard = (
    cardNote: NoteViewModel,
    dragging: boolean,
  ): JSX.Element => (
    <>
      {(cardNote.showByTag || cardNote.showByQuestion) && (
        <NoteCard
          dragging={dragging}
          note={cardNote}
          onEditQuestion={handleOpenEditQuestionDialog}
          onEditAnswer={handleOpenAnswerDialog}
          onDelete={handleOpenDeleteNoteDialog}
        ></NoteCard>
      )}
    </>
  )

  const renderBoard = () => (
    <Board
      renderCard={(cardNote, { dragging }) => renderCard(cardNote, dragging)}
      onCardDragEnd={handleCardMove}
      allowAddColumn={false}
      allowRemoveColumn={false}
      allowRenameColumn={false}
      disableColumnDrag={true}
    >
      {board}
    </Board>
  )

  const renderUpdateQuestionDialog = (): JSX.Element => (
    <QuestionDialog
      open={questionDialogOpen}
      question={question}
      tagList={noteTags}
      tagOptions={tags}
      onSave={handleSaveQuestion}
      onClose={handleCloseQuestionDialog}
    />
  )

  const renderAddButton = (): JSX.Element => (
    <Fab
      onClick={handleOpenNewQuestionDialog}
      className="notes__add"
      aria-label={language.NOTES_ADD_BUTTON}
    >
      <AddIcon />
    </Fab>
  )

  const renderNewQuestionDialog = (): JSX.Element => (
    <QuestionDialog
      open={newQuestionDialogOpen}
      question={''}
      tagList={[]}
      tagOptions={tags}
      onSave={handleSaveNewQuestion}
      onClose={handleCloseNewQuestionDialog}
    />
  )

  const renderUpdateAnswerDialog = (): JSX.Element => (
    <AnswerDialog
      open={answerDialogOpen}
      answer={answer}
      onSave={handleSaveAnswer}
      onClose={handleCloseAnswerDialog}
    />
  )

  //#endregion

  useEffect(() => {
    if (board.columns.length === 0) {
      const notesPromisse = NoteService.getNotes()

      notesPromisse
        .then((notes) =>
          setBoard({
            columns: [
              {
                id: 0,
                cards: notes,
              } as NoteBoardColumnViewModel,
            ] as NoteBoardColumnViewModel[],
          } as NoteBoardViewModel),
        )
        .catch()

      const tagsPromise = NoteService.getTags()

      tagsPromise.then((tags) => setTags(tags)).catch()
    }
  })

  const updateState = async () => {
    const tags = await NoteService.getTags()

    setTags(tags)
  }

  const updateListMarginTop = () => {
    const foundDivs = document.getElementsByClassName('sc-fzozJi GHGWz')

    if (foundDivs.length === 1) {
      const noteListContainer = foundDivs[0]

      setTimeout(() => {
        const textField: HTMLElement | null = document.querySelector(
          '.' + HEADER_TEXT_FIELD_CLASS,
        )

        if (textField) {
          const fixValue = isMobile ? 94 : 144

          const value = (textField.offsetHeight + fixValue).toString() + 'px'

          noteListContainer.setAttribute('style', 'top: ' + value + ';')
        }
      }, 0.1)
    }
  }

  updateListMarginTop()

  return (
    <div className={'notes' + (!isMobile && ' notes_desktop')}>
      {renderHeader()}
      {renderBoard()}
      {renderAddButton()}
      {renderUpdateAnswerDialog()}
      {renderUpdateQuestionDialog()}
      {renderNewQuestionDialog()}
      <DeleteDialog />
    </div>
  )
}

export default Notes
