import React, { useState } from 'react'
import NoteBodyProps from './props'
import './styles.css'
import NoteDialog from '../note_dialog'
import AgreementDialog from '../../../../components/agreement_dialog'
import { useLanguage } from '../../../../context_provider/app_settings'
import AgreementDialogProps from '../../../../components/agreement_dialog/props'
import { DragDropContext, DropResult, ResponderProvided, Droppable } from 'react-beautiful-dnd'
import NoteContentColumn from './column'
import NoteViewModel from '../../../../types/note/view/NoteViewModel'
import NoteDroppableType from '../../../../constants/NoteDroppableType'
import AddColumn from './add_column'
import NoteColumnDialog from '../column_dialog'
import { NoteColumnViewModel } from '../../../../types/note/view/NoteColumnViewModel'


const NoteContent: React.FC<NoteBodyProps> = ({tags, columns, onDragEnd: onBoardOrderChanged, onDeleteNote, onSave, onSaveNew}): JSX.Element => {
  const language = useLanguage().current

  const [currentNote, setCurrentNote] = useState<NoteViewModel | undefined>(undefined)
  const [currentNoteColumn, setCurrentNoteColumn] = useState<NoteColumnViewModel | undefined>(undefined)
  const [noteDialogOpen, setNoteDialogOpen] = useState(false)
  const [noteColumnDialogOpen, setNoteColumnDialogOpen] = useState(false)

  const handleNoteColumnDialogClose = () => {
    setNoteColumnDialogOpen(false)
    setCurrentNoteColumn(undefined)
  }

  const handleAddColumn = () => {
    setNoteColumnDialogOpen(true)
  }

  const handleSaveNoteColumn = (column: NoteColumnViewModel) => {
    setNoteColumnDialogOpen(false)
    console.log("salvar")
    console.log(column)
  }

  const handleCardClick = (noteView: NoteViewModel) => {
    setCurrentNote(noteView)
    setNoteDialogOpen(true)
  }

  const handleCloseCardDialog = () => {
    setNoteDialogOpen(false)
  }

  const agreementDialogProps: AgreementDialogProps = {
    onAgree: () => currentNote && onDeleteNote(currentNote),
    question: language.DELETE_NOTE_ALERT_TITLE,
    description: language.DELETE_NOTE_ALERT_TEXT,
    agreeOptionText: language.AGREEMENT_OPTION_TEXT,
    disagreeOptionText: language.DISAGREEMENT_OPTION_TEXT,
  }

  const [DeleteDialog, showDeleteDialog] = AgreementDialog(agreementDialogProps)

  const handleOpenDeleteNoteDialog = (note: NoteViewModel) => {
    setCurrentNote(note)

    showDeleteDialog()
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
    onBoardOrderChanged(result)
  }

  const getColumnMaxOrder = (): number => (
    columns.length
  )

  return (
    <div className="note__note_content">
      <DragDropContext onDragEnd={handleDragEnd}>
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
              {columns.map((column, index) => (
                <NoteContentColumn
                  column={column}
                  columnIndex={index}
                  key={index}
                  onClickNote={handleCardClick}
                  onDelete={handleOpenDeleteNoteDialog}
                />
              ))}
              <AddColumn onAddColumn={handleAddColumn}  />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {currentNote && (
        <NoteDialog
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
      />
      <DeleteDialog />
    </div>
  )
}

export default NoteContent
