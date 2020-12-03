import React, { useState, useEffect, createContext, useContext } from 'react'
import ContactContextType from '../../../types/context_provider/ContactContextType'
import Service from '../../../services/contact/ContactService'
import ContactContextUpdater from '../../updater/ContactContextUpdater'
import ContactModel from '../../../types/contact/ContactModel'

const ContactContext = createContext({
  items: [] as ContactModel[],
} as ContactContextType)

const ContactContextProvider: React.FC = (props) => {
  const [items, setItems] = useState([] as ContactModel[])
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    const updateData = () => {
      const items = Service.getItems()
      setItems(items)
    }

    if (firstLoad) {
      updateData()
      setFirstLoad(false)
    }

    let handleLocalDataChanged = () => {
      updateData()
    }

    ContactContextUpdater.setCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      handleLocalDataChanged = () => {}
    }

    return cleanBeforeUpdate
  }, [firstLoad])

  const value = {
    items: items,
  }

  return (
    <ContactContext.Provider value={value}>
      {props.children}
    </ContactContext.Provider>
  )
}

export const useContacts = () => useContext(ContactContext)

export default ContactContextProvider
