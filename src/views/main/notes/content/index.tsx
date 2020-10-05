import React, { useState } from 'react'
import NoteContentProps from './props'
import './styles.css'
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
import NoteDroppableType from '../../../../constants/note/NoteDroppableType'
import AddColumn from './add_column'
import NoteColumnDialog from '../column_dialog'
import { NoteColumnViewModel } from '../../../../types/note/view/NoteColumnViewModel'
import NoteCreateDialog from '../note_create_dialog'
import NoteInfoDialog from '../note_info_dialog'
import LogAppErrorService from '../../../../services/log_app_error/LogAppErrorService'
import ViewAddNoteOpenedWIthoutColumnError from '../../../../error/note/ViewAddNoteOpenedWIthoutColumnError'
import NoteColumnEntity from '../../../../types/note/database/NoteColumnEntity'

const NoteContent: React.FC<NoteContentProps> = ({
  tags,
  columns,
  searching,
  onDragEnd,
  onDeleteNote,
  onSaveColumn,
  onSaveNote,
  onDeleteColumn,
  onSaveNewNote,
  questionAlreadyExists,
}): JSX.Element => {
  const language = useLanguage().current

  const [currentNote, setCurrentNote] = useState<NoteViewModel | undefined>(
    undefined
  )
  const [currentNoteColumn, setCurrentNoteColumn] = useState<
    NoteColumnViewModel | undefined
  >(undefined)
  const [noteColumnDialogOpen, setNoteColumnDialogOpen] = useState(false)
  const [deleteNoteColumnDialogOpen, setDeleteNoteColumnDialogOpen] = useState<
    boolean
  >(false)

  const [noteCreateDialogOpen, setNoteCreateDialogOpen] = useState(false)
  const [noteInfoDialogOpen, setNoteInfoDialogOpen] = useState(false)

  const [dragging, setDragging] = useState(false)

  //#region COLUMN

  const handleNoteColumnDialogClose = () => {
    closeNoteColumnDialog()
  }

  const handleAddColumn = () => {
    setNoteColumnDialogOpen(true)
  }

  const handleSaveNoteColumn = (
    column: NoteColumnEntity,
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
    columns.some((column) => column.title === title)

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

  //#region NOTE

  const handleSaveNewNote = (question: string, tagList: string[]) => {
    setNoteCreateDialogOpen(false)
    setCurrentNoteColumn(undefined)
    if (currentNoteColumn) {
      onSaveNewNote(question, tagList, currentNoteColumn)
    } else {
      LogAppErrorService.saveError(new ViewAddNoteOpenedWIthoutColumnError())
    }
  }

  const handleAddNote = (column: NoteColumnViewModel) => {
    setCurrentNoteColumn(column)
    setNoteCreateDialogOpen(true)
  }

  const handleClickNote = (note: NoteViewModel) => {
    setCurrentNote(note)
    setNoteInfoDialogOpen(true)
  }

  const handleSaveNote = (
    question: string,
    answer: string,
    tagList: string[]
  ) => {
    if (currentNote) {
      currentNote.question = question
      currentNote.answer = answer
      currentNote.tagNames = tagList

      onSaveNote(currentNote)
    }

    handleCloseNoteInfoDialog()
  }

  const handleDeleteNote = () => {
    if (currentNote) {
      onDeleteNote(currentNote)
    }

    handleCloseNoteInfoDialog()
  }

  const handleCloseNoteEditDialog = () => {
    setNoteCreateDialogOpen(false)
    setCurrentNoteColumn(undefined)
    setCurrentNote(undefined)
  }

  const handleCloseNoteInfoDialog = () => {
    setNoteInfoDialogOpen(false)
    setCurrentNote(undefined)
  }

  //#endregion

  const handleDragEnd = (result: DropResult, provided: ResponderProvided) => {
    setDragging(false)
    onDragEnd(result)
  }

  const handleDragStart = () => {
    setDragging(true)
  }

  const getColumnMaxOrder = (): number => columns.length

  const renderDialogs = (): JSX.Element => (
    <>
      <NoteColumnDialog
        onClose={handleNoteColumnDialogClose}
        onSave={handleSaveNoteColumn}
        open={noteColumnDialogOpen}
        column={currentNoteColumn}
        order={getColumnMaxOrder()}
        titleAlreadyExists={handleTitleAlreadyExists}
      />
      {currentNoteColumn && (
        <AgreementDialog
          question={
            currentNoteColumn.notes.length === 0
              ? language.NOTE_COLUMN_DELETE_DIALOG_QUESTION
              : language.NOTE_COLUMN_WITH_NOTES_DELETE_DIALOG_QUESTION
          }
          description={
            currentNoteColumn.notes.length === 0
              ? language.NOTE_COLUMN_DELETE_DIALOG_DESC
              : language.NOTE_COLUMN_WITH_NOTES_DELETE_DIALOG_DESC
          }
          disagreeOptionText={language.DISAGREEMENT_OPTION_TEXT}
          agreeOptionText={language.NOTE_COLUMN_DELETE_DIALOG_AGREE_TEXT}
          onAgree={handleDeleteColumnAgree}
          onDisagree={handleDeleteColumnDisagree}
          open={deleteNoteColumnDialogOpen}
        />
      )}
      <NoteCreateDialog
        open={noteCreateDialogOpen}
        tagOptions={tags}
        onSave={handleSaveNewNote}
        onClose={handleCloseNoteEditDialog}
        questionAlreadyExists={questionAlreadyExists}
      />
      {currentNote && (
        <NoteInfoDialog
          note={currentNote}
          open={noteInfoDialogOpen}
          tagOptions={tags}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onClose={handleCloseNoteInfoDialog}
          questionAlreadyExists={questionAlreadyExists}
        />
      )}
    </>
  )

  const filteredColumns = columns.filter((column) => column.showBySearch)

  return (
    <div className="note__note_content">
      {searching && filteredColumns.length === 0 && (
        <div className="note__note_content__columns__scroll__clean_search">
          {language.NOTE_SEARCH_CLEAN}
        </div>
      )}
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
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
                {filteredColumns.map((column, index) => (
                  <NoteContentColumn
                    column={column}
                    columnIndex={index}
                    key={column.id}
                    searching={searching}
                    onClickNote={handleClickNote}
                    onEditColumn={handleEditColumn}
                    onDeleteColumn={handleDeleteColumn}
                    onAddNote={handleAddNote}
                  />
                ))}
                {!searching && (
                  <AddColumn
                    visible={!dragging}
                    columnCount={columns.length}
                    onAddColumn={handleAddColumn}
                  />
                )}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {renderDialogs()}
    </div>
  )
}

export default NoteContent
