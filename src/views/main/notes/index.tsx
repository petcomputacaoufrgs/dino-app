import React, { useState, useEffect } from 'react'
import './styles.css'
import StringUtils from '../../../utils/StringUtils'
import NoteService from '../../../services/note/NoteService'
import NoteHeader from './header'
import NoteContent from './content'
import { useTags, useNotes } from '../../../context_provider/note'
import NoteDoc from '../../../types/note/database/NoteDoc'
import NoteViewModel from '../../../types/note/view/NoteViewModel'
import { useNoteColumns } from '../../../context_provider/note_column'
import NoteColumnDoc from '../../../types/note/database/NoteColumnDoc'
import { NoteColumnViewModel } from '../../../types/note/view/NoteColumnViewModel'
import { DropResult } from 'react-beautiful-dnd'
import NoteDroppableType from '../../../constants/NoteDroppableType'
import ArrayUtils from '../../../utils/ArrayUtils'
import NoteColumnService from '../../../services/note/NoteColumnService'

const convertNotesToNoteViews = (
  notes: NoteDoc[],
  tagSearch: string[],
  textSearch: string
): NoteViewModel[] => {
  return notes
    .map((note) => ({
      ...note,
      showByTag: hasSomeTag(note.tagNames, tagSearch, textSearch),
      showByQuestion: hasText(note.question, textSearch, tagSearch),
    }))
    .sort((a, b) => a.order - b.order)
}

const createViewColumns = (
  columns: NoteColumnDoc[],
  notes: NoteDoc[],
  tagSearch: string[],
  textSearch: string
): NoteColumnViewModel[] => {
  const noteViews = convertNotesToNoteViews(notes, tagSearch, textSearch)

  return columns
    .map((column) => ({
      ...column,
      notes: noteViews.filter((note) => note.columnTitle === column.title),
    }))
    .sort((a, b) => a.order - b.order)
}

const Notes = () => {
  const tags = useTags()
  const columns = useNoteColumns()
  const notes = useNotes()

  const [textSearch, setTextSearch] = useState('')
  const [tagSearch, setTagSearch] = useState<string[]>([])
  const [viewColumns, setViewColumns] = useState(
    createViewColumns(columns, notes, tagSearch, textSearch)
  )

  useEffect(() => {
    const viewColumns = createViewColumns(columns, notes, tagSearch, textSearch)
    setViewColumns(viewColumns)
  }, [columns, notes, textSearch, tagSearch])

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

  const handleSaveColumn = (column: NoteColumnViewModel, oldTitle?: string) => {
    NoteColumnService.saveColumn(column, oldTitle)
  }

  const handleDeleteColumn = (column: NoteColumnViewModel) => {
    NoteColumnService.deleteColumn(column)
  }

  //#endregion

  //#region Note

  const questionAlreadyExists = (question: string): boolean => (
    notes.some(note => note.question === question)
  )

  const handleSaveNewNote = (
    question: string,
    tagNames: string[],
    column: NoteColumnViewModel
  ) => {
    NoteService.createNote(question, tagNames, column)
  }
  
  const handleSaveNote = (note: NoteDoc) => {
    NoteService.saveNote(note)
  }

  const handleDeleteNote = (note: NoteDoc) => {
    NoteService.deleteNote(note)
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

    const sourceColumn = viewColumns.find(
      (vColumn) => vColumn.title === source.droppableId
    )

    const destinationColumn = viewColumns.find(
      (vColumn) => vColumn.title === destination.droppableId
    )

    if (!sourceColumn || !destinationColumn) {
      return
    }

    const changedNote = sourceColumn.notes[source.index]

    changedNote.columnTitle = destinationColumn.title

    sourceColumn.notes.splice(source.index, 1)

    destinationColumn.notes.splice(destination.index, 0, changedNote)

    if (changedColumn) {
      sourceColumn.notes.forEach((note, index) => (note.order = index))
    }

    destinationColumn.notes.forEach((note, index) => (note.order = index))

    setViewColumns(Array.from(viewColumns))

    NoteService.saveNotesOrder(
      ArrayUtils.merge(viewColumns.map((vColumn) => vColumn.notes))
    )
  }

  const handleNoteColumnDragEnd = (result: DropResult) => {
    const { destination, source } = result

    const isColumnUnchaged = isUnchanged(result)

    if (!destination || isColumnUnchaged) {
      return
    }

    const changedColumn = viewColumns[source.index]

    viewColumns.splice(source.index, 1)
    viewColumns.splice(destination.index, 0, changedColumn)

    setViewColumns(Array.from(viewColumns))

    NoteColumnService.saveColumnsOrder(viewColumns)
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
    const newViewColumns = Array.from(
      viewColumns.map((column) => {
        column.notes.forEach((n) => {
          n.showByTag = hasSomeTag(n.tagNames, newTagSearch, textSearch)
          n.showByQuestion = false
        })

        return column
      })
    )

    setTagSearch(newTagSearch)

    setViewColumns(newViewColumns)
  }

  const handleTextSearch = (newTextSearch: string) => {
    const newViewColumns = Array.from(
      viewColumns.map((column) => {
        column.notes.forEach((n) => {
          n.showByTag = hasSomeTag(n.tagNames, tagSearch, newTextSearch)
          n.showByQuestion = hasText(n.question, newTextSearch, tagSearch)
        })
        return column
      })
    )

    setTextSearch(newTextSearch)

    setViewColumns(newViewColumns)
  }

  //#endregion

  return (
    <div className="notes">
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
        columns={viewColumns}
        tags={tags}
      />
    </div>
  )
}

const hasText = (
  nodeText: string,
  searchText: string,
  tagSearch: string[]
): boolean => {
  if (searchText && searchText.length !== 0) {
    return StringUtils.contains(nodeText, searchText)
  }

  return tagSearch.length === 0
}

const hasSomeTag = (
  nodeTagNames: string[],
  searchTags: string[],
  textSearch: string
): boolean => {
  if (searchTags.length > 0) {
    return nodeTagNames.some((name) => searchTags.includes(name))
  }

  if (textSearch && textSearch.length !== 0) {
    return false
  }

  return true
}

export default Notes
