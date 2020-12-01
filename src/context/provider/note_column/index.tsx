import React, { useState, useEffect, createContext, useContext } from 'react'
import NoteColumnContextType from '../../../types/context_provider/NoteColumnContextType'
import NoteColumnService from '../../../services/note/NoteColumnService'
import NoteColumnContextUpdater from '../../updater/NoteColumnContextUpdater'
import NoteColumnEntity from '../../../types/note/database/NoteColumnEntity'

const NoteColumnContext = createContext<NoteColumnContextType>({
  columns: [],
})

const NoteColumnContextProvider: React.FC = (props) => {
  const [columns, setColumns] = useState<NoteColumnEntity[]>([])
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    const updateData = async () => {
      const dbColumns = await NoteColumnService.getColumns()

      saveData(dbColumns)
    }

    let saveData = (columns: NoteColumnEntity[]) => {
      setColumns(columns)

      if (firstLoad) {
        setFirstLoad(false)
      }
    }

    if (firstLoad) {
      updateData()
    }

    NoteColumnContextUpdater.setCallback(updateData)

    const cleanBeforeUpdate = () => {
      saveData = () => {}
    }

    return cleanBeforeUpdate
  }, [firstLoad])

  const value: NoteColumnContextType = {
    columns: columns,
  }

  return (
    <NoteColumnContext.Provider value={value}>
      {props.children}
    </NoteColumnContext.Provider>
  )
}

export const useNoteColumns = () => useContext(NoteColumnContext).columns

export default NoteColumnContextProvider
