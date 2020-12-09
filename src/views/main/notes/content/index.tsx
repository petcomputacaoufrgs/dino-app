import React, { useState } from 'react'
import NoteContentProps from './props'
import './styles.css'
import AgreementDialog from '../../../../components/agreement_dialog'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
  Droppable,
} from 'react-beautiful-dnd'
import NoteContentColumn from './column'
import NoteDroppableType from '../../../../constants/note/NoteDroppableType'
import AddColumn from './add_column'
import NoteColumnDialog from '../column_dialog'
import NoteCreateDialog from '../note_create_dialog'
import NoteInfoDialog from '../note_info_dialog'
import LogAppErrorService from '../../../../services/log_app_error/LogAppErrorService'
import ViewAddNoteOpenedWIthoutColumnError from '../../../../error/note/ViewAddNoteOpenedWIthoutColumnError'
import NoteColumnEntity from '../../../../types/note/database/NoteColumnEntity'
import NoteEntity from '../../../../types/note/database/NoteEntity'
import NoteView from '../../../../types/note/view/NoteView'

const NoteContent: React.FC<NoteContentProps> = ({
  column,
  tags,
  noteView,
  searching,
  onDragEnd,
  onDeleteNote,
  onSaveColumn,
  onSaveNote,
  onDeleteColumn,
  onSaveNewNote,
  questionAlreadyExists,
}): JSX.Element => {
  const language = useCurrentLanguage()
  const [currentNote, setCurrentNote] = useState<NoteEntity | undefined>(
    undefined
  )
  const [currentNoteView, setCurrentNoteView] = useState<
    NoteView | undefined
  >(undefined)
  const [noteColumnDialogOpen, setNoteColumnDialogOpen] = useState(false)
  const [deleteNoteColumnDialogOpen, setDeleteNoteColumnDialogOpen] = useState<
    boolean
  >(false)

  const [noteCreateDialogOpen, setNoteCreateDialogOpen] = useState(false)
  const [noteInfoDialogOpen, setNoteInfoDialogOpen] = useState(false)

  const [dragging, setDragging] = useState(false)

  //#region COLUMN

  const updateCurrentNoteView = (column: NoteColumnEntity): boolean => {
    const current = noteView.find(item => item.column.localId === column.localId)
    
    if (current) {
      setCurrentNoteView(current)
      return true
    }

    return false
  }

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

  const handleEditColumn = (column: NoteColumnEntity) => {
    const success = updateCurrentNoteView(column)
    
    if (success) {
      setNoteColumnDialogOpen(true)
    }
  }

  const handleDeleteColumn = (column: NoteColumnEntity) => {
    const success = updateCurrentNoteView(column)

    if (success) {
      setDeleteNoteColumnDialogOpen(true)
    }
  }

  const handleTitleAlreadyExists = (title: string): boolean => {
    return column.data.some(item => item.title === title)
  }

  const closeNoteColumnDialog = () => {
    setNoteColumnDialogOpen(false)
    setCurrentNoteView(undefined)
  }

  const handleDeleteColumnAgree = () => {
    if (currentNoteView) {
      onDeleteColumn(currentNoteView.column)
    }
    closeNoteColumnDeleteDialog()
  }

  const handleDeleteColumnDisagree = () => {
    closeNoteColumnDeleteDialog()
  }

  const closeNoteColumnDeleteDialog = () => {
    setDeleteNoteColumnDialogOpen(false)
    setCurrentNoteView(undefined)
  }

  //#endregion

  //#region NOTE

  const handleSaveNewNote = (question: string, tagList: string[]) => {
    setNoteCreateDialogOpen(false)
    setCurrentNoteView(undefined)
    if (currentNoteView) {
      onSaveNewNote(question, tagList, currentNoteView)
    } else {
      LogAppErrorService.logError(new ViewAddNoteOpenedWIthoutColumnError())
    }
  }

  const handleAddNote = (column: NoteColumnEntity) => {
    const success = updateCurrentNoteView(column)

    if (success) {
      setNoteCreateDialogOpen(true)
    }
  }

  const handleClickNote = (note: NoteEntity) => {
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
      currentNote.tags = tagList

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
    setCurrentNoteView(undefined)
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

  const getColumnMaxOrder = (): number => noteView.length

  const renderDialogs = (): JSX.Element => (
    <>
      <NoteColumnDialog
        onClose={handleNoteColumnDialogClose}
        onSave={handleSaveNoteColumn}
        open={noteColumnDialogOpen}
        column={currentNoteView?.column}
        order={getColumnMaxOrder()}
        titleAlreadyExists={handleTitleAlreadyExists}
      />
      {currentNoteView && (
        <AgreementDialog
          question={
            currentNoteView.notes.length === 0
              ? language.NOTE_COLUMN_DELETE_DIALOG_QUESTION
              : language.NOTE_COLUMN_WITH_NOTES_DELETE_DIALOG_QUESTION
          }
          description={
            currentNoteView.notes.length === 0
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

  return (
    <div className="note__note_content">
      {searching && noteView.length === 0 && (
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
                {noteView.map((item, index) => (
                  <NoteContentColumn
                    noteView={item}
                    columnIndex={index}
                    key={index}
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
                    columnCount={noteView.length}
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
