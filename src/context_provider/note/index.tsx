import React, { useState, useEffect, createContext, useContext } from 'react'
import NoteContextType from '../../types/context_provider/NoteContextType'
import NoteService from '../../services/note/NoteService'
import NoteContextUpdater from '../../context_updater/NoteContextUpdater'
import NoteDoc from '../../types/note/database/NoteDoc'

const NoteContext =createContext <NoteContextType>({
  notes: [],
  tags: [],
})

const NoteContextProvider: React.FC = (props) => {
  const [notes, setNotes] = useState<NoteDoc[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    const updateData = async () => {
      const savedNotes = await NoteService.getNotes()
      const savedTags = await NoteService.getTags()

      saveData(savedNotes, savedTags)
    }

    let saveData = (notes: NoteDoc[], tags: string[]) => {
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
    <NoteContext.Provider value={value}>
      {props.children}
    </NoteContext.Provider>
  )
}

export const useNotes = () => useContext(NoteContext).notes
export const useTags = () => useContext(NoteContext).tags

export default NoteContextProvider
