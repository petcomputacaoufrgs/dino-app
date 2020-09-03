import React, { useState, useEffect } from 'react'
import StringUtils from '../../../utils/StringUtils'
import { NoteContextType } from '../../../types/context_provider/NotesContextType'
import NoteViewModel from '../../../types/note/NoteViewModel'
import NoteService from '../../../services/note/NoteService'
import DateUtils from '../../../utils/DateUtils'
import NoteHeader from './header'
import NoteBoard from './board'
import NoteAddButton from './note_add_button'
import { useTags, useNotes } from '../../../context_provider/notes'
import './styles.css'
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


  const handleSaveNewNote = (newQuestion: string, newTagNames: string[]) => {
    const newId = viewNotes.length

    const date = DateUtils.getDatetimeInMillis()

    const newNote: NoteContextType = {
      answer: '',
      answered: false,
      question: newQuestion,
      id: newId,
      tagNames: newTagNames,
      lastUpdate: date,
      savedOnServer: false,
    }

    NoteService.saveNote(newNote)
  }

  const handleSaveQuestion = (
    newQuestion: string,
    newTagNames: string[],
    noteViewValue: NoteViewModel
  ) => {
    const oldQuestion = noteViewValue.question

    const editedNote = notes.find((n) => n.question === oldQuestion)

    if (editedNote) {
      const date = DateUtils.getDatetimeInMillis()

      editedNote.question = newQuestion
      editedNote.tagNames = newTagNames
      editedNote.lastUpdate = date

      //NoteService.updateNoteQuestion(oldQuestion, editedNote)
    }
  }

  const handleSaveAnswer = (newAnswer: string, noteView: NoteViewModel) => {
    /*const editedNote = notes.find((n) => n.id === noteView.id)

    if (editedNote) {
      editedNote.answer = newAnswer
      editedNote.answered = true

      NoteService.updateNoteAnswer(editedNote)
    }*/
  }

  const handleDeleteNote = (noteId: number) => {
    /*const deletedNote = notes.find((note) => note.id === noteId)

    if (deletedNote) {
      NoteService.deleteNote(deletedNote)
    }*/
  }

  const handleNotesOrderChanged = (viewNotes: NoteViewModel[]) => {
    setViewNotes(viewNotes)
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

  //updateListMarginTop()

  return (
    <div className="notes">
      <NoteHeader
        onTagSearch={handleTagSearch}
        onTextSearch={handleTextSearch}
        tags={tags}
      />
      <NoteBoard
        onBoardOrderChanged={handleNotesOrderChanged}
        onSaveAnswer={handleSaveAnswer}
        onSaveQuestion={handleSaveQuestion}
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
