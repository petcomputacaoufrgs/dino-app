import React, { useState } from 'react'
import NoteBodyProps from './props'
import './styles.css'
import NoteEditDialog from '../note_edit_dialog'
import AgreementDialog from '../../../../components/agreement_dialog'
import { useLanguage } from '../../../../context_provider/app_settings'
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
  Droppable,
} from 'react-beautiful-dnd'
import NoteContentColumn from './column'
import NoteViewModel from '../../../../types/note/view/NoteViewModel'
import NoteDroppableType from '../../../../constants/NoteDroppableType'
import AddColumn from './add_column'
import NoteColumnDialog from '../column_dialog'
import { NoteColumnViewModel } from '../../../../types/note/view/NoteColumnViewModel'
import StringUtils from '../../../../utils/StringUtils'

const NoteContent: React.FC<NoteBodyProps> = ({
  tags,
  columns,
  onDragEnd,
  onSave,
  onSaveNew,
  onDeleteNote,
  onSaveColumn,
  onDeleteColumn,
  onAddNote,
  onClickNote
}): JSX.Element => {
  const language = useLanguage().current

  const [currentNote, setCurrentNote] = useState<NoteViewModel | undefined>(
    undefined
  )
  const [noteDialogOpen, setNoteDialogOpen] = useState(false)
  const [deleteNoteDialogOpen, setDeleteNoteDialogOpen] = useState(false)

  const [currentNoteColumn, setCurrentNoteColumn] = useState<
    NoteColumnViewModel | undefined
  >(undefined)
  const [noteColumnDialogOpen, setNoteColumnDialogOpen] = useState(false)
  const [deleteNoteColumnDialogOpen, setDeleteNoteColumnDialogOpen] = useState<
    boolean
  >(false)

  const [dragging, setDragging] = useState(false)

  //#region COLUMN

  const handleNoteColumnDialogClose = () => {
    closeNoteColumnDialog()
  }

  const handleAddColumn = () => {
    setNoteColumnDialogOpen(true)
  }

  const handleSaveNoteColumn = (
    column: NoteColumnViewModel,
    oldTitle?: string
  ) => {
    closeNoteColumnDialog()
    onSaveColumn(column, oldTitle)
  }

  const handleEditColumn = (column: NoteColumnViewModel) => {
    setCurrentNoteColumn(column)
    setNoteColumnDialogOpen(true)
  }

  const handleDeleteColumn = (column: NoteColumnViewModel) => {
    setCurrentNoteColumn(column)
    setDeleteNoteColumnDialogOpen(true)
  }

  const handleTitleAlreadyExists = (title: string): boolean =>
    columns.some(
      (column) =>
        StringUtils.normalize(column.title) === StringUtils.normalize(title)
    )

  const closeNoteColumnDialog = () => {
    setNoteColumnDialogOpen(false)
    setCurrentNoteColumn(undefined)
  }

  const handleDeleteColumnAgree = () => {
    if (currentNoteColumn) {
      onDeleteColumn(currentNoteColumn)
    }
    closeNoteColumnDeleteDialog()
  }

  const handleDeleteColumnDisagree = () => {
    closeNoteColumnDeleteDialog()
  }

  const closeNoteColumnDeleteDialog = () => {
    setDeleteNoteColumnDialogOpen(false)
    setCurrentNoteColumn(undefined)
  }

  //#endregion

  const handleDeleteNoteAgree = () => {
    if (currentNote) {
      onDeleteNote(currentNote)
    }

    setDeleteNoteColumnDialogOpen(false)
  }

  const handleDeleteNoteDisagree = () => {
    setDeleteNoteColumnDialogOpen(false)
  }

  const handleCloseCardDialog = () => {
    setNoteDialogOpen(false)
  }

  const handleOpenDeleteNoteDialog = (note: NoteViewModel) => {
    setCurrentNote(note)

    setDeleteNoteDialogOpen(true)
  }

  const handleSaveNote = (note: NoteViewModel) => {
    if (note) {
      onSave(note)
      setCurrentNote(undefined)
    }
    handleCloseCardDialog()
  }

  const handleSaveNewNote = (
    question: string,
    tagList: string[],
    answer: string
  ) => {
    onSaveNew(question, tagList, answer)
    handleCloseCardDialog()
  }

  const handleDragEnd = (result: DropResult, provided: ResponderProvided) => {
    setDragging(false)
    onDragEnd(result)
  }

  const handleStartEnd = () => {
    setDragging(true)
  }

  const getColumnMaxOrder = (): number => columns.length

  return (
    <div className="note__note_content">
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleStartEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type={NoteDroppableType.COLUMN}
        >
          {(provided) => (
            <div
              className="note__note_content__columns"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="note__note_content__columns__scroll">
                {columns.map((column, index) => (
                  <NoteContentColumn
                    column={column}
                    columnIndex={index}
                    key={index}
                    onClickNote={onClickNote}
                    onDelete={handleOpenDeleteNoteDialog}
                    onEditColumn={handleEditColumn}
                    onDeleteColumn={handleDeleteColumn}
                    onAddNote={onAddNote}
                  />
                ))}
                <AddColumn onAddColumn={handleAddColumn} />
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {currentNote && (
        <NoteEditDialog
          open={noteDialogOpen}
          note={currentNote}
          tagOptions={tags}
          onSave={handleSaveNote}
          onSaveNew={handleSaveNewNote}
          onClose={handleCloseCardDialog}
        />
      )}
      <NoteColumnDialog
        onClose={handleNoteColumnDialogClose}
        onSave={handleSaveNoteColumn}
        open={noteColumnDialogOpen}
        column={currentNoteColumn}
        order={getColumnMaxOrder()}
        titleAlreadyExists={handleTitleAlreadyExists}
      />
      <AgreementDialog
        onAgree={handleDeleteNoteAgree}
        onDisagree={handleDeleteNoteDisagree}
        question={language.DELETE_NOTE_ALERT_TITLE}
        description={language.DELETE_NOTE_ALERT_TEXT}
        agreeOptionText={language.AGREEMENT_OPTION_TEXT}
        disagreeOptionText={language.DISAGREEMENT_OPTION_TEXT}
        open={deleteNoteDialogOpen}
      />
      {currentNoteColumn &&
        <AgreementDialog
          question={
            currentNoteColumn?.notes.length > 0
              ? language.NOTE_COLUMN_DELETE_DIALOG_QUESTION
              : language.NOTE_COLUMN_WITH_NOTES_DELETE_DIALOG_QUESTION
          }
          description={
            currentNoteColumn?.notes.length > 0
              ? language.NOTE_COLUMN_DELETE_DIALOG_DESC
              : language.NOTE_COLUMN_WITH_NOTES_DELETE_DIALOG_DESC
          }
          disagreeOptionText={language.DISAGREEMENT_OPTION_TEXT}
          agreeOptionText={language.NOTE_COLUMN_DELETE_DIALOG_AGREE_TEXT}
          onAgree={handleDeleteColumnAgree}
          onDisagree={handleDeleteColumnDisagree}
          open={deleteNoteColumnDialogOpen}
        />
      }
    </div>
  )
}

export default NoteContent
