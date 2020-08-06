import React, { createContext, useContext, useEffect } from 'react'
import LanguageContextProvider from './language'
import AppSettingsContextType from '../../types/context_provider/AppSettingsContextType'
import AppSettingsContextUpdater from '../../context_updater/AppSettingsContextUpdater'

const AppSettingsContext = createContext({} as AppSettingsContextType)

const AppSettingsContextProvider: React.FC = (props) => {
  const languageContextProvider = LanguageContextProvider()

  const value = {
    language: languageContextProvider,
  } as AppSettingsContextType

  useEffect(() => {
    let handleLocalDataChanged = () => {
      languageContextProvider.updateLanguage()
    }
    AppSettingsContextUpdater.setCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      handleLocalDataChanged = () => {}
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

export default AppSettingsContextProvider
