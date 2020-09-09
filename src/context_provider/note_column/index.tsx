import React, { useState, useEffect, createContext, useContext } from 'react'
import NoteColumnContextType from '../../types/context_provider/NoteColumnContextType'
import NoteColumnDoc from '../../types/note/database/NoteColumnDoc'
import NoteColumnService from '../../services/note/NoteColumnService'
import NoteColumnContextUpdater from '../../context_updater/NoteColumnContextUpdater'

const NoteColumnContext = createContext <NoteColumnContextType>({
  columns: [],
})

const NoteColumnContextProvider: React.FC = (props) => {
  const [columns, setColumns] = useState<NoteColumnDoc[]>([])
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    const updateData = async () => {
      const savedColumns = await NoteColumnService.getColumns()

      //console.log("updateData")

      saveData(savedColumns)
    }

    let saveData = (columns: NoteColumnDoc[]) => {
      //console.log("saving")
      //console.log(columns)
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
