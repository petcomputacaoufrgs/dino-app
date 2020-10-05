import React, { useState, useEffect } from 'react'
import './styles.css'
import StringUtils from '../../../utils/StringUtils'
import NoteService from '../../../services/note/NoteService'
import NoteHeader from './header'
import NoteContent from './content'
import { useTags, useNotes } from '../../../context_provider/note'
import NoteViewModel from '../../../types/note/view/NoteViewModel'
import { useNoteColumns } from '../../../context_provider/note_column'
import { NoteColumnViewModel } from '../../../types/note/view/NoteColumnViewModel'
import { DropResult } from 'react-beautiful-dnd'
import NoteDroppableType from '../../../constants/note/NoteDroppableType'
import ArrayUtils from '../../../utils/ArrayUtils'
import NoteColumnService from '../../../services/note/NoteColumnService'
import NoteEntity from '../../../types/note/database/NoteEntity'
import NoteColumnEntity from '../../../types/note/database/NoteColumnEntity'

const convertNotesToNoteViews = (
  notes: NoteEntity[],
  tagSearch: string[],
  textSearch: string
): NoteViewModel[] => {
  const noteViewList: NoteViewModel[] = []

  notes.forEach((note) => {
    if (note.id !== undefined) {
      noteViewList.push({
        ...note,
        id: note.id,
        showByTag: showByTagSearch(note.tagNames, tagSearch, textSearch),
        showByQuestion: showByTextSearch(note.question, textSearch, tagSearch),
      })
    }
  })

  return noteViewList.sort((a, b) => a.order - b.order)
}

const createViewColumns = (
  columns: NoteColumnEntity[],
  notes: NoteEntity[],
  tagSearch: string[],
  textSearch: string
): NoteColumnViewModel[] => {
  const noteViews = convertNotesToNoteViews(notes, tagSearch, textSearch)

  return columns
    .map((column) => {
      const columnNotes = noteViews.filter(
        (note) => note.columnTitle === column.title
      )

      return {
        ...column,
        id: column.id!,
        notes: columnNotes,
        showBySearch: showColumnBySearch(columnNotes, textSearch, tagSearch),
      }
    })
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
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const viewColumns = createViewColumns(columns, notes, tagSearch, textSearch)
    setViewColumns(viewColumns)
  }, [columns, notes, textSearch, tagSearch])

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

  const handleSaveColumn = (column: NoteColumnEntity, oldTitle?: string) => {
    NoteColumnService.saveColumn(column, oldTitle)
  }

  const handleDeleteColumn = (column: NoteColumnViewModel) => {
    NoteColumnService.deleteColumn(column)
  }

  //#endregion

  //#region Note

  const questionAlreadyExists = (question: string): boolean =>
    notes.some((note) => note.question === question)

  const handleSaveNewNote = (
    question: string,
    tagNames: string[],
    column: NoteColumnViewModel
  ) => {
    NoteService.createNote(question, tagNames, column)
  }

  const handleSaveNote = (note: NoteViewModel) => {
    NoteService.saveNote(note)
  }

  const handleDeleteNote = (note: NoteViewModel) => {
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
          n.showByTag = showByTagSearch(n.tagNames, newTagSearch, textSearch)
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
          n.showByTag = showByTagSearch(n.tagNames, tagSearch, newTextSearch)
          n.showByQuestion = showByTextSearch(
            n.question,
            newTextSearch,
            tagSearch
          )
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
        searching={searching}
      />
    </div>
  )
}

const showByTextSearch = (
  nodeText: string,
  textSearch: string,
  tagSearch: string[]
): boolean => {
  const searchingByText = textSearch && textSearch.length !== 0

  if (searchingByText) {
    return StringUtils.contains(nodeText, textSearch)
  }

  return tagSearch.length === 0
}

const showByTagSearch = (
  nodeTagNames: string[],
  tagsSearch: string[],
  textSearch: string
): boolean => {
  if (tagsSearch.length > 0) {
    return nodeTagNames.some((name) => tagsSearch.includes(name))
  }

  const notSearchingByText = !textSearch || textSearch.length === 0

  return notSearchingByText
}

const showColumnBySearch = (
  notes: NoteViewModel[],
  textSearch: string,
  tagsSearch: string[]
): boolean => {
  const activeTagsSearch = tagsSearch.length > 0
  const activeTextSearch = textSearch && textSearch.length !== 0
  const activeNotesCount = notes.filter(
    (note) => note.showByQuestion || note.showByTag
  ).length

  if (activeTagsSearch || activeTextSearch) {
    return activeNotesCount !== 0
  } else {
    return true
  }
}

export default Notes
