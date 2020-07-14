import React, { useState, useEffect, createContext, useContext } from 'react'
import NotesProviderProps from './props'
import NotesProviderValue, { NoteValue } from './value'
import NoteService from '../../services/note/NoteService'
import NoteContextUpdater from '../../services/note/NoteContextUpdater'

const NotesProviderContext = createContext({
  notes: [],
  tags: [],
} as NotesProviderValue)

const NotesProvider = (props: NotesProviderProps): JSX.Element => {
  const [notes, setNotes] = useState([] as NoteValue[])
  const [tags, setTags] = useState([] as string[])
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    const updateTagsAndNotes = async () => {
      const notes = await NoteService.getNotes()
      const tags = await NoteService.getTags()

      saveTagsAndNotes(notes, tags)
    }

    let saveTagsAndNotes = (notes: NoteValue[], tags: string[]) => {
      setNotes(notes)
      setTags(tags)
      if (firstLoad) {
        setFirstLoad(false)
      }
    }

    if (firstLoad) {
      updateTagsAndNotes()
    }

    const handleLocalDataChanged = () => {
      updateTagsAndNotes()
    }

    NoteContextUpdater.setCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      saveTagsAndNotes = () => {}
    }

    return cleanBeforeUpdate
  }, [firstLoad])

  const value = {
    notes: notes,
    tags: tags,
  }

  return (
    <NotesProviderContext.Provider value={value}>
      {props.children}
    </NotesProviderContext.Provider>
  )
}

export const useNotes = () => useContext(NotesProviderContext).notes
export const useTags = () => useContext(NotesProviderContext).tags

export default NotesProvider
