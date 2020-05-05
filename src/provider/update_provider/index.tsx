import React, { useContext, createContext } from 'react'
import UpdateService from '../../services/UpdateService'
import { LanguageContext } from '../language_provider/index'
import NotesService from '../../services/NotesService'
import UpdaterProps from './props'

export const UpdaterContext = createContext({update: () => {}})

const UpdateProvider = (props: UpdaterProps): JSX.Element => {

    const languageContext = useContext(LanguageContext)    

    const update = () => {
        UpdateService.checkUpdates(languageContext)
        NotesService.checkUpdates()
    }

    return (
        <UpdaterContext.Provider value={{update: update}}>
            {props.children}
        </UpdaterContext.Provider>
    )
}

export default UpdateProvider