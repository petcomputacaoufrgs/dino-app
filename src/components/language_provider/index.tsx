import React, { createContext, useState } from 'react'
import LanguageProviderProps from './props'
import LanguageSet from '../../language/LanguageSet'
import EN_US from '../../language/EN_US'
import PT_BR from '../../language/PT_BR'
import LocalStorageService from '../../services/LocalStorageService'
import LanguageListContext from './LanguageListContext'
import LanguageCodeConstants from '../../constants/LanguageCodeConstants'

/**
 * @description Contexto de linguagem
 */
export const LanguageProviderContext = createContext(new PT_BR())

/**
 * @description Contexto com a lista de linguagens
 */
export const LanguageListProviderContext = createContext(new Array<LanguageListContext>())

/**
 * @description Contexto com função para mudar a linguagem
 */
export const LanguageSetProviderContext = createContext((languageCode: string) => {})

/**
 * @description Gera um objeto do tipo LanguageSet com os textos na linguagem correta
 * @param props Propriedades do LanguageProvider
 */
const LanguageProvider = (props: LanguageProviderProps) : JSX.Element => {

    /**
     * Recebe um código de linguagem e retorna o LanguageSet relacionado.
     * Caso o código seja inválido o default é Inglês
     * @param languageCode Código da linha padronizado para navegadores
     */
    const getLanguageSetByCode = (languageCode: string): LanguageSet => {
        if (languageCode === LanguageCodeConstants.PORTUGUESE) {
            return new PT_BR()
        } else {
            return new EN_US()
        }
    }

    /**
     * @description Define o conjunto de textos a ser utilizado baseado na linguagem do navegador
     * @todo Variar conforme a configuração da conta do usuário
     */
    const getLanguageSet = (): LanguageSet => {
        let languageCode = LocalStorageService.getLanguage()

        if (!languageCode) {
            languageCode = navigator.language
            LocalStorageService.setLanguage(languageCode)
        }

        return getLanguageSetByCode(languageCode)
    }

    const [currentLanguage, setCurrentLanguage] = useState(getLanguageSet())

    const setCurrentLanguageByCode = (languageCode: string) => {
        let language;

        if (languageCode === LanguageCodeConstants.PORTUGUESE) {
            language = new PT_BR()
        } else {
            language = new EN_US()
        }

        setCurrentLanguage(language)
        LocalStorageService.setLanguage(language.LANGUAGE_CODE)
    }

    const getLanguageList = (): LanguageListContext[] => {
        const language = getLanguageSet()

        return [
            new LanguageListContext(language.LANGUAGE_PORTUGUESE, LanguageCodeConstants.PORTUGUESE),
            new LanguageListContext(language.LANGUAGE_ENGLISH, LanguageCodeConstants.ENGLISH)
        ]
    }

    return (
        <LanguageProviderContext.Provider value={ currentLanguage }>
            <LanguageListProviderContext.Provider value={ getLanguageList() }>
                <LanguageSetProviderContext.Provider value={ setCurrentLanguageByCode }>
                    {props.children}
                </LanguageSetProviderContext.Provider>
            </LanguageListProviderContext.Provider>
        </LanguageProviderContext.Provider>
    )
}

export default LanguageProvider
