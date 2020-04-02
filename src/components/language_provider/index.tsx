import React, { createContext } from 'react'
import PT_BR from '../../language/PT_BR';
import LanguageProviderProps from './props'
import LanguageSet from '../../language/LanguageSet'
import EN_US from '../../language/EN_US';

/**
 * @description Contexto de linguagem
 */
export const LanguageProviderContext = createContext(new PT_BR())

/**
 * @description Gera um objeto do tipo LanguageSet com os textos na linguagem correta
 * @param props Propriedades do LanguageProvider
 */
const LanguageProvider = (props: LanguageProviderProps) : JSX.Element => {

    /**
     * @description Define o conjunto de textos a ser utilizado baseado na linguagem do navegador
     * @todo Variar conforme a configuração da conta do usuário
     */
    const getLanguageSet = (): LanguageSet => {
        const language = navigator.language

        if (language === 'pt-BR') {
            return new PT_BR()
        } else {
            return new EN_US()
        }
    }

    return (
        <LanguageProviderContext.Provider value={ getLanguageSet() }>
            {props.children}
        </LanguageProviderContext.Provider>
    )
}

export default LanguageProvider
