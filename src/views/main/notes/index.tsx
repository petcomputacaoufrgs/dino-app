import React, { useState, useEffect } from 'react'
import NoteHeader from './header'
import NoteContent from './content'
import { useNoteColumn } from '../../../context/provider/note_column'
import { DropResult } from 'react-beautiful-dnd'
import NoteDroppableType from '../../../constants/note/NoteDroppableType'
import NoteEntity from '../../../types/note/database/NoteEntity'
import NoteColumnEntity from '../../../types/note/database/NoteColumnEntity'
import { useNote } from '../../../context/provider/note'
import NoteView from '../../../types/note/view/NoteView'
import './styles.css'
import Loader from '../../../components/loader'

const Notes = () => {
  const column = useNoteColumn()
  const note = useNote()
  const tags = note.service.getAllTags(note.data)

  const [textSearch, setTextSearch] = useState('')
  const [tagSearch, setTagSearch] = useState<string[]>([])
  const [searching, setSearching] = useState(false)

  const noteView = column.service.getColumnsByFilter(note.data, column.data, tagSearch, textSearch)

  useEffect(() => {
    if (textSearch.length > 0 || tagSearch.length > 0) {
      setSearching(true)
    } else if (searching) {
      setSearching(false)
    }
  }, [searching, textSearch, tagSearch])

  const isUnchanged = (result: DropResult): boolean => {
    const { destination, source } = result

    if (!destination) {
      return true
    }

    const changedColumn = source.droppableId !== destination.droppableId

    const dropedToSamePosition =
      !changedColumn && destination.index === source.index

    return dropedToSamePosition
  }

  //#region Column

  const handleSaveColumn = (item: NoteColumnEntity) => {
    column.service.save(item)
  }

  const handleDeleteColumn = async (item: NoteColumnEntity) => {
    await note.service.deleteNotesByColumn(item)
    column.service.delete(item)
  }

  //#endregion

  //#region Note

  const questionAlreadyExists = (question: string): boolean => 
    note.data.some((note) => note.question === question)

  const handleSaveNewNote = (
    question: string,
    tagList: string[],
    noteView: NoteView
  ) => {
    if (noteView.column.localId) {
      note.service.save({
        answer: "",
        question: question,
        tags: tagList,
        columnId: noteView.column.id,
        localColumnId: noteView.column.localId,
        order: noteView.notes.length
      })
    }
  }

  const handleSaveNote = (item: NoteEntity) => {
    note.service.save(item)
  }

  const handleDeleteNote = (item: NoteEntity) => {
    note.service.delete(item)
  }

  //#endregion

  //#region Drag&Drop

  const handleNoteDragEnd = (result: DropResult) => {
    const { destination, source } = result

    const isNoteUnchaged = isUnchanged(result)

    if (!destination || isNoteUnchaged) {
      return
    }

    const changedColumn = source.droppableId !== destination.droppableId

    const sourceViewNote = noteView.find(
      item => item.column.title === source.droppableId
    )

    const destinationViewNote = noteView.find(
      item => item.column.title === destination.droppableId
    )

    if (!sourceViewNote || !destinationViewNote) {
      return
    }

    const changedNote = sourceViewNote.notes[source.index]

    sourceViewNote.notes.splice(source.index, 1)

    destinationViewNote.notes.splice(destination.index, 0, changedNote)

    destinationViewNote.notes.forEach((note, index) => {
      note.order = index
      note.localColumnId = destinationViewNote.column.localId
      note.columnId = destinationViewNote.column.id
    })

    if (changedColumn) {
      sourceViewNote.notes.forEach((note, index) => (note.order = index))
      note.service.saveAll(destinationViewNote.notes.concat(sourceViewNote.notes))
    } else {
      note.service.saveAll(destinationViewNote.notes)
    }
  }

  const handleNoteColumnDragEnd = (result: DropResult) => {
    const { destination, source } = result

    const isColumnUnchaged = isUnchanged(result)

    if (!destination || isColumnUnchaged) {
      return
    }

    const changedColumn = noteView[source.index]

    noteView.splice(source.index, 1)
    noteView.splice(destination.index, 0, changedColumn)

    noteView.forEach((item, index) => item.column.order = index)

    column.service.saveAll(noteView.map(item => item.column))
  }

  const handleDragEnd = (result: DropResult) => {
    const { type } = result

    if (type === NoteDroppableType.NOTE) {
      handleNoteDragEnd(result)
    } else if (type === NoteDroppableType.COLUMN) {
      handleNoteColumnDragEnd(result)
    }
  }

  //#endregion

  //#region Searching

  const handleTagSearch = (newTagSearch: string[]) => {
    setTagSearch(newTagSearch)
  }

  const handleTextSearch = (newTextSearch: string) => {
    setTextSearch(newTextSearch)
  }

  //#endregion

  return (
    <div className="notes">
      <Loader className="notes__loader" loading={note.loading || column.loading}>
        <NoteHeader
          onTagSearch={handleTagSearch}
          onTextSearch={handleTextSearch}
          tags={tags}
        />
        <NoteContent
          onDragEnd={handleDragEnd}
          onDeleteNote={handleDeleteNote}
          onSaveColumn={handleSaveColumn}
          onDeleteColumn={handleDeleteColumn}
          onSaveNewNote={handleSaveNewNote}
          onSaveNote={handleSaveNote}
          questionAlreadyExists={questionAlreadyExists}
          noteView={noteView}
          column={column}
          tags={tags}
          searching={searching}
        />
        </Loader>
    </div>
  )
}

export default Notes
