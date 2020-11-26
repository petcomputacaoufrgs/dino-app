import React, { useState, useEffect, createContext, useContext } from 'react'
import GlossaryContextType from '../../../types/context_provider/GlossaryContextType'
import GlossaryItemModel from '../../../types/glossary/GlossaryItemModel'
import GlossaryService from '../../../services/glossary/GlossaryService'
import GlossaryContextUpdater from '../../updater/GlossaryContextUpdater'

const GlossaryContext = createContext({
  items: [] as GlossaryItemModel[],
} as GlossaryContextType)

const GlossaryContextProvider: React.FC = (props) => {
  const [items, setItems] = useState([] as GlossaryItemModel[])
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    const updateData = () => {
      const items = GlossaryService.getItems()
      setItems(items)
    }

    if (firstLoad) {
      updateData()
      setFirstLoad(false)
    }

    let handleLocalDataChanged = () => {
      updateData()
    }

    GlossaryContextUpdater.setCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      handleLocalDataChanged = () => {}
    }

    return cleanBeforeUpdate
  }, [items, firstLoad])

  const value = {
    items: items,
  }

  return (
    <GlossaryContext.Provider value={value}>
      {props.children}
    </GlossaryContext.Provider>
  )
}

export const useGlossary = () => useContext(GlossaryContext)

export default GlossaryContextProvider
