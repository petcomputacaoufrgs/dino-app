import React, { useState, useEffect, createContext, useContext } from 'react'
import GlossaryProviderValue from './value'
import GlossaryItemModel from '../../types/glossary/GlossaryItemModel'
import GlossaryService from '../../services/glossary/GlossaryService'
import GlossaryContextUpdater from '../../services/glossary/GlossaryContextUpdater'

const GlossaryProviderContext = createContext({
  items: [] as GlossaryItemModel[],
} as GlossaryProviderValue)

const GlossaryProvider: React.FC = (props) => {
  const [items, setItems] = useState([] as GlossaryItemModel[])
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    const updateGlossary = () => {
      const items = GlossaryService.getItems()
      setItems(items)
    }

    if (firstLoad) {
      updateGlossary()
      setFirstLoad(false)
    }

    const handleLocalDataChanged = () => {
      updateGlossary()
    }

    GlossaryContextUpdater.setCallback(handleLocalDataChanged)
  }, [items, firstLoad])

  const value = {
    items: items,
  }

  return (
    <GlossaryProviderContext.Provider value={value}>
      {props.children}
    </GlossaryProviderContext.Provider>
  )
}

export const useGlossary = () => useContext(GlossaryProviderContext)

export default GlossaryProvider
