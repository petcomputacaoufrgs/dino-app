import React, { createContext, useContext } from 'react'
import LanguageProvider from './language_provider'
import AppSettingsProviderValue from './value'
import AppSettingsProviderProps from './props'

const AppSettingsContext = createContext({} as AppSettingsProviderValue)

const AppSettingsProvider = (props: AppSettingsProviderProps) => {
  const languageProvider = LanguageProvider()

  const value = {
    language: languageProvider,
  } as AppSettingsProviderValue

  return (
    <AppSettingsContext.Provider value={value}>
      {props.children}
    </AppSettingsContext.Provider>
  )
}

export const useAppSettings = () => useContext(AppSettingsContext)

export const useLanguage = () => useContext(AppSettingsContext).language

export default AppSettingsProvider
