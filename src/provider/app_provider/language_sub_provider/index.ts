import { useState } from 'react'
import LanguageSet from '../../../language/LanguageSet'
import EN_US from '../../../language/EN_US'
import PT_BR from '../../../language/PT_BR'
import LanguageSubProviderValue, { Language } from './value'
import LanguageCodeConstants from '../../../constants/LanguageCodeConstants'
import AppSettingsService from '../../../services/app_settings/AppSettingsService'

const LanguageSubProvider = (): LanguageSubProviderValue => {
  const getLanguageSetByCode = (languageCode: string): LanguageSet => {
    if (languageCode === LanguageCodeConstants.PORTUGUESE) {
      return new PT_BR()
    } else {
      return new EN_US()
    }
  }

  const getLanguageSet = (): LanguageSet => {
    const language = AppSettingsService.get().language

    return getLanguageSetByCode(language)
  }

  const setHTMLElementLanguage = (language: LanguageSet) => {
    const html = document.getElementById('html')

    if (html) {
      html.lang = language.ISO_LANGUAGE_CODE
    }
  }

  const [currentLanguage, setCurrentLanguage] = useState(getLanguageSet())

  setHTMLElementLanguage(currentLanguage)

  const updateCurrentLanguage = (): LanguageSet => {
    const language = getLanguageSet()

    setHTMLElementLanguage(language)

    setCurrentLanguage(language)

    return language
  }

  const getLanguageList = (): Language[] => {
    const language = getLanguageSet()

    return [
      {
        code: LanguageCodeConstants.PORTUGUESE,
        name: language.LANGUAGE_PORTUGUESE,
      } as Language,
      {
        code: LanguageCodeConstants.ENGLISH,
        name: language.LANGUAGE_ENGLISH,
      } as Language,
    ]
  }

  const value: LanguageSubProviderValue = {
    current: currentLanguage,
    getLanguageList: getLanguageList,
    updateLanguage: updateCurrentLanguage,
  }

  return value
}

export default LanguageSubProvider
