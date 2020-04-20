import React, { useContext } from 'react'
import LocalStorageService from '../../services/LocalStorageService'
import UpdateService from '../../services/UpdateService'
import { LanguageContext } from '../language_provider/index'
import UpdaterProps from './props'

const Updater = (props: UpdaterProps): JSX.Element => {

    const languageContext = useContext(LanguageContext)    

    LocalStorageService.cleanLocalStorageGarbage()
    UpdateService.checkUpdates(languageContext)

    return (
        <>
        {props.children}
        </>
    )
}

export default Updater