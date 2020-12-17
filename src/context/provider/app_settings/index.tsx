import React, { createContext, useContext, useEffect } from 'react'
import LanguageContextProvider from './language'
import AppSettingsContextUpdater from '../../updater/AppSettingsContextUpdater'
import SelectedFaqContextProvider from './selected_faq'
import CurrentFaqContextUpdater from '../../updater/CurrentFaqContextUpdater'
import ColorThemeContextProvider from './color_theme'
import AppSettingsContextType from '../../../types/context_provider/AppSettingsContextType'
import FontSizeContextProvider from './font_size'

const AppSettingsContext = createContext({} as AppSettingsContextType)

const AppSettingsContextProvider: React.FC = (props) => {
  const languageContextProvider = LanguageContextProvider()
  const fontSizeContextProvider = FontSizeContextProvider()
  const currentFaqContextProvider = SelectedFaqContextProvider()
  const colorThemeContextProvider = ColorThemeContextProvider()

  const value = {
    language: languageContextProvider,
    fontSize: fontSizeContextProvider,
    selectedFaq: currentFaqContextProvider,
    colorTheme: colorThemeContextProvider,
  } as AppSettingsContextType

  useEffect(() => {
    let handleAppSettingsChanged = () => {
      languageContextProvider.updateLanguage()
      colorThemeContextProvider.updateColorTheme()
      fontSizeContextProvider.updateFontSize()
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

export const useCurrentFontSize = () =>
  useContext(AppSettingsContext).fontSize.currentName

export default AppSettingsContextProvider
