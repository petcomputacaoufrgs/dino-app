import React, { useState, useEffect, createContext, useContext } from 'react'
import NotesContextType, {
  NoteContextType,
} from '../../types/context_provider/NotesContextType'
import NoteService from '../../services/note/NoteService'
import NoteContextUpdater from '../../context_updater/NoteContextUpdater'

const NotesContext = createContext({
  notes: [],
  tags: [],
} as NotesContextType)

const NotesContextProvider: React.FC = (props) => {
  const [notes, setNotes] = useState([] as NoteContextType[])
  const [tags, setTags] = useState([] as string[])
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    const updateData = async () => {
      const notes = await NoteService.getNotes()
      const tags = await NoteService.getTags()

      saveData(notes, tags)
    }

    let saveData = (notes: NoteContextType[], tags: string[]) => {
      setNotes(notes)
      setTags(tags)
      if (firstLoad) {
        setFirstLoad(false)
      }
    }

    if (firstLoad) {
      updateData()
    }

    const handleLocalDataChanged = () => {
      updateData()
    }

    NoteContextUpdater.setCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      saveData = () => {}
    }

    return cleanBeforeUpdate
  }, [firstLoad])

  const value = {
    notes: notes,
    tags: tags,
  }

  return (
    <NotesContext.Provider value={value}>
      {props.children}
    </NotesContext.Provider>
  )
}

export const useNotes = () => useContext(NotesContext).notes
export const useTags = () => useContext(NotesContext).tags

export default NotesContextProvider
