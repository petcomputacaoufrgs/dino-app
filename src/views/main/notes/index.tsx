import React, { useState, useEffect } from 'react'
import './styles.css'
import StringUtils from '../../../utils/StringUtils'
import NoteViewModel from '../../../types/note/NoteViewModel'
import NoteService from '../../../services/note/NoteService'
import NoteHeader from './header'
import NoteContent from './content'
import NoteAddButton from './note_add_button'
import { useTags, useNotes } from '../../../context_provider/notes'
import NoteDoc from '../../../types/note/database/NoteDoc'

const convertNotesToNoteViews = (
  notes: NoteDoc[],
  tagSearch: string[],
  textSearch: string
): NoteViewModel[] => {
  return notes.map((note) => ({
    ...note,
    showByTag: hasSomeTag(note.tagNames, tagSearch, textSearch),
    showByQuestion: hasText(note.question, textSearch, tagSearch),
  }))
}

const Notes = () => {
  const tags = useTags()
  const notes = useNotes()

  const [textSearch, setTextSearch] = useState('')
  const [tagSearch, setTagSearch] = useState<string[]>([])
  const [viewNotes, setViewNotes] = useState(convertNotesToNoteViews(notes, tagSearch, textSearch))

  useEffect(() => {
    setViewNotes(
      notes.map((note) => {
        const viewNote: NoteViewModel = {
          ...note,
          showByTag: hasSomeTag(note.tagNames, tagSearch, textSearch),
          showByQuestion: hasText(note.question, textSearch, tagSearch),
        }
        return viewNote
      })
    )
  }, [notes, textSearch, tagSearch])


  const handleSaveNewNote = (question: string, tagNames: string[], answer: string) => {
    const order = viewNotes.length
    NoteService.createNote(question, tagNames, answer, order)
  }

  const handleSaveNote = (note: NoteDoc) => {
    console.log(note)
    NoteService.saveNote(note)
  }

  const handleNotesOrderChanged = (viewNotes: NoteViewModel[]) => {
    setViewNotes(viewNotes)
  }

  const handleDeleteNote = (note: NoteDoc) => {
    NoteService.deleteNote(note)
  }

  //#region Searching

  const handleTagSearch = (newTagSearch: string[]) => {
    const newViewNotes = [...viewNotes]

    setTagSearch(newTagSearch)

    newViewNotes.forEach((n) => {
      n.showByTag = hasSomeTag(n.tagNames, newTagSearch, textSearch)
      n.showByQuestion = false
    })

    setViewNotes(newViewNotes)
  }

  const handleTextSearch = (newTextSearch: string) => {
    const newViewNotes = [...viewNotes]

    setTextSearch(newTextSearch)

    newViewNotes.forEach((n) => {
      n.showByTag = hasSomeTag(n.tagNames, tagSearch, newTextSearch)
      n.showByQuestion = hasText(n.question, newTextSearch, tagSearch)
    })

    setViewNotes(newViewNotes)
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
        onBoardOrderChanged={handleNotesOrderChanged}
        onSave={handleSaveNote}
        onSaveNew={handleSaveNewNote}
        onDeleteNote={handleDeleteNote}
        tags={tags}
        viewNotes={viewNotes}
      />
      <NoteAddButton onSave={handleSaveNewNote} tags={tags} />
    </div>
  )
}

const hasText = (
  nodeText: string,
  searchText: string,
  tagSearch: string[]
): boolean => {
  if (searchText.trim()) {
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
