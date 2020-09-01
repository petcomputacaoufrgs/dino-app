import React, { createContext, useContext, useEffect } from 'react'
import LanguageContextProvider from './language'
import AppSettingsContextType from '../../types/context_provider/AppSettingsContextType'
import AppSettingsContextUpdater from '../../context_updater/AppSettingsContextUpdater'
import SelectedFaqContextProvider from './selected_faq'
import CurrentFaqContextUpdater from '../../context_updater/CurrentFaqContextUpdater'

const AppSettingsContext = createContext({} as AppSettingsContextType)

const AppSettingsContextProvider: React.FC = (props) => {
  const languageContextProvider = LanguageContextProvider()
  const currentFaqContextProvider = SelectedFaqContextProvider()

  const value = {
    language: languageContextProvider,
    selectedFaq: currentFaqContextProvider,
  } as AppSettingsContextType

  useEffect(() => {
    let handleLanguageChanged = () => {
      languageContextProvider.updateLanguage()
    }

    let handleCurrentFaqChanged = () => {
      currentFaqContextProvider.updateFaq()
    }

    AppSettingsContextUpdater.setCallback(handleLanguageChanged)
    CurrentFaqContextUpdater.setCallback(handleCurrentFaqChanged)

    const cleanBeforeUpdate = () => {
      handleLanguageChanged = () => {}
      handleCurrentFaqChanged = () => {}
    }

    return cleanBeforeUpdate
  })

  return (
    <AppSettingsContext.Provider value={value}>
      {props.children}
    </AppSettingsContext.Provider>
  )
}

export const useAppSettings = () => useContext(AppSettingsContext)

export const useLanguage = () => useContext(AppSettingsContext).language

export const useCurrentFaq = () => useContext(AppSettingsContext).selectedFaq.current

export default AppSettingsContextProvider
