import React, { createContext, useState } from 'react'
import LanguageProviderProps from './props'
import LanguageSet from '../../language/LanguageSet'
import EN_US from '../../language/EN_US'
import PT_BR from '../../language/PT_BR'
import AppSettingsService from '../../services/AppSettingsService'
import LanguageProviderValue, { Language } from './LanguageProviderValue'
import LanguageCodeConstants from '../../constants/LanguageCodeConstants'

export const LanguageContext = createContext({
    'currentLanguage': new PT_BR(),
    'getLanguageList': () => new Array<Language>(),
    'updateLanguage': () => {}
} as LanguageProviderValue)


/**
 * @description Gera um objeto do tipo LanguageSet com os textos na linguagem correta
 * @param props Propriedades do LanguageProvider
 */
const LanguageProvider = (props: LanguageProviderProps) : JSX.Element => {

    const getLanguageSetByCode = (languageCode: string): LanguageSet => {
        if (languageCode === LanguageCodeConstants.PORTUGUESE) {
            return new PT_BR()
        } else {
            return new EN_US()
        }
    }

    const getLanguageSet = (): LanguageSet => {
        const language = AppSettingsService.getAppSettings().language

        return getLanguageSetByCode(language)
    }

    const setHTMLElementLanguage = (language: LanguageSet) => {
        const html = document.getElementById("html")

        if (html) {
            html.lang = language.ISO_LANGUAGE_CODE
        }
    }

    const [currentLanguage, setCurrentLanguage] = useState(getLanguageSet())
    setHTMLElementLanguage(currentLanguage)

    const updateCurrentLanguage = () => {
        const language = getLanguageSet()

        setHTMLElementLanguage(language)

        setCurrentLanguage(language)
    }

    const getLanguageList = (): Language[] => {
        const language = getLanguageSet()

        return [
            {
                'code': LanguageCodeConstants.PORTUGUESE,
                'name': language.LANGUAGE_PORTUGUESE
            } as Language,
            {
                'code': LanguageCodeConstants.ENGLISH,
                'name': language.LANGUAGE_ENGLISH
            } as Language
        ]
    }

    const provider: LanguageProviderValue  = {
        'currentLanguage': currentLanguage,
        'getLanguageList': getLanguageList,
        'updateLanguage': updateCurrentLanguage
    }

    return (
        <LanguageContext.Provider value={ provider }>
            {props.children}
        </LanguageContext.Provider>
    )
}

export default LanguageProvider
