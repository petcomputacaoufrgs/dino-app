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
    const getTagsAndNotes = async () => {
      const notes = await NoteService.getNotes()
      const tags = await NoteService.getTags()

      updateTagsAndNotes(notes, tags)
    }

    let updateTagsAndNotes = (notes: NoteValue[], tags: string[]) => {
      setNotes(notes)
      setTags(tags)
      setFirstLoad(false)
    }

    if (firstLoad) {
      getTagsAndNotes()
    }

    const handleLocalDataChanged = () => {
      getTagsAndNotes()
    }

    NoteContextUpdater.setCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      updateTagsAndNotes = () => {}
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
