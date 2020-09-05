import React, { useState, useEffect } from 'react'
import NoteBodyProps from './props'
import './styles.css'
import NoteDialog from '../note_dialog'
import AgreementDialog from '../../../../components/agreement_dialog'
import { useLanguage } from '../../../../context_provider/app_settings'
import AgreementDialogProps from '../../../../components/agreement_dialog/props'
import NoteViewModel from '../../../../types/note/NoteViewModel'
import { DragDropContext, DropResult, ResponderProvided } from 'react-beautiful-dnd'
import NoteContentColumn from './column'

export interface NoteColumn {
  id: string
  title: string
  notes: NoteViewModel[]
}

const NoteContent: React.FC<NoteBodyProps> = ({tags, viewNotes, onBoardOrderChanged, onDeleteNote, onSave, onSaveNew}): JSX.Element => {
  const language = useLanguage().current

  const [columns, setColumns] = useState<NoteColumn[]>([{
    id: 'perguntas',
    title: 'Perguntas',
    notes: viewNotes
  }])

  const [columnsOrder, setColumnsOrder] = useState([columns[0].id])

  const [currentNote, setCurrentNote] = useState<NoteViewModel | undefined>(undefined)
  const [noteDialogOpen, setNoteDialogOpen] = useState(false)

  useEffect(() => {
    setColumns([
      {
        id: 'perguntas',
        title: 'Perguntas',
        notes: viewNotes,
      },
    ])
  }, [viewNotes])

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
//https://egghead.io/lessons/react-create-and-style-a-list-of-data-with-react
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
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    const dropedToSamePosition = destination.droppableId === source.droppableId && destination.index === source.index

    if (dropedToSamePosition) {
      return
    }
    
    notes.splice(source.index, 1);
    notes.splice(destination.index, 0 , )
    

    setNotes([...notes])
  }

  return (
    <div className="note__note_content">
      <DragDropContext onDragEnd={handleDragEnd}>
        {columns.map(column => (
          <NoteContentColumn
            column={column}
            onClickNote={handleCardClick}
            onDelete={handleOpenDeleteNoteDialog}
          />
      ))}
      </DragDropContext>
      {currentNote &&
        <NoteDialog
          open={noteDialogOpen}
          note={currentNote}
          tagOptions={tags}
          onSave={handleSaveNote}
          onSaveNew={handleSaveNewNote}
          onClose={handleCloseCardDialog}
        />
      }
      <DeleteDialog />
    </div>
  )
}

export default NoteContent
