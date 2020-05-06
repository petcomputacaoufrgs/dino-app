import React, { createContext } from 'react'
import AppProviderProps from './props'
import AppProviderValue from './value'
import AlertSubProvider from './alert_sub_provider'
import DatabaseSubProvider from './database_sub_provider'
import LanguageSubProvider from './language_sub_provider/index'
import UpdaterSubProvider from './updater_sub_provider/index'

export const AppContext = createContext({} as AppProviderValue)

const AppProvider = (props: AppProviderProps) => {
    const [alertRender, alertValue] = AlertSubProvider()
    const databaseValue = DatabaseSubProvider()
    const languageValue = LanguageSubProvider()
    const updateValue = UpdaterSubProvider(languageValue)
    
    const value = {
        alert: alertValue,
        database: databaseValue,
        language: languageValue,
        updater: updateValue
    } as AppProviderValue

    return (
        <AppContext.Provider value={ value }>
            {alertRender}
            {props.children}
        </AppContext.Provider>
    )
}

export default AppProvider