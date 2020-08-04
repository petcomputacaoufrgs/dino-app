import React, { useState, useEffect } from 'react'
import Board, { moveCard } from '@lourenci/react-kanban'
import NoteCard from '../card'
import NoteBoardViewModel, {
  NoteBoardColumnViewModel,
} from '../../../../types/note/NoteBoardViewModel'
import NoteService from '../../../../services/note/NoteService'
import AnswerDialog from '../answer_dialog'
import QuestionDialog from '../question_dialog'
import AgreementDialog from '../../../../components/agreement_dialog'
import { useLanguage } from '../../../../context_provider/app_settings'
import AgreementDialogProps from '../../../../components/agreement_dialog/props'
import NoteViewModel from '../../../../types/note/NoteViewModel'
import BoardProps from './props'

const NoteBoard = (props: BoardProps): JSX.Element => {
  const language = useLanguage().current

  const [board, setBoard] = useState(createBoard([] as NoteViewModel[]))

  const [note, setNote] = useState(undefined as NoteViewModel | undefined)
  const [idNoteToDelete, setIdNoteToDelete] = useState(
    undefined as number | undefined
  )
  const [noteTags, setNoteTags] = useState([] as string[])
  const [answer, setAnswer] = useState('')
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false)

  useEffect(() => {
    setBoard(createBoard(props.viewNotes))
  }, [props.viewNotes])

  const handleOpenAnswerDialog = (noteView: NoteViewModel) => {
    setNote(noteView)
    setAnswer(noteView.answer)
    setAnswerDialogOpen(true)
  }

  const handleCloseAnswerDialog = () => {
    setAnswerDialogOpen(false)
  }

  const handleOpenEditQuestionDialog = (noteView: NoteViewModel) => {
    setNote(noteView)
    setQuestion(noteView.question)
    setNoteTags(noteView.tagNames)
    setQuestionDialogOpen(true)
  }

  const handleCloseQuestionDialog = () => {
    setQuestionDialogOpen(false)
  }

  const agreementDialogProps: AgreementDialogProps = {
    onAgree: () =>
      idNoteToDelete !== undefined && props.onDeleteNote(idNoteToDelete),
    question: language.DELETE_NOTE_ALERT_TITLE,
    description: language.DELETE_NOTE_ALERT_TEXT,
    agreeOptionText: language.AGREEMENT_OPTION_TEXT,
    disagreeOptionText: language.DISAGREEMENT_OPTION_TEXT,
  }

  const [DeleteDialog, showDeleteDialog] = AgreementDialog(agreementDialogProps)

  const handleOpenDeleteNoteDialog = (id: number) => {
    setIdNoteToDelete(id)

    showDeleteDialog()
  }

  const handleSaveAnswer = (answer: string) => {
    if (note) {
      props.onSaveAnswer(answer, note)
      setNote(undefined)
    }
    handleCloseAnswerDialog()
  }

  const handleSaveQuestion = (question: string, tags: string[]) => {
    if (note) {
      props.onSaveQuestion(question, tags, note)
      setNote(undefined)
    }
    handleCloseQuestionDialog()
  }

  const renderUpdateAnswerDialog = (): JSX.Element => (
    <AnswerDialog
      open={answerDialogOpen}
      answer={answer}
      onSave={handleSaveAnswer}
      onClose={handleCloseAnswerDialog}
    />
  )

  const renderUpdateQuestionDialog = (): JSX.Element => (
    <QuestionDialog
      open={questionDialogOpen}
      question={question}
      tagList={noteTags}
      tagOptions={props.tags}
      onSave={handleSaveQuestion}
      onClose={handleCloseQuestionDialog}
    />
  )

  const handleCardMove = (card, source, destination) => {
    const newBoard: NoteBoardViewModel = moveCard(board, source, destination)

    NoteService.updateNotesOrder(newBoard.columns[0].cards)

    setBoard(newBoard)
  }

  const renderCard = (
    cardNote: NoteViewModel,
    dragging: boolean
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

  return (
    <>
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
      {renderUpdateAnswerDialog()}
      {renderUpdateQuestionDialog()}
      <DeleteDialog />
    </>
  )
}

const createBoard = (cards: NoteViewModel[]) =>
  ({
    columns: [
      {
        id: 0,
        cards: cards,
      } as NoteBoardColumnViewModel,
    ] as NoteBoardColumnViewModel[],
  } as NoteBoardViewModel)

export default NoteBoard
