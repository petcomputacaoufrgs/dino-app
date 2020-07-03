import React, { createContext, useContext } from 'react'
import AppProviderProps from './props'
import AppProviderValue from './value'
import AlertSubProvider from './alert_provider'
import LanguageProvider from './language_provider'
import { AlertControl } from './alert_provider'

const AppContext = createContext({} as AppProviderValue)

const AppProvider = (props: AppProviderProps) => {
  const alertRender = AlertSubProvider()
  const languageValue = LanguageProvider()

  const value = {
    alert: AlertControl,
    language: languageValue,
  } as AppProviderValue

  return (
    <AppContext.Provider value={value}>
      {alertRender}
      {props.children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

export const useAlert = () => useContext(AppContext).alert

export const useLanguage = () => useContext(AppContext).language

export default AppProvider
