import React, { createContext, useContext } from 'react'
import AppProviderProps from './props'
import AppProviderValue from './value'
import AlertSubProvider from './alert_sub_provider'
import LanguageSubProvider from './language_sub_provider/index'

const AppContext = createContext({} as AppProviderValue)

const AppProvider = (props: AppProviderProps) => {
    const [alertRender, alertValue] = AlertSubProvider()
    const languageValue = LanguageSubProvider()
    
    const value = {
        alert: alertValue,
        language: languageValue
    } as AppProviderValue

    return (
        <AppContext.Provider value={ value }>
            {alertRender}
            {props.children}
        </AppContext.Provider>
    )
}

export const useApp = () => (
    useContext(AppContext)
)

export const useAlert = () => (
    useContext(AppContext).alert
)

export const useLanguage = () => (
    useContext(AppContext).language
)

export default AppProvider