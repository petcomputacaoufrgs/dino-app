import React, { createContext } from 'react'
import DatabaseProviderProps from './props'
import DatabaseManager from '../../database/DatabaseManager'

export const DatabaseContext = createContext({} as PouchDB.Database)

const DatabaseProvider = (props: DatabaseProviderProps) => {
    const value = DatabaseManager.getDatabase()

    return (
        <DatabaseContext.Provider value={ value }>
            {props.children}
        </DatabaseContext.Provider>
    )
}

export default DatabaseProvider