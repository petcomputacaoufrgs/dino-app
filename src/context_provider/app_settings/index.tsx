import React, { createContext, useContext, useEffect } from 'react'
import LanguageContextProvider from './language'
import AppSettingsContextType from '../../types/context_provider/AppSettingsContextType'
import AppSettingsContextUpdater from '../../context_updater/AppSettingsContextUpdater'
import SelectedFaqContextProvider from './selected_faq'
import CurrentFaqContextUpdater from '../../context_updater/CurrentFaqContextUpdater'
import ColorThemeContextProvider from './color_theme'

const AppSettingsContext = createContext({} as AppSettingsContextType)

const AppSettingsContextProvider: React.FC = (props) => {
  const languageContextProvider = LanguageContextProvider()
  const currentFaqContextProvider = SelectedFaqContextProvider()
  const colorThemeContextProvider = ColorThemeContextProvider()

  const value = {
    language: languageContextProvider,
    selectedFaq: currentFaqContextProvider,
    colorTheme: colorThemeContextProvider,
  } as AppSettingsContextType

  useEffect(() => {
    let handleAppSettingsChanged = () => {
      languageContextProvider.updateLanguage()
      colorThemeContextProvider.updateColorTheme()
    }

    let handleCurrentFaqChanged = () => {
      currentFaqContextProvider.updateFaq()
    }

    AppSettingsContextUpdater.setCallback(handleAppSettingsChanged)
    CurrentFaqContextUpdater.setCallback(handleCurrentFaqChanged)

    const cleanBeforeUpdate = () => {
      handleAppSettingsChanged = () => {}
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

export const useCurrentLanguage = () =>
  useContext(AppSettingsContext).language.current

export const useCurrentFaq = () =>
  useContext(AppSettingsContext).selectedFaq.current

export const useCurrentColorTheme = () =>
  useContext(AppSettingsContext).colorTheme.currentName

export default AppSettingsContextProvider
