import React, { useState, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
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


const HEADER_TEXT_FIELD_CLASS = 'notes_header_text_field'

const Notes = () => {
  const [textSearch, setTextSearch] = useState('')
  const [tagSearch, setTagSearch] = useState([] as string[])
  const tags = useTags()
  const notes = useNotes()
  const [viewNotes, setViewNotes] = useState([] as NoteViewModel[])

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

      NoteService.updateNoteQuestion(oldQuestion, editedNote)
    }
  }

  const handleSaveAnswer = (newAnswer: string, noteView: NoteViewModel) => {
    const editedNote = notes.find((n) => n.id === noteView.id)

    if (editedNote) {
      editedNote.answer = newAnswer
      editedNote.answered = true

      NoteService.updateNoteAnswer(editedNote)
    }
  }

  const handleDeleteNote = (noteId: number) => {
    const deletedNote = notes.find((note) => note.id === noteId)

    if (deletedNote) {
      NoteService.deleteNote(deletedNote)
    }
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

  updateListMarginTop()

  return (
    <div className={getMainClass()}>
      <NoteHeader
        handleTagSearch={handleTagSearch}
        handleTextSearch={handleTextSearch}
        headerClass={HEADER_TEXT_FIELD_CLASS}
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

const updateListMarginTop = () => {
  const foundDivs = document.getElementsByClassName('notes__board')

  if (foundDivs.length === 1) {
    const noteListContainer = foundDivs[0]

    setTimeout(() => {
      const textField: HTMLElement | null = document.querySelector(
        '.' + HEADER_TEXT_FIELD_CLASS
      )

      if (textField) {
        const fixValue = isMobile ? 94 : 144

        const value = (textField.offsetHeight + fixValue).toString() + 'px'

        noteListContainer.setAttribute('style', 'top: ' + value + ';')
      }
    }, 0.1)
  }
}

const getMainClass = () => {
  const mainClass = 'notes'

  if (isMobile) {
    return mainClass
  }

  return mainClass + ' notes_desktop'
}

export default Notes
