import React, { useState, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import StringUtils from '../../../utils/StringUtils'
import NoteViewModel from './model/NoteViewModel'
import NoteBoardViewModel from './model/NoteBoardViewModel'
import { NoteBoardColumnViewModel } from './model/NoteBoardViewModel'
import NoteService from '../../../services/note/NoteService'
import DateUtils from '../../../utils/DateUtils'
import NoteHeader from './header'
import NoteBoard from './board'
import NoteAddButton from './note_add_button'
import './styles.css'

const HEADER_TEXT_FIELD_CLASS = 'notes_header_text_field'

const Notes = () => {
  const [textSearch, setTextSearch] = useState('')
  const [tagSearch, setTagSearch] = useState([] as string[])
  const [board, setBoard] = useState({
    columns: [] as NoteBoardColumnViewModel[],
  } as NoteBoardViewModel)
  const [tags, setTags] = useState([] as string[])

  const handleSaveNewNote = (newQuestion: string, newTagNames: string[]) => {
    const newBoard = { ...board }

    const newNotes = newBoard.columns[0].cards

    const newId = newNotes.length

    const date = DateUtils.getDatetimeInMillis()

    const newNote: NoteViewModel = {
      answer: '',
      answered: false,
      question: newQuestion,
      id: newId,
      tagNames: newTagNames,
      showByTag: hasSomeTag(newTagNames, tagSearch),
      showByQuestion: hasText(newQuestion, textSearch),
      lastUpdate: date,
      savedOnServer: false,
    }

    NoteService.saveNote(newNote, updateTags)

    newNotes.push(newNote)

    setBoard(newBoard)
  }

  const handleSaveQuestion = (
    newQuestion: string,
    newTagNames: string[],
    noteView: NoteViewModel
  ) => {
    const newData = { ...board }

    const oldQuestion = noteView.question

    const editedNote = newData.columns[0].cards.find(
      (n) => n.question === oldQuestion
    )

    if (editedNote) {
      const date = DateUtils.getDatetimeInMillis()

      editedNote.question = newQuestion
      editedNote.tagNames = newTagNames
      editedNote.lastUpdate = date

      NoteService.updateNoteQuestion(oldQuestion, editedNote, updateTags)
    }

    setBoard(newData)
  }

  const handleSaveAnswer = (newAnswer: string, noteView: NoteViewModel) => {
    const newData = { ...board }

    const notes = newData.columns[0].cards

    const editedNote = notes.find((n) => n.id === noteView.id)

    if (editedNote) {
      editedNote.answer = newAnswer
      editedNote.answered = true

      NoteService.updateNoteAnswer(editedNote)
    }

    setBoard(newData)
  }

  const handleDeleteNote = (noteId: number) => {
    const newData = { ...board }

    const notes = newData.columns[0].cards

    const deletedNote = notes.find((note) => note.id === noteId)

    const newNotes = notes.filter((note) => note.id !== noteId)

    if (deletedNote) {
      NoteService.deleteNote(deletedNote, updateTags)
    }

    newData.columns[0].cards = newNotes

    setBoard(newData)
  }

  const handleBoardOrderChanged = (board: NoteBoardViewModel) => {
    setBoard(board)
  }

  //#region Searching

  const handleTagSearch = (newTagSearch: string[]) => {
    const newBoard = { ...board }

    const notes = newBoard.columns[0].cards

    setTagSearch(newTagSearch)

    notes.forEach((n) => {
      n.showByTag = hasSomeTag(n.tagNames, newTagSearch)
      n.showByQuestion = false
    })

    setBoard(newBoard)
  }

  const handleTextSearch = (newTextSearch: string) => {
    const newBoard = { ...board }

    const notes = newBoard.columns[0].cards

    setTextSearch(newTextSearch)

    notes.forEach((n) => {
      n.showByTag = hasSomeTag(n.tagNames, tagSearch, newTextSearch)
      n.showByQuestion = hasText(n.question, newTextSearch)
    })

    setBoard(newBoard)
  }

  const hasText = (nodeText: string, searchText: string): boolean => {
    if (searchText.trim()) {
      return StringUtils.contains(nodeText, searchText)
    }

    return tagSearch.length === 0
  }

  const hasSomeTag = (
    nodeTagNames: string[],
    searchTags: string[],
    tSearch?: string
  ): boolean => {
    if (searchTags.length > 0) {
      return nodeTagNames.some((name) => searchTags.includes(name))
    }

    if (tSearch && tSearch.length !== 0) {
      return false
    }

    return true
  }

  //#endregion

  useEffect(() => {
    if (board.columns.length === 0) {
      const notesPromisse = NoteService.getNotes()

      notesPromisse
        .then((notes) =>
          setBoard({
            columns: [
              {
                id: 0,
                cards: notes,
              } as NoteBoardColumnViewModel,
            ] as NoteBoardColumnViewModel[],
          } as NoteBoardViewModel)
        )
        .catch()

      const tagsPromise = NoteService.getTags()

      tagsPromise.then((tags) => setTags(tags)).catch()
    }
  })

  const updateTags = async () => {
    const tags = await NoteService.getTags()

    setTags(tags)
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

  updateListMarginTop()

  const getMainClass = () => {
    const mainClass = 'notes'

    if (isMobile) {
      return mainClass
    }

    return mainClass + ' notes_desktop'
  }

  return (
    <div className={getMainClass()}>
      <NoteHeader
        handleTagSearch={handleTagSearch}
        handleTextSearch={handleTextSearch}
        headerClass={HEADER_TEXT_FIELD_CLASS}
        tags={tags}
      />
      <NoteBoard
        onBoardOrderChanged={handleBoardOrderChanged}
        onSaveAnswer={handleSaveAnswer}
        onSaveQuestion={handleSaveQuestion}
        onDeleteNote={handleDeleteNote}
        board={board}
        tags={tags}
      />
      <NoteAddButton onSave={handleSaveNewNote} tags={tags} />
    </div>
  )
}

export default Notes
