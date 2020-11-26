import React, { useState, useEffect, createContext, useContext } from 'react'
import FaqContextType from '../../../types/context_provider/FaqContextType'
import FaqItemModel from '../../../types/faq/FaqItemModel'
import FaqService from '../../../services/faq/FaqService'
import FaqContextUpdater from '../../updater/FaqContextUpdater'

const FaqContext = createContext({
  items: [] as FaqItemModel[],
} as FaqContextType)

const FaqContextProvider: React.FC = (props) => {
  const [items, setItems] = useState([...FaqService.getItems()])
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    const updateData = () => {
      const items = FaqService.getItems()
      setItems([...items])
    }

    if (firstLoad) {
      updateData()
      setFirstLoad(false)
    }

    let handleLocalDataChanged = () => {
      updateData()
    }

    FaqContextUpdater.setCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      handleLocalDataChanged = () => {}
    }

    return cleanBeforeUpdate
  }, [items, firstLoad])

  const value = {
    items: items,
  }

  return (
    <FaqContext.Provider value={value}>{props.children}</FaqContext.Provider>
  )
}

export const useFaq = () => useContext(FaqContext)

export default FaqContextProvider
